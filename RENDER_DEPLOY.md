# Render.com Deployment

## What's Configured

This project is ready to deploy to Render.com with:
- Backend API (Node.js/Express + PostgreSQL)
- Frontend (React + Vite)
- Automatic SSL certificates
- Free tier PostgreSQL database

## Quick Start

1. Push code to GitHub:
```bash
git add .
git commit -m "Add Render configuration"
git push
```

2. Go to [render.com](https://render.com) and sign up with GitHub

3. Create New → Blueprint → Select your repo

4. Render will auto-detect `render.yaml` and deploy everything

5. Your URLs will be:
   - Frontend: `https://bookswap-frontend.onrender.com`
   - Backend: `https://bookswap-backend.onrender.com`

## Free Tier Notes

- Services sleep after 15 min of inactivity
- First request after sleep takes ~30-50 seconds
- Use [cron-job.org](https://cron-job.org) to ping every 10 min to prevent sleep
- Database has 1GB storage limit

Full guide in `DEPLOYMENT.md` (Russian)
