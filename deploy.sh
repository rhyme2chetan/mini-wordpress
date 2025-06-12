#!/bin/bash

# Mini WordPress Deployment Preparation Script
echo "🚀 Preparing Mini WordPress for deployment..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    print_error "Please run this script from the Mini WordPress root directory"
    exit 1
fi

print_status "Checking prerequisites..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    print_warning "Git repository not initialized. Initializing..."
    git init
    git add .
    git commit -m "Initial commit: Mini WordPress application"
    print_success "Git repository initialized"
else
    print_success "Git repository found"
fi

# Check for .gitignore
if [ ! -f ".gitignore" ]; then
    print_status "Creating .gitignore file..."
    cat > .gitignore << EOL
# Dependencies
node_modules/
frontend/node_modules/
backend/node_modules/

# Environment variables
.env
.env.local
.env.production
.env.development

# Build outputs
frontend/build/
backend/dist/

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# OS files
.DS_Store
Thumbs.db

# Temporary files
tmp/
temp/
EOL
    print_success ".gitignore created"
fi

# Build frontend for production
print_status "Building frontend for production..."
cd frontend
if npm run build; then
    print_success "Frontend build completed"
else
    print_error "Frontend build failed"
    exit 1
fi
cd ..

# Check backend dependencies
print_status "Checking backend dependencies..."
cd backend
if npm audit --audit-level=high; then
    print_success "Backend dependencies check passed"
else
    print_warning "Some dependency issues found. Consider running 'npm audit fix'"
fi
cd ..

# Create deployment environment files
print_status "Creating deployment configuration..."

# Backend .env.example
cat > backend/.env.example << EOL
NODE_ENV=production
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
FRONTEND_URL=https://your-vercel-app.vercel.app
PORT=5000
EOL

# Frontend .env.example
cat > frontend/.env.example << EOL
REACT_APP_API_URL=https://your-render-service.onrender.com
EOL

print_success "Environment examples created"

# Commit changes
print_status "Committing deployment preparations..."
git add .
git commit -m "Prepare for deployment: Add build configs and environment examples"

# Display next steps
echo ""
echo "🎉 Deployment preparation complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Push your code to GitHub:"
echo "   ${BLUE}git remote add origin https://github.com/yourusername/mini-wordpress.git${NC}"
echo "   ${BLUE}git branch -M main${NC}"
echo "   ${BLUE}git push -u origin main${NC}"
echo ""
echo "2. Deploy Backend to Render:"
echo "   - Visit: ${BLUE}https://render.com${NC}"
echo "   - Create new Web Service from your GitHub repo"
echo "   - Root directory: ${BLUE}backend${NC}"
echo "   - Build command: ${BLUE}npm install${NC}"
echo "   - Start command: ${BLUE}npm start${NC}"
echo ""
echo "3. Deploy Frontend to Vercel:"
echo "   - Visit: ${BLUE}https://vercel.com${NC}"
echo "   - Import your GitHub repository"
echo "   - Root directory: ${BLUE}frontend${NC}"
echo "   - Framework: ${BLUE}Create React App${NC}"
echo ""
echo "4. Set Environment Variables:"
echo "   - Backend: DATABASE_URL, JWT_SECRET, FRONTEND_URL"
echo "   - Frontend: REACT_APP_API_URL"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
echo ""
print_success "Ready for deployment! 🚀" 