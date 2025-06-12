import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchMyPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/posts/my-posts', {
        params: { status: statusFilter }
      });
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchMyPosts();
  }, [fetchMyPosts]);

  const deletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await axios.delete(`/api/posts/${postId}`);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    
    switch (status) {
      case 'published':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'draft':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              My Posts
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link to="/create" className="btn-primary">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Post
            </Link>
          </div>
        </div>
      </div>

      {/* Status Filter */}
      <div className="mb-6">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
              {['all', 'published', 'draft'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    statusFilter === status
                      ? 'bg-white text-gray-900 shadow'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No posts found</h3>
          <p className="text-gray-500 mb-4">
            {statusFilter === 'all' 
              ? 'Get started by creating your first post.' 
              : `No ${statusFilter} posts found.`}
          </p>
          <Link to="/create" className="btn-primary">
            Create your first post
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {posts.map((post) => (
              <li key={post.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {post.title}
                        </h3>
                        <span className={getStatusBadge(post.status)}>
                          {post.status}
                        </span>
                      </div>
                      
                      {post.excerpt && (
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                      
                      <div className="mt-2 flex items-center text-sm text-gray-500 space-x-4">
                        <time dateTime={post.created_at}>
                          Created {format(new Date(post.created_at), 'MMM dd, yyyy')}
                        </time>
                        <time dateTime={post.updated_at}>
                          Updated {format(new Date(post.updated_at), 'MMM dd, yyyy')}
                        </time>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {post.status === 'published' && (
                        <Link
                          to={`/post/${post.slug}`}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          View
                        </Link>
                      )}
                      <Link
                        to={`/edit/${post.id}`}
                        className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deletePost(post.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 