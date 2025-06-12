#!/bin/bash

echo "🚀 Setting up Mini WordPress Blog CMS..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Setup backend
echo "🔧 Setting up backend..."
cd backend
npm install

# Create .env file with database URL
echo "📝 Creating backend environment file..."
cat > .env << EOL
DATABASE_URL=postgresql://neondb_owner:npg_QpwEkOszAi01@ep-floral-cake-a1ow5ctl-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=mini-wordpress-jwt-secret-2024-super-secure-key
PORT=5000
NODE_ENV=development
EOL

# Initialize database
echo "🗄️  Initializing database..."
npm run init-db

cd ..

# Setup frontend
echo "🎨 Setting up frontend..."
cd frontend
npm install

cd ..

echo "✅ Setup complete!"
echo ""
echo "🎯 To start development:"
echo "   npm run dev"
echo ""
echo "🔐 Default login credentials:"
echo "   Username: admin"
echo "   Password: password"
echo ""
echo "🌐 URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000" 