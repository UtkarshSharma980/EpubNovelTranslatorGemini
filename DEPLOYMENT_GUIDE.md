# Novel Translator - Deployment Guide

This guide will help you deploy the Novel Translator application using **Render** for the backend and **Cloudflare Pages** for the frontend.

## Prerequisites

Before starting, make sure you have:
- [MongoDB Atlas](https://cloud.mongodb.com/) account and cluster
- [Google Gemini API key](https://makersuite.google.com/app/apikey) 
- [GitHub](https://github.com/) account
- [Render](https://render.com/) account
- [Cloudflare](https://dash.cloudflare.com/) account

## 🛠️ Backend Deployment (Render)

### Step 1: Prepare Your Repository
1. Push your code to GitHub (make sure `.env` files are NOT committed)
2. Your backend should be in the `/backend` folder

### Step 2: Create Render Web Service
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:

**Basic Settings:**
- **Name**: `novel-translator-backend` (or your preferred name)
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: `backend`

**Build & Deploy Settings:**
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### Step 3: Environment Variables
In the Render dashboard, add these environment variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/novel-translator?retryWrites=true&w=majority
GEMINI_API_KEY=your_actual_gemini_api_key
NODE_ENV=production
PORT=10000
```

**Important**: Replace with your actual MongoDB connection string and Gemini API key.

### Step 4: Deploy
1. Click "Create Web Service"
2. Wait for deployment (usually 2-5 minutes)
3. Your backend will be available at: `https://your-service-name.onrender.com`

### Step 5: Test Backend
Visit `https://your-service-name.onrender.com/health` to verify it's working.

---

## 🌐 Frontend Deployment (Cloudflare Pages)

### Step 1: Update Frontend Configuration
1. In `/frontend/.env.production`, update the API URL:
```
VITE_API_URL=https://your-render-service-name.onrender.com/api
```

2. In your frontend files, update the fallback URL from:
```javascript
'https://your-render-app.onrender.com/api'
```
to your actual Render URL.

### Step 2: Build Locally (Test)
```bash
cd frontend
npm run build
```
Ensure the build completes without errors.

### Step 3: Deploy to Cloudflare Pages

#### Option A: Git Integration (Recommended)
1. Go to [Cloudflare Pages](https://dash.cloudflare.com/pages)
2. Click "Create a project" → "Connect to Git"
3. Select your repository
4. Configure build settings:

**Build Settings:**
- **Project name**: `novel-translator` (or your choice)
- **Production branch**: `main`
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `frontend`

**Environment Variables:**
```
VITE_API_URL=https://your-render-service-name.onrender.com/api
VITE_NODE_ENV=production
```

#### Option B: Direct Upload
1. Build locally: `cd frontend && npm run build`
2. Go to Cloudflare Pages → "Upload assets"
3. Upload the `dist` folder contents

### Step 4: Configure Custom Domain (Optional)
1. In Cloudflare Pages, go to "Custom domains"
2. Add your domain and follow DNS instructions

---

## 🔧 Post-Deployment Configuration

### Update CORS Settings
Once you have your Cloudflare Pages URL, update the backend CORS configuration:

1. Go to your Render service dashboard
2. Update the environment variable:
```
FRONTEND_URL=https://your-app.pages.dev
```
3. Or add it to the CORS origins in your backend code

### Test the Application
1. Visit your Cloudflare Pages URL
2. Try uploading an EPUB file
3. Test the translation functionality

---

## 🔄 Continuous Deployment

Both services are configured for automatic deployment:
- **Render**: Redeploys on every push to your main branch
- **Cloudflare Pages**: Rebuilds and deploys on every push

---

## 📚 Environment Variables Summary

### Backend (Render)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/novel-translator
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-app.pages.dev
```

### Frontend (Cloudflare Pages)
```
VITE_API_URL=https://your-render-app.onrender.com/api
VITE_NODE_ENV=production
```

---

## 🐛 Troubleshooting

### Common Issues:

1. **CORS Errors**: Ensure frontend URL is added to backend CORS configuration
2. **Build Failures**: Check Node.js version compatibility (use Node 18+)
3. **MongoDB Connection**: Verify connection string format and network access
4. **API Errors**: Check Render logs for backend issues
5. **Environment Variables**: Ensure all required variables are set

### Useful Commands:
```bash
# Test backend locally
cd backend && npm run dev

# Test frontend locally
cd frontend && npm run dev

# Build frontend
cd frontend && npm run build

# Check logs on Render
# Available in Render dashboard → Logs tab
```

---

## 📞 Support Resources

- [Render Documentation](https://render.com/docs)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Gemini API Docs](https://ai.google.dev/docs)

Your Novel Translator app should now be fully deployed and accessible to users worldwide! 🚀
