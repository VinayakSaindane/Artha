# 🚀 Deploying ARTHA to Vercel

This guide will walk you through deploying your Finance Dashboard (ARTHA) application to Vercel.

## Prerequisites

Before deploying, make sure you have:
- A [Vercel account](https://vercel.com/signup) (free tier works fine)
- Your GitHub repository: `https://github.com/VinayakSaindane/Artha.git`
- Required API keys and environment variables

## Step 1: Connect to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Click "Add New Project"

2. **Import Git Repository**
   - Click "Import Git Repository"
   - Select or authorize GitHub
   - Choose the `VinayakSaindane/Artha` repository

3. **Configure Project**
   - **Framework Preset**: Select "Other" or "Vite"
   - **Root Directory**: Leave as `./` (root)
   - **Build Command**: `npm run build` (already configured)
   - **Output Directory**: `dist/public` (already configured)
   - **Install Command**: `npm install` (already configured)

4. **Add Environment Variables**
   Click "Environment Variables" and add the following:
   
   ```
   DATABASE_URL=your_database_url
   GEMINI_API_KEY=your_gemini_api_key
   NODE_ENV=production
   SESSION_SECRET=your_random_secret_string
   MONGODB_URI=your_mongodb_uri (if using MongoDB)
   JWT_SECRET=your_jwt_secret (if using JWT)
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (usually 2-3 minutes)
   - Your app will be live at `https://your-project-name.vercel.app`

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from your project directory**
   ```bash
   cd /Users/vinayaksaindane/Downloads/Finance-Dashboard
   vercel
   ```

4. **Follow the prompts**
   - Set up and deploy? `Y`
   - Which scope? Select your account
   - Link to existing project? `N`
   - What's your project's name? `artha` (or your preferred name)
   - In which directory is your code located? `./`
   - Want to override the settings? `N`

5. **Add environment variables**
   ```bash
   vercel env add DATABASE_URL
   vercel env add GEMINI_API_KEY
   vercel env add SESSION_SECRET
   # Add other variables as needed
   ```

6. **Deploy to production**
   ```bash
   vercel --prod
   ```

## Step 2: Configure Database

### If using PostgreSQL (Recommended for Vercel)

1. **Create a database** on one of these services:
   - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) (easiest integration)
   - [Supabase](https://supabase.com) (free tier available)
   - [Neon](https://neon.tech) (serverless Postgres)

2. **Get your connection string** and add it to Vercel environment variables:
   ```
   DATABASE_URL=postgresql://user:password@host:port/database
   ```

### If using MongoDB

1. **Create a MongoDB Atlas cluster** at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. **Get your connection string** and add it to Vercel:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   ```

## Step 3: Post-Deployment Configuration

### Custom Domain (Optional)

1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

### Environment Variables Management

- **View/Edit**: Project Settings → Environment Variables
- **Production vs Preview**: You can set different values for production and preview deployments

### Monitoring

- **Analytics**: Enable Vercel Analytics in Project Settings
- **Logs**: View real-time logs in the "Deployments" tab → Click on a deployment → "Functions" tab

## Step 4: Verify Deployment

1. **Check the frontend**: Visit your Vercel URL
2. **Test API endpoints**: Try `https://your-app.vercel.app/api/health` or similar
3. **Check browser console**: Look for any errors
4. **Test authentication**: Ensure login/signup works

## Troubleshooting

### Build Fails

- Check the build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### API Routes Not Working

- Check that `/api` routes are properly configured in `vercel.json`
- Verify environment variables are set correctly
- Check function logs in Vercel dashboard

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Ensure your database allows connections from Vercel's IP ranges
- For MongoDB Atlas, whitelist all IPs (`0.0.0.0/0`) in Network Access

### Environment Variables Not Loading

- Redeploy after adding new environment variables
- Check variable names match exactly (case-sensitive)
- Ensure variables are set for "Production" environment

## Continuous Deployment

Vercel automatically deploys:
- **Production**: Every push to `main` branch
- **Preview**: Every push to other branches or pull requests

To disable auto-deployment:
1. Project Settings → Git
2. Configure deployment branches

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Environment Variables Guide](https://vercel.com/docs/concepts/projects/environment-variables)
- [Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions)

## Support

If you encounter issues:
1. Check [Vercel Status](https://www.vercel-status.com/)
2. Review [Vercel Community](https://github.com/vercel/vercel/discussions)
3. Contact Vercel Support through the dashboard

---

**Your ARTHA Finance Dashboard is now ready for production! 🎉**
