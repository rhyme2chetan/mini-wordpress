import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({});

  const fetchPosts = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get('/api/posts', {
        params: { page, search, limit: 6 }
      });
      
      setPosts(response.data.posts);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts(1);
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
      {/* Hero Section */}
      <div className="text-center py-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg mb-12 text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Mini WordPress
        </h1>
        <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
          A modern, beautiful blog platform built with React, Node.js, and Tailwind CSS
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pr-10 w-full"
            />
            <button
              type="submit"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No posts found</h3>
          <p className="text-gray-500">
            {search ? 'Try adjusting your search terms.' : 'Be the first to create a post!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {posts.map((post) => (
            <article key={post.id} className="card group hover:shadow-lg transition-shadow duration-200">
              <div className="card-body">
                <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  <Link to={`/post/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>
                
                {post.excerpt && (
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>By {post.author_name || post.username}</span>
                  <time dateTime={post.created_at}>
                    {format(new Date(post.created_at), 'MMM dd, yyyy')}
                  </time>
                </div>
                
                <div className="mt-4">
                  <Link 
                    to={`/post/${post.slug}`}
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mb-8">
          <button
            onClick={() => fetchPosts(pagination.currentPage - 1)}
            disabled={!pagination.hasPrev}
            className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <span className="text-sm text-gray-700">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          
          <button
            onClick={() => fetchPosts(pagination.currentPage + 1)}
            disabled={!pagination.hasNext}
            className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Home; 