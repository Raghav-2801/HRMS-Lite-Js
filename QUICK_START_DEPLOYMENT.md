# 🚀 HRMS Lite - Quick Start Deployment Guide

Your HRMS Lite project is now ready for deployment! Follow these steps to get it live.

---

## 📊 What You Have

✅ **Backend**: FastAPI + SQLite (running locally)  
✅ **Frontend**: React + Vite + Tailwind (running locally)  
✅ **Git Repository**: Initialized locally  
✅ **Deployment Config**: Ready for Render + kapilraghav.info

---

## 🎯 Next Steps (30 minutes)

### Step 1: Create GitHub Repository (2 minutes)

1. Go to [GitHub.com](https://github.com) and login
2. Click "+" → "New repository"
3. Enter:
   - **Repository name**: `HRMS-Lite-Js`
   - **Description**: `Human Resource Management System - Full Stack`
   - **Visibility**: **Public** ✓
   - **DO NOT** initialize with README (you already have one)
4. Click "Create repository"

### Step 2: Push to GitHub (2 minutes)

```bash
cd /Users/raghav/Downloads/SWITCH/HRMS/Hrms_Lite_Js

# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/HRMS-Lite-Js.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Where to get `YOUR_USERNAME`**: Your GitHub profile URL is `github.com/YOUR_USERNAME`

✅ Result: Your code is now on GitHub!

---

### Step 3: Deploy Backend to Render (5 minutes)

1. Go to [Render.com](https://render.com) and sign up (free)
2. Connect your GitHub account
3. Click "New +" → "Web Service"
4. Select your `HRMS-Lite-Js` repository
5. Fill in:
   - **Name**: `hrms-lite-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: `Free`
6. Click "Create Web Service"
7. ⏳ Wait 2-3 minutes for deployment

✅ Result: **Your backend URL will be**: https://hrms-lite-backend.render.com

**Test it**: https://hrms-lite-backend.render.com/docs

---

### Step 4: Build Frontend (3 minutes)

```bash
cd /Users/raghav/Downloads/SWITCH/HRMS/Hrms_Lite_Js/frontend

# Install & build
npm install
npm run build
```

✅ Result: `dist` folder created with production files

---

### Step 5: Upload Frontend to kapilraghav.info (10 minutes)

#### Option A: Using SFTP (Recommended)

```bash
# Open SFTP connection
sftp your-username@kapilraghav.info

# Inside SFTP:
cd /var/www/kapilraghav.info
mkdir -p HRMS
cd HRMS

# Upload files (from your local machine)
put -r /Users/raghav/Downloads/SWITCH/HRMS/Hrms_Lite_Js/frontend/dist/* .

bye
```

#### Option B: Using Hosting Control Panel

1. Login to cPanel/Plesk
2. Open File Manager
3. Navigate to `public_html`
4. Create `HRMS` folder
5. Upload contents of `frontend/dist` folder

---

### Step 6: Configure Web Server (2 minutes)

**For Nginx** (SSH into server):

```bash
sudo nano /etc/nginx/sites-available/kapilraghav.info
```

Add this location block:

```nginx
location /HRMS/ {
    root /var/www/kapilraghav.info;
    try_files $uri $uri/ /HRMS/index.html;
}
```

```bash
sudo systemctl reload nginx
```

**For Apache** (in hosting control panel):

Create file: `/var/www/kapilraghav.info/HRMS/.htaccess`

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /HRMS/
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ index.html [QSA,L]
</IfModule>
```

---

## ✅ Verify Deployment

### Check Backend

```bash
curl https://hrms-lite-backend.render.com/
# Should return: {'message': 'API is running'}
```

### Check Frontend

Visit: **https://kapilraghav.info/HRMS**

- ✅ Should load without 404 errors
- ✅ Should not show CORS errors in DevTools
- ✅ Can add employees and see them in the list

---

## 🔗 Your Live Links

After deployment, you'll have:

| Link            | URL                                           |
| --------------- | --------------------------------------------- |
| **Frontend**    | https://kapilraghav.info/HRMS                 |
| **Backend API** | https://hrms-lite-backend.render.com          |
| **API Docs**    | https://hrms-lite-backend.render.com/docs     |
| **GitHub**      | https://github.com/YOUR_USERNAME/HRMS-Lite-Js |

---

## 📋 Submission Ready

You now have:

✅ **Live Frontend URL**: https://kapilraghav.info/HRMS  
✅ **Live Backend API**: https://hrms-lite-backend.render.com  
✅ **GitHub Repository**: https://github.com/YOUR_USERNAME/HRMS-Lite-Js  
✅ **README.md**: Comprehensive project documentation  
✅ **Complete Source Code**: Frontend + Backend in GitHub

---

## 🐛 Troubleshooting

### "Cannot reach backend" or "CORS error"

```
→ Wait 5 minutes for Render deployment
→ Check Render dashboard for build errors
→ Verify API URL in browser console (F12)
```

### "Page shows 404" or "CSS not loading"

```
→ Verify files uploaded to /var/www/kapilraghav.info/HRMS/
→ Check web server SPA routing configuration (.htaccess or nginx)
→ Verify index.html exists in the folder
```

### "Database connection error"

```
→ SQLite creates database automatically on first run
→ Check Render logs for errors
→ After 30 days on free tier, re-deploy to keep runs active
```

### Still having issues?

See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) for detailed troubleshooting

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Nginx SPA Configuration](https://router.vuejs.org/guide/deployment.html)
- [Apache SPA Configuration](https://create-react-app.dev/deployment/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)

---

## 🎉 You're Done!

Congratulations! Your HRMS Lite application is now:

- ✅ Version controlled on GitHub
- ✅ Publicly accessible from kapilraghav.info
- ✅ Connected to a live backend on Render
- ✅ Ready for production use

**Time to complete**: ~30 minutes  
**Status**: 🟢 LIVE & PRODUCTION-READY

For detailed step-by-step instructions, see [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)

---

**Last Updated**: February 20, 2026  
**Version**: 1.0.0 (Deployment Ready)
