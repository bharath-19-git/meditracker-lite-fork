# 🚀 Deployment Guide - MediTrack Lite

Complete step-by-step guide to deploy your backend on **Render** and frontend on **Vercel**.

---

## 📋 Prerequisites

- GitHub account
- MongoDB Atlas account (free tier is fine)
- Render account (https://render.com)
- Vercel account (https://vercel.com)

---

## Part 1: MongoDB Atlas Setup (Required for Backend)

### Step 1.1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free" and create an account
3. Verify your email

### Step 1.2: Create a Cluster
1. Select "Build a Database" → "Free" tier
2. Choose a cloud provider and region (closest to you)
3. Click "Create Cluster" (takes 3-5 minutes)

### Step 1.3: Create Database User
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create username and password (save these!)
5. Set user privileges to "Read and write to any database"
6. Click "Add User"

### Step 1.4: Whitelist IP Address
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Click "Confirm"

### Step 1.5: Get Connection String
1. Go to "Databases" → Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority`)
4. Replace `<password>` with your database user password
5. **Save this connection string** - you'll need it for Render

---

## Part 2: Backend Deployment on Render

### Step 2.1: Prepare Your Code
1. Commit and push your code to GitHub:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

### Step 2.2: Create Render Account
1. Go to https://render.com
2. Sign up (you can use GitHub OAuth)
3. Verify your email

### Step 2.3: Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select your repository

### Step 2.4: Configure Backend Service
Fill in the following settings:

- **Name**: `meditrack-backend` (or any name you prefer)
- **Environment**: `Node`
- **Region**: Choose closest to you
- **Branch**: `main`

**Build Settings:**
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### Step 2.5: Add Environment Variables
Click "Advanced" → "Add Environment Variable" and add:

```
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<generate-a-random-32-character-string>
PORT=5000
NODE_ENV=production
FRONTEND_URL=http://localhost:3000
```

**Important:**
- Replace `<your-mongodb-connection-string>` with the connection string from Step 1.5
- Replace `<generate-a-random-32-character-string>` with a secure random string
- You can generate a JWT secret by running: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### Step 2.6: Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Once deployed, copy your backend URL (e.g., `https://meditrack-backend.onrender.com`)

### Step 2.7: Test Backend
Open in browser: `https://your-backend-url.onrender.com/api/health`

You should see: `{"message":"MediTrack Lite API is running!"}`

---

## Part 3: Frontend Deployment on Vercel

### Step 3.1: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel access

### Step 3.2: Import Project
1. Click "Add New..." → "Project"
2. Import your GitHub repository
3. Select the repository

### Step 3.3: Configure Frontend Build
Fill in the following settings:

- **Framework Preset**: `Create React App`
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### Step 3.4: Add Environment Variables
Click "Environment Variables" → "Add" and add:

```
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

Replace `your-backend-url.onrender.com` with your actual Render URL from Step 2.6

### Step 3.5: Deploy
1. Click "Deploy"
2. Wait for build to complete (2-5 minutes)
3. Copy your frontend URL (e.g., `https://meditrack-lite.vercel.app`)

### Step 3.6: Test Frontend
1. Open your Vercel URL in browser
2. Try to register a user
3. Test the application

---

## Part 4: Final Configuration

### Step 4.1: Update Backend CORS (Important!)
1. Go back to Render dashboard
2. Find your backend service
3. Go to "Environment" → "Environment Variables"
4. Update `FRONTEND_URL` to your Vercel URL:
   ```
   FRONTEND_URL=https://your-frontend.vercel.app
   ```
5. Save and redeploy

### Step 4.2: Update CORS in server.js (Alternative)
You can also update the backend code directly to hardcode your frontend URL:

```javascript
app.use(cors({
  origin: 'https://your-frontend.vercel.app',
  credentials: true
}))
```

Then redeploy the backend.

---

## ✅ Testing Your Deployed Application

### Test Checklist:
- [ ] Backend health check returns success
- [ ] Frontend loads without errors
- [ ] Can register new users
- [ ] Can login
- [ ] Can book appointments (as patient)
- [ ] Can accept appointments (as doctor)
- [ ] Can update appointment status
- [ ] Can submit feedback

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Backend won't start
- Check environment variables in Render dashboard
- Verify MongoDB connection string is correct
- Check logs in Render dashboard

**Problem**: "MongoDB connection error"
- Verify IP is whitelisted in MongoDB Atlas
- Check connection string format
- Ensure username/password are correct

**Problem**: CORS errors
- Update `FRONTEND_URL` environment variable in Render
- Or hardcode frontend URL in `backend/server.js`

### Frontend Issues

**Problem**: "Cannot connect to API"
- Verify `REACT_APP_API_URL` is set in Vercel
- Check that backend URL is correct and accessible
- Ensure backend is running on Render

**Problem**: Build fails on Vercel
- Check Vercel build logs
- Ensure "Root Directory" is set to `frontend`
- Verify all dependencies are in `frontend/package.json`

**Problem**: Environment variables not working
- In Vercel, environment variables MUST start with `REACT_APP_`
- Redeploy after adding environment variables

---

## 📝 Quick Reference

### Render (Backend) Settings:
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### Vercel (Frontend) Settings:
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `build`

### Environment Variables Needed:

**Render (Backend):**
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```

**Vercel (Frontend):**
```
REACT_APP_API_URL=https://your-backend.onrender.com/api
```

---

## 🔄 Updating Your Deployment

### To update backend:
1. Make changes to backend code
2. Commit and push to GitHub
3. Render auto-deploys from GitHub
4. Wait for deployment to complete

### To update frontend:
1. Make changes to frontend code
2. Commit and push to GitHub
3. Vercel auto-deploys from GitHub
4. Wait for deployment to complete

---

## 💡 Tips

1. **Free Tier Limits:**
   - Render free tier spins down after 15 minutes of inactivity
   - First request after idle may take 30-60 seconds
   - Consider upgrading for production use

2. **MongoDB Atlas:**
   - Free tier includes 512MB storage
   - Enough for development/testing
   - Upgrade if you need more

3. **Performance:**
   - First deployment takes longer (installing dependencies)
   - Subsequent deployments are faster
   - Keep backend warm with external monitoring tools

---

## 📞 Support

If you encounter issues:
1. Check Render logs (Backend)
2. Check Vercel logs (Frontend)
3. Check MongoDB Atlas logs
4. Verify all environment variables are set correctly
5. Ensure CORS is configured properly

---

**Good luck with your deployment! 🚀**
