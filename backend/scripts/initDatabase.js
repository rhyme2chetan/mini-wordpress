const pool = require('../config/database');

async function initDatabase() {
  try {
    console.log('🔄 Initializing database...');

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create posts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        slug VARCHAR(255) UNIQUE NOT NULL,
        status VARCHAR(20) DEFAULT 'draft',
        author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
      CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
      CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
      CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
    `);

    // Insert a default admin user
    const adminPassword = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'; // password = 'password'
    
    await pool.query(`
      INSERT INTO users (username, email, password, full_name)
      VALUES ('admin', 'admin@miniwordpress.com', $1, 'Admin User')
      ON CONFLICT (username) DO NOTHING
    `, [adminPassword]);

    console.log('✅ Database initialized successfully!');
    console.log('👤 Default admin user created:');
    console.log('   Username: admin');
    console.log('   Password: password');
    console.log('   Email: admin@miniwordpress.com');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase(); 