# 🚀 Railway Deployment Guide

## Prerequisites
1. GitHub repository with your code
2. Railway account (free at railway.app)
3. Local development environment working

## Step 1: Prepare Your Repository

### 1.1 Push to GitHub
```bash
git add .
git commit -m "Add Railway deployment configuration"
git push origin main
```

## Step 2: Deploy to Railway

### 2.1 Create Railway Project
1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway will automatically detect it's a Node.js project

### 2.2 Add Database
1. In your Railway project dashboard
2. Click "New" → "Database" → "PostgreSQL"
3. Railway will create a PostgreSQL database
4. Note the `DATABASE_URL` from the database service

### 2.3 Configure Environment Variables
In your main service (not the database), add these environment variables:

```
NODE_ENV=production
PORT=3000
SESSION_SECRET=your-super-secure-production-session-secret-here
DATABASE_URL=postgresql://username:password@host:port/database
```

**Important**: 
- Generate a secure `SESSION_SECRET` (32+ characters)
- Use the `DATABASE_URL` provided by Railway's PostgreSQL service

### 2.4 Deploy
Railway will automatically deploy when you push to your main branch.

## Step 3: Database Migration

### 3.1 Run Database Migration
After deployment, you need to run the database migration:

```bash
# In Railway dashboard, go to your service
# Click "Deploy" → "Open Terminal"
# Run:
npm run db:push
```

Or add this as a one-time command in Railway.

## Step 4: Custom Domain (Optional)

1. In Railway dashboard, go to your service
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Railway will provide DNS instructions

## Local Development

Keep using your local environment:

```bash
# Start local development
npm run dev

# Your local .env file should contain:
DATABASE_URL=postgresql://lest:lest_dev_password@localhost:5433/lest_db
SESSION_SECRET=lest-hair-salon-super-secret-key-change-in-production-2025
NODE_ENV=development
PORT=3000
```

## Environment Separation

- **Local**: Uses Docker PostgreSQL on port 5433
- **Production**: Uses Railway PostgreSQL
- **Different session secrets**: Keep them separate for security

## Troubleshooting

### Build Issues
- Check Railway build logs in the dashboard
- Ensure all dependencies are in `package.json`

### Database Issues
- Verify `DATABASE_URL` is correct
- Run `npm run db:push` after deployment
- Check database connection in Railway logs

### Performance
- Railway automatically scales based on traffic
- Free tier includes 500 hours/month
- Upgrade to paid plan for always-on service

## Security Notes

1. **Never commit** `.env` files to git
2. **Use strong** session secrets in production
3. **Enable HTTPS** (automatic with Railway)
4. **Regular backups** of your database

## Monitoring

Railway provides:
- Real-time logs
- Metrics dashboard
- Error tracking
- Performance monitoring

---

**Cost**: Railway free tier is generous for small-medium apps (~$5-10/month for production use)
