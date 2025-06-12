import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    status: 'draft'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchPost = useCallback(async () => {
    try {
      const response = await axios.get(`/api/posts/${id}`);
      const post = response.data.post;
      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || '',
        status: post.status
      });
    } catch (error) {
      setError('Failed to load post');
      if (error.response?.status === 404) {
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await axios.put(`/api/posts/${id}`, formData);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
        <p className="mt-2 text-gray-600">Update your blog post with markdown support.</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="title"
                id="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="input"
                placeholder="Enter your post title"
              />
            </div>
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
              Excerpt (Optional)
            </label>
            <div className="mt-1">
              <textarea
                name="excerpt"
                id="excerpt"
                rows={3}
                value={formData.excerpt}
                onChange={handleChange}
                className="textarea"
                placeholder="Brief summary of your post"
              />
            </div>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <div className="mt-1">
              <textarea
                name="content"
                id="content"
                rows={20}
                required
                value={formData.content}
                onChange={handleChange}
                className="textarea font-mono text-sm"
                placeholder="Write your post content using Markdown..."
              />
            </div>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <div className="mt-1">
              <select
                name="status"
                id="status"
                value={formData.status}
                onChange={handleChange}
                className="input"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </div>
              ) : (
                'Update Post'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost; 