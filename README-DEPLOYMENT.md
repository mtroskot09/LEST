# 🚀 Quick Deployment Guide

## Local Development
```bash
# Start local development (uses Docker PostgreSQL)
npm run dev
```

## Railway Deployment

### 1. Push to GitHub
```bash
git add .
git commit -m "Add Railway deployment configuration"
git push origin main
```

### 2. Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway auto-detects Node.js and deploys

### 3. Add Database
1. In Railway dashboard: "New" → "Database" → "PostgreSQL"
2. Copy the `DATABASE_URL` from the database service

### 4. Set Environment Variables
In your main service, add:
```
NODE_ENV=production
PORT=3000
SESSION_SECRET=your-secure-production-secret-here
DATABASE_URL=postgresql://username:password@host:port/database
```

### 5. Database Migration
Railway will automatically run `npm run db:push` after deployment.

## Environment Separation

- **Local**: Docker PostgreSQL on port 5433
- **Production**: Railway PostgreSQL
- **Different session secrets** for security

## Cost
- Railway free tier: 500 hours/month
- Paid plan: ~$5-10/month for always-on

---

See `DEPLOYMENT.md` for detailed instructions.
