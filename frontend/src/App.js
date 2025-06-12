import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import PostDetail from './pages/PostDetail';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post/:slug" element={<PostDetail />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/create" element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          } />
          <Route path="/edit/:id" element={
            <ProtectedRoute>
              <EditPost />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App; 