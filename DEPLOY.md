# Novel Translator - Deployment Guide

## Quick Deploy Commands

### For Heroku:
```bash
# Install Heroku CLI, then:
heroku create your-app-name
heroku config:set MONGODB_URI="your-mongodb-uri"
heroku config:set GEMINI_API_KEY="your-gemini-api-key"
heroku config:set NODE_ENV="production"
git push heroku main
```

### For Railway:
```bash
# Install Railway CLI, then:
railway login
railway init
railway add
railway run npm start
```

### For Render:
1. Connect your GitHub repo
2. Add environment variables in dashboard
3. Deploy automatically

### For VPS/Linux Server:
```bash
# Install dependencies
npm run install:all

# Build frontend
npm run build

# Set environment variables
export NODE_ENV=production
export MONGODB_URI="your-mongodb-uri"
export GEMINI_API_KEY="your-gemini-api-key"

# Start with PM2 (recommended)
npm install -g pm2
pm2 start backend/index.js --name "novel-translator"
pm2 startup
pm2 save
```

## Environment Variables Required:
- `MONGODB_URI` - Your MongoDB connection string
- `GEMINI_API_KEY` - Your Google Gemini API key
- `NODE_ENV` - Set to "production"
- `PORT` - Will be set automatically by most hosting providers

## Important Notes:
- Frontend is built and served by the backend in production
- Make sure your MongoDB allows connections from your hosting provider's IPs
- Keep your API keys secure and never commit them to Git
