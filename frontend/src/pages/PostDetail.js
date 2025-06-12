import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { format } from 'date-fns';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const PostDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPost = useCallback(async () => {
    try {
      const response = await axios.get(`/api/posts/slug/${slug}`);
      setPost(response.data.post);
    } catch (error) {
      if (error.response?.status === 404) {
        setError('Post not found');
      } else {
        setError('Failed to load post');
      }
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">{error}</h3>
          <p className="text-gray-500 mb-4">The post you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <article className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-8 sm:px-8">
          <div className="mb-6">
            <Link 
              to="/" 
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              ← Back to posts
            </Link>
          </div>

          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <span>By {post.author_name || post.username}</span>
                <time dateTime={post.created_at}>
                  {format(new Date(post.created_at), 'MMMM dd, yyyy')}
                </time>
              </div>
              
              {post.updated_at !== post.created_at && (
                <span className="text-xs text-gray-500">
                  Updated {format(new Date(post.updated_at), 'MMM dd, yyyy')}
                </span>
              )}
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={tomorrow}
                      language={match[1]}
                      PreTag="div"
                      className="rounded-lg"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-gray-900 mb-4 mt-8 first:mt-0">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3 mt-6">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-5">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside mb-4 text-gray-700 space-y-1">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside mb-4 text-gray-700 space-y-1">
                    {children}
                  </ol>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary-200 bg-primary-50 pl-4 py-2 italic text-gray-700 mb-4">
                    {children}
                  </blockquote>
                ),
                a: ({ children, href }) => (
                  <a 
                    href={href} 
                    className="text-primary-600 hover:text-primary-700 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                img: ({ src, alt }) => (
                  <img 
                    src={src} 
                    alt={alt} 
                    className="rounded-lg shadow-md mb-4 max-w-full h-auto"
                  />
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 sm:px-8">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Published on {format(new Date(post.created_at), 'MMMM dd, yyyy')}
            </div>
            <Link 
              to="/" 
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Read more posts →
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
};

export default PostDetail; 