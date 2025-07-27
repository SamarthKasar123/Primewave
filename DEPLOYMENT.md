# 🚀 Deployment Guide

This guide covers the complete deployment process for Primewave on various platforms.

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Frontend Deployment (Netlify)](#frontend-deployment-netlify)
- [Backend Deployment (Render)](#backend-deployment-render)
- [Database Setup (MongoDB Atlas)](#database-setup-mongodb-atlas)
- [Custom Domain Configuration](#custom-domain-configuration)
- [Environment Variables](#environment-variables)
- [CI/CD Setup](#cicd-setup)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Troubleshooting](#troubleshooting)

---

## 📚 Prerequisites

- GitHub account
- MongoDB Atlas account
- Netlify account
- Render account
- Custom domain (optional)
- Git installed locally

---

## 🌍 Environment Setup

### 1. Clone the Repository
```bash
git clone https://github.com/SamarthKasar123/Primewave.git
cd Primewave
```

### 2. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

## 🎨 Frontend Deployment (Netlify)

### Method 1: GitHub Integration (Recommended)

1. **Connect GitHub Repository**
   - Log in to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Choose GitHub and authorize
   - Select `Primewave` repository

2. **Configure Build Settings**
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/build
   ```

3. **Environment Variables**
   ```
   REACT_APP_API_URL=https://primewave-backend.onrender.com/api
   NODE_ENV=production
   ```

4. **Deploy Settings**
   - Branch to deploy: `main`
   - Auto-publish: `enabled`

### Method 2: Manual Deployment

1. **Build the Project**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `build` folder to Netlify dashboard
   - Or use Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=build
   ```

### 3. Configure Redirects
Create `frontend/public/_redirects`:
```
/*    /index.html   200
```

### 4. Custom Domain (Optional)
- In Netlify dashboard: Site settings → Domain management
- Add custom domain: `primewave.me`
- Configure DNS settings with your domain provider

---

## ⚡ Backend Deployment (Render)

### 1. Connect GitHub Repository
- Log in to [Render](https://render.com)
- Click "New +" → "Web Service"
- Connect GitHub repository
- Select `Primewave` repository

### 2. Configure Service Settings
```
Name: primewave-backend
Environment: Node
Region: Oregon (US West)
Branch: main
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

### 3. Environment Variables
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/primewave
JWT_SECRET=your_super_secure_jwt_secret_here
FRONTEND_URL=https://primewave.netlify.app
NODE_ENV=production
```

### 4. Advanced Settings
- **Auto-Deploy**: `Yes`
- **Health Check Path**: `/api/health`
- **Instance Type**: `Free` (for testing) or `Starter` (for production)

---

## 🗄️ Database Setup (MongoDB Atlas)

### 1. Create MongoDB Cluster
- Log in to [MongoDB Atlas](https://cloud.mongodb.com)
- Create new project: "Primewave"
- Create cluster: Choose free tier (M0)
- Select region closest to your backend

### 2. Configure Database Access
- Database Access → Add new database user
- Username: `your_username`
- Password: Generate secure password
- Built-in Role: `Read and write to any database`

### 3. Configure Network Access
- Network Access → Add IP Address
- Add `0.0.0.0/0` (Allow access from anywhere)
- Or add specific Render IP addresses

### 4. Get Connection String
- Clusters → Connect → Connect your application
- Copy connection string:
```
mongodb+srv://username:password@cluster.mongodb.net/primewave?retryWrites=true&w=majority
```

### 5. Seed Data
After deployment, seed manager accounts:
```bash
# Local seeding (recommended)
cd backend
node seedManagers.js

# Or create a one-time job on Render
```

---

## 🌐 Custom Domain Configuration

### For Frontend (Netlify)
1. **DNS Configuration**
   ```
   Type: CNAME
   Name: www
   Value: your-site-name.netlify.app

   Type: A
   Name: @
   Value: 75.2.60.5 (Netlify's IP)
   ```

2. **SSL Certificate**
   - Automatically provided by Netlify
   - Force HTTPS in site settings

### For Backend API (Custom Subdomain)
If using custom API domain (e.g., `api.primewave.me`):
```
Type: CNAME
Name: api
Value: primewave-backend.onrender.com
```

---

## 🔧 Environment Variables

### Backend (.env)
```env
# Production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/primewave
JWT_SECRET=generated_secure_secret_64_characters_minimum
FRONTEND_URL=https://primewave.me
NODE_ENV=production
PORT=5000
```

### Frontend (.env)
```env
# Production
REACT_APP_API_URL=https://primewave-backend.onrender.com/api
NODE_ENV=production
```

---

## 🔄 CI/CD Setup

### Automatic Deployment
Both Netlify and Render support automatic deployment:

1. **Push to main branch**
   ```bash
   git add .
   git commit -m "Deploy: production updates"
   git push origin main
   ```

2. **Deployment Triggers**
   - Netlify: Automatically builds and deploys frontend
   - Render: Automatically builds and deploys backend

### GitHub Actions (Optional)
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2
      with:
        node-version: '16'
    
    - name: Install Backend Dependencies
      run: cd backend && npm install
    
    - name: Install Frontend Dependencies
      run: cd frontend && npm install
    
    - name: Run Tests
      run: |
        cd backend && npm test
        cd ../frontend && npm test -- --coverage --watchAll=false

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - name: Deploy to Netlify
      run: echo "Frontend auto-deploys via Netlify"
    
    - name: Deploy to Render
      run: echo "Backend auto-deploys via Render"
```

---

## 📊 Monitoring & Maintenance

### Health Monitoring
- **Backend Health**: `https://primewave-backend.onrender.com/api/health`
- **Frontend Status**: Monitor via Netlify dashboard
- **Database Status**: MongoDB Atlas monitoring

### Performance Monitoring
```javascript
// Add to backend for basic monitoring
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});
```

### Backup Strategy
- **Database**: MongoDB Atlas automatic backups
- **Code**: GitHub repository serves as backup
- **Environment Variables**: Store securely in password manager

---

## 🚨 Troubleshooting

### Common Issues

#### Frontend Build Failures
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check environment variables
echo $REACT_APP_API_URL
```

#### Backend Connection Issues
1. **Check MongoDB Connection**
   ```bash
   # Test connection
   node testConnection.js
   ```

2. **Verify Environment Variables**
   ```bash
   # Check in Render dashboard
   # Ensure MONGO_URI is correct
   # Verify JWT_SECRET is set
   ```

#### CORS Errors
- Ensure `FRONTEND_URL` in backend matches actual frontend URL
- Check Render logs for CORS configuration
- Verify API calls use correct base URL

#### SSL/HTTPS Issues
- Ensure all API calls use `https://` in production
- Check mixed content warnings in browser console
- Verify SSL certificates are valid

### Debugging Steps

1. **Check Deployment Logs**
   - Netlify: Site → Functions → View logs
   - Render: Service → Logs tab

2. **Test API Endpoints**
   ```bash
   # Health check
   curl https://primewave-backend.onrender.com/api/health
   
   # Test authentication
   curl -X POST https://primewave-backend.onrender.com/api/auth/test
   ```

3. **Database Connection**
   ```bash
   # Check MongoDB Atlas
   # Verify network access rules
   # Check database user permissions
   ```

---

## 📞 Support

For deployment issues:
- **GitHub Issues**: [Create an issue](https://github.com/SamarthKasar123/Primewave/issues)
- **Netlify Support**: [Netlify Help](https://docs.netlify.com/)
- **Render Support**: [Render Docs](https://render.com/docs)
- **MongoDB Support**: [MongoDB Atlas Support](https://support.mongodb.com/)

---

## 🔗 Quick Links

- **Live Website**: [primewave.me](https://primewave.me)
- **Frontend App**: [primewave.netlify.app](https://primewave.netlify.app)
- **Backend API**: [primewave-backend.onrender.com](https://primewave-backend.onrender.com)
- **Repository**: [github.com/SamarthKasar123/Primewave](https://github.com/SamarthKasar123/Primewave)

---

**Last Updated**: January 27, 2025  
**Deployment Version**: 1.0.0
