# Mini WordPress Deployment Guide

This guide will help you deploy your Mini WordPress application to production using Vercel (frontend) and Render (backend).

## 🚀 Quick Deploy

### Prerequisites
- Git repository (GitHub, GitLab, etc.)
- Vercel account (free)
- Render account (free)

## 📦 Backend Deployment (Render)

### Option 1: Using Existing Neon Database (Recommended)

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Deploy Backend**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `backend` folder as the root directory
   - Configure:
     - **Name**: `mini-wordpress-backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Instance Type**: `Free`

3. **Set Environment Variables**
   ```
   NODE_ENV=production
   DATABASE_URL=postgresql://neondb_owner:npg_QpwEkOszAi01@ep-floral-cake-a1ow5ctl-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   JWT_SECRET=your-super-secret-jwt-key-here
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```

4. **Initialize Database**
   - After deployment, go to your service's "Events" tab
   - Your database should already be initialized from local setup
   - If not, run the init script manually

### Option 2: Using Render PostgreSQL

1. **Create Database**
   - Click "New +" → "PostgreSQL"
   - Name: `mini-wordpress-db`
   - Plan: `Free`

2. **Deploy Web Service**
   - Follow steps above
   - Use the auto-generated `DATABASE_URL` from Render

## 🌐 Frontend Deployment (Vercel)

### 1. Prepare Frontend

Update your environment variables in the deployed backend URL:

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Deploy Frontend**
   - Click "New Project"
   - Import your GitHub repository
   - Select the `frontend` folder as the root directory
   - Framework: `Create React App`
   - Build Command: `npm run build`
   - Output Directory: `build`

3. **Set Environment Variables**
   ```
   REACT_APP_API_URL=https://your-render-service.onrender.com
   ```

4. **Configure Domain (Optional)**
   - Go to Project Settings → Domains
   - Add your custom domain

## 🔧 Post-Deployment Configuration

### 1. Update Backend CORS

After getting your Vercel URL, update the backend CORS configuration:

```javascript
// In backend/server.js - already configured!
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [
      process.env.FRONTEND_URL,
      'https://mini-wordpress.vercel.app',
      'https://*.vercel.app'
    ].filter(Boolean)
  : ['http://localhost:3000'];
```

### 2. Update Frontend API URL

```javascript
// In frontend/src/config/api.js - already configured!
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_API_URL || 'https://your-backend-url.onrender.com'
  : 'http://localhost:5000';
```

## 🎯 Live URLs

After deployment, your app will be available at:

- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-service.onrender.com`
- **Health Check**: `https://your-service.onrender.com/health`

## 🔐 Default Login

Use the same credentials as local:
- **Username**: `admin`
- **Password**: `password`

## 📋 Deployment Checklist

- [ ] Backend deployed to Render
- [ ] Database connected (Neon or Render PostgreSQL)
- [ ] Environment variables set
- [ ] Health check responding
- [ ] Frontend deployed to Vercel
- [ ] API URL configured
- [ ] CORS updated with frontend URL
- [ ] Custom domain configured (optional)
- [ ] SSL certificates active
- [ ] Application fully functional

## 🐛 Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Check `FRONTEND_URL` environment variable
   - Verify Vercel domain in CORS origins

2. **Database Connection Issues**
   - Verify `DATABASE_URL` format
   - Check SSL settings for Neon

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies in package.json

4. **Environment Variables**
   - Ensure all required env vars are set
   - Check for typos in variable names

### Support

- Render Documentation: [render.com/docs](https://render.com/docs)
- Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)

## 🚀 Going Live

Your Mini WordPress blog is now live and ready for production use!

Features available:
- ✅ User authentication and registration
- ✅ Create, edit, and delete blog posts
- ✅ Markdown support with syntax highlighting
- ✅ Search and pagination
- ✅ Responsive design
- ✅ Admin dashboard
- ✅ SSL encryption
- ✅ Global CDN (Vercel)
- ✅ Auto-scaling (Render) 