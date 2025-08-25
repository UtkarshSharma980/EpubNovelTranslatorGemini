# Production Deployment Checklist ✅

## Before Deployment

### Backend Preparation
- [ ] MongoDB Atlas cluster created and configured
- [ ] Google Gemini API key obtained
- [ ] Backend `.env` file configured with production values
- [ ] Unnecessary dependencies removed (jszip, node-stream-zip)
- [ ] Port changed to 10000 for Render compatibility
- [ ] CORS configured for Cloudflare Pages domains
- [ ] Health check endpoints added

### Frontend Preparation
- [ ] API URLs updated to use environment variables
- [ ] Environment files created (.env.production)
- [ ] Build process tested locally
- [ ] React Router configured for SPA hosting

### Repository Preparation
- [ ] All code committed to GitHub
- [ ] `.env` files excluded from repository
- [ ] `.gitignore` updated for production files
- [ ] README and documentation updated

## Deployment Steps

### Render Backend Deployment
- [ ] Render account created
- [ ] Web service created and connected to GitHub
- [ ] Environment variables configured in Render
- [ ] Deployment successful and health check passes
- [ ] Backend URL noted for frontend configuration

### Cloudflare Pages Frontend Deployment
- [ ] Cloudflare account created
- [ ] Pages project created and connected to GitHub
- [ ] Build settings configured (npm run build, dist folder)
- [ ] Environment variables set in Cloudflare Pages
- [ ] Frontend URL noted for backend CORS

### Final Configuration
- [ ] Backend CORS updated with frontend URL
- [ ] Frontend API URL updated with backend URL
- [ ] Both services redeployed with updated configurations

## Post-Deployment Testing

### Functionality Tests
- [ ] Website loads without errors
- [ ] EPUB file upload works
- [ ] File parsing and chapter extraction successful
- [ ] Chapter navigation functions properly
- [ ] Translation feature works with Gemini API
- [ ] Original/translated text toggle works
- [ ] Mobile responsiveness verified

### Performance Tests
- [ ] Page load times acceptable
- [ ] EPUB upload handles large files
- [ ] Translation requests complete successfully
- [ ] Database operations perform well

### Error Handling
- [ ] Invalid file uploads handled gracefully
- [ ] API errors display user-friendly messages
- [ ] Network failures handled appropriately
- [ ] Loading states work correctly

## Service URLs

### Development
- Frontend: http://localhost:5173
- Backend: http://localhost:10000

### Production
- Frontend: https://your-app.pages.dev
- Backend: https://your-app.onrender.com

## Important Notes

1. **First Deployment**: Render services may take 2-5 minutes on first deployment
2. **Cold Starts**: Render free tier has cold start delays for inactive services
3. **File Limits**: Consider file upload size limits for large EPUB files
4. **API Quotas**: Monitor Google Gemini API usage and quotas
5. **Database**: MongoDB Atlas free tier has 512MB storage limit

## Environment Variables Backup

### Backend (.env)
```
MONGODB_URI=mongodb+srv://...
GEMINI_API_KEY=...
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-app.pages.dev
```

### Frontend (Cloudflare Pages)
```
VITE_API_URL=https://your-app.onrender.com/api
VITE_NODE_ENV=production
```

## Maintenance

### Regular Tasks
- [ ] Monitor API usage and costs
- [ ] Check database storage usage
- [ ] Review application logs for errors
- [ ] Update dependencies periodically
- [ ] Backup important data

### Scaling Considerations
- [ ] Upgrade Render plan for better performance
- [ ] Consider CDN for static assets
- [ ] Implement caching strategies
- [ ] Monitor and optimize database queries

---

**Deployment Date**: ___________  
**Deployed By**: ___________  
**Frontend URL**: ___________  
**Backend URL**: ___________
