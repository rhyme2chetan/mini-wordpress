const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Helper function to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
}

// Get all published posts (public)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT p.*, u.username, u.full_name as author_name
      FROM posts p
      JOIN users u ON p.author_id = u.id
      WHERE p.status = 'published'
    `;
    
    const queryParams = [];
    
    if (search) {
      query += ` AND (p.title ILIKE $${queryParams.length + 1} OR p.content ILIKE $${queryParams.length + 1})`;
      queryParams.push(`%${search}%`);
    }
    
    query += ` ORDER BY p.created_at DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(limit, offset);

    const result = await pool.query(query, queryParams);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM posts WHERE status = $1';
    const countParams = ['published'];
    
    if (search) {
      countQuery += ' AND (title ILIKE $2 OR content ILIKE $2)';
      countParams.push(`%${search}%`);
    }
    
    const countResult = await pool.query(countQuery, countParams);
    const totalPosts = parseInt(countResult.rows[0].count);

    res.json({
      posts: result.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalPosts / limit),
        totalPosts,
        hasNext: offset + limit < totalPosts,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single post by slug (public)
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await pool.query(`
      SELECT p.*, u.username, u.full_name as author_name
      FROM posts p
      JOIN users u ON p.author_id = u.id
      WHERE p.slug = $1 AND p.status = 'published'
    `, [slug]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({ post: result.rows[0] });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's posts (authenticated)
router.get('/my-posts', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'all' } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT p.*, u.username, u.full_name as author_name
      FROM posts p
      JOIN users u ON p.author_id = u.id
      WHERE p.author_id = $1
    `;
    
    const queryParams = [req.user.id];
    
    if (status !== 'all') {
      query += ` AND p.status = $${queryParams.length + 1}`;
      queryParams.push(status);
    }
    
    query += ` ORDER BY p.created_at DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(limit, offset);

    const result = await pool.query(query, queryParams);

    res.json({
      posts: result.rows
    });
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new post
router.post('/', authenticateToken, [
  body('title').isLength({ min: 1, max: 255 }).trim(),
  body('content').isLength({ min: 1 }),
  body('excerpt').optional().isLength({ max: 500 }).trim(),
  body('status').optional().isIn(['draft', 'published'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, excerpt, status = 'draft' } = req.body;
    let { slug } = req.body;

    // Generate slug if not provided
    if (!slug) {
      slug = generateSlug(title);
    }

    // Ensure slug is unique
    let uniqueSlug = slug;
    let counter = 1;
    
    while (true) {
      const existingPost = await pool.query('SELECT id FROM posts WHERE slug = $1', [uniqueSlug]);
      if (existingPost.rows.length === 0) break;
      
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    const result = await pool.query(`
      INSERT INTO posts (title, content, excerpt, slug, status, author_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [title, content, excerpt, uniqueSlug, status, req.user.id]);

    res.status(201).json({
      message: 'Post created successfully',
      post: result.rows[0]
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single post by ID (for editing)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT p.*, u.username, u.full_name as author_name
      FROM posts p
      JOIN users u ON p.author_id = u.id
      WHERE p.id = $1 AND p.author_id = $2
    `, [id, req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found or access denied' });
    }

    res.json({ post: result.rows[0] });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update post
router.put('/:id', authenticateToken, [
  body('title').optional().isLength({ min: 1, max: 255 }).trim(),
  body('content').optional().isLength({ min: 1 }),
  body('excerpt').optional().isLength({ max: 500 }).trim(),
  body('status').optional().isIn(['draft', 'published'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, content, excerpt, status } = req.body;

    const result = await pool.query(`
      UPDATE posts SET
        title = COALESCE($1, title),
        content = COALESCE($2, content),
        excerpt = COALESCE($3, excerpt),
        status = COALESCE($4, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $5 AND author_id = $6
      RETURNING *
    `, [title, content, excerpt, status, id, req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found or access denied' });
    }

    res.json({
      message: 'Post updated successfully',
      post: result.rows[0]
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete post
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM posts WHERE id = $1 AND author_id = $2 RETURNING id',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found or access denied' });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 