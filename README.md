# Mini WordPress - Blog CMS

A modern blog content management system built with React, Node.js, Tailwind CSS, and Neon PostgreSQL database.

## 🌟 Features

- **User Authentication**: JWT-based login and registration
- **Blog Management**: Create, edit, delete, and publish blog posts
- **Markdown Support**: Write posts in Markdown with syntax highlighting
- **Search & Pagination**: Find posts easily with built-in search
- **Responsive Design**: Beautiful UI that works on all devices
- **Admin Dashboard**: Manage your posts with an intuitive interface
- **Status Management**: Draft and published post states

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **React Markdown** - Markdown rendering with syntax highlighting
- **Date-fns** - Date formatting utilities

### Backend
- **Node.js & Express** - Server framework
- **PostgreSQL** - Relational database (Neon)
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Helmet** - Security middleware
- **Rate Limiting** - API protection

### Database
- **Neon PostgreSQL** - Serverless PostgreSQL database
- **Connection pooling** - Optimized database connections
- **SSL encryption** - Secure data transmission

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd mini-wordpress
   ```

2. **Quick Setup** (Recommended)
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000
   - API Health: http://localhost:5000/health

### Manual Setup

If you prefer manual setup:

1. **Install Dependencies**
   ```bash
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   cd ..
   ```

2. **Environment Configuration**
   ```bash
   # Backend environment
   cp backend/.env.example backend/.env
   # Update DATABASE_URL with your Neon PostgreSQL connection string
   ```

3. **Database Setup**
   ```bash
   cd backend && npm run init-db
   ```

4. **Start Development**
   ```bash
   npm run dev
   ```

## 🌐 Deployment

Deploy your Mini WordPress to production with **Vercel** (frontend) and **Render** (backend).

### Quick Deploy

1. **Prepare for Deployment**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

2. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/yourusername/mini-wordpress.git
   git branch -M main
   git push -u origin main
   ```

3. **Deploy Backend (Render)**
   - Visit [render.com](https://render.com)
   - Create Web Service from your GitHub repo
   - Root directory: `backend`
   - Build: `npm install` | Start: `npm start`

4. **Deploy Frontend (Vercel)**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Root directory: `frontend`
   - Framework: Create React App

### Environment Variables

**Backend (Render):**
```
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
FRONTEND_URL=https://your-vercel-app.vercel.app
```

**Frontend (Vercel):**
```
REACT_APP_API_URL=https://your-render-service.onrender.com
```

📖 **Detailed deployment guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🔐 Default Login

```
Username: admin
Password: password
```

## 📁 Project Structure

```
mini-wordpress/
├── frontend/                 # React application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React context (auth)
│   │   └── config/          # Configuration files
│   ├── tailwind.config.js   # Tailwind configuration
│   └── package.json
│
├── backend/                  # Node.js API server
│   ├── routes/              # API routes
│   ├── middleware/          # Express middleware
│   ├── config/              # Database config
│   ├── scripts/             # Utility scripts
│   └── server.js            # Main server file
│
├── setup.sh                 # Quick setup script
├── deploy.sh                # Deployment preparation
├── DEPLOYMENT.md            # Deployment guide
└── README.md                # This file
```

## 🎯 Available Scripts

### Root Directory
- `npm run dev` - Start both frontend and backend
- `npm run dev:frontend` - Start only frontend
- `npm run dev:backend` - Start only backend
- `./setup.sh` - Complete setup script
- `./deploy.sh` - Prepare for deployment

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

### Backend
- `npm run dev` - Start with nodemon
- `npm start` - Start production server
- `npm run init-db` - Initialize database

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile

### Posts
- `GET /api/posts` - Get all published posts (with search/pagination)
- `GET /api/posts/my-posts` - Get current user's posts
- `GET /api/posts/:id` - Get post by ID
- `GET /api/posts/slug/:slug` - Get post by slug
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Health Check
- `GET /health` - Server health status

## 🛡️ Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - Bcrypt with salt rounds
- **Rate Limiting** - Prevent API abuse
- **CORS Configuration** - Cross-origin request security
- **Helmet.js** - Security headers
- **Input Validation** - Express validator
- **SQL Injection Prevention** - Parameterized queries

## 🎨 UI Features

- **Responsive Design** - Mobile-first approach
- **Dark Mode Support** - Coming soon
- **Modern UI** - Clean, professional design
- **Loading States** - Smooth user experience
- **Error Handling** - User-friendly error messages
- **Form Validation** - Client-side validation
- **Animations** - Subtle hover effects and transitions

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   lsof -ti:3000,5000 | xargs kill -9
   ```

2. **Database connection issues**
   - Check your DATABASE_URL in .env
   - Ensure Neon database is accessible

3. **CORS errors in production**
   - Verify FRONTEND_URL environment variable
   - Check allowed origins in server.js

4. **Build failures**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Live Demo

- **Frontend**: [https://your-app.vercel.app](https://your-app.vercel.app)
- **Backend API**: [https://your-api.onrender.com](https://your-api.onrender.com)

## 🚀 What's Next?

Future enhancements planned:
- [ ] User roles and permissions
- [ ] Comment system
- [ ] Image upload functionality
- [ ] Email notifications
- [ ] SEO optimization
- [ ] Social media sharing
- [ ] Dark mode toggle
- [ ] Multi-language support

---

**Built with ❤️ using React, Node.js, and modern web technologies.** 