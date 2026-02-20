# 📋 HRMS Lite - Deployment Checklist

Complete this checklist to ensure successful deployment of HRMS Lite to production.

## Pre-Deployment Checks

### Code Quality

- [ ] All code is committed to Git
- [ ] No console errors in browser DevTools
- [ ] No Python linting errors (`pip install pylint && pylint backend/*.py`)
- [ ] Backend endpoints tested locally (Swagger UI at http://localhost:8000/docs)
- [ ] Frontend components render correctly locally

### Environment Setup

- [ ] GitHub account created and code repository initialized
- [ ] GitHub repository is public
- [ ] Render.com account created (https://render.com)
- [ ] SSH access to kapilraghav.info server (or hosting control panel access)
- [ ] SFTP/FTP credentials ready for kapilraghav.info

### Backend Preparation

- [ ] `backend/requirements.txt` is up to date
- [ ] `backend/main.py` CORS configuration reviewed
- [ ] Database schema is finalized
- [ ] All API endpoints tested and working
- [ ] `.env.example` file created with all required variables

### Frontend Preparation

- [ ] `frontend/package.json` has all dependencies installed
- [ ] `frontend/.env` (development) points to localhost backend
- [ ] `frontend/.env.production` points to live backend URL
- [ ] All pages render without errors
- [ ] Responsive design tested on mobile devices
- [ ] `npm run build` completes successfully

---

## GitHub Repository Setup

### Step 1: Initialize/Push Repository

```bash
cd /path/to/Hrms_Lite_Js

# If not already done:
git init
git add .
git commit -m "Initial commit: HRMS Lite full-stack application"

# Create repository on GitHub
# Then push:
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/HRMS-Lite-Js.git
git push -u origin main
```

**Checklist**:

- [ ] Repository created on GitHub
- [ ] Code pushed to `main` branch
- [ ] Repository is public
- [ ] Repository link: ************\_\_\_************

---

## Backend Deployment (Render.com)

### Prerequisites

- [ ] GitHub account connected to Render
- [ ] Render.com free account active

### Deployment Steps

1. **Access Render Dashboard**

   ```
   Go to: https://dashboard.render.com
   ```

   - [ ] Logged in successfully

2. **Create Web Service**
   - [ ] Click "New +" → "Web Service"
   - [ ] Select repository: `HRMS-Lite-Js`
   - [ ] Click "Connect"

3. **Configure Service**
   - [ ] Name: `hrms-lite-backend`
   - [ ] Environment: `Python 3`
   - [ ] Region: `Oregon` (or closest)
   - [ ] Branch: `main`
   - [ ] Root Directory: (leave empty - auto-detects)
   - [ ] Build Command: `pip install -r backend/requirements.txt`
   - [ ] Start Command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`

4. **Add Environment Variables**
   - [ ] Click "Environment"
   - [ ] Add: `DATABASE_URL=sqlite:///./hrms.db`
   - [ ] Add: `PYTHON_VERSION=3.11`

5. **Deploy**
   - [ ] Select Plan: `Free`
   - [ ] Click "Create Web Service"
   - [ ] Wait for deployment (2-3 minutes)
   - [ ] Check for build errors in logs

### Post-Deployment Testing

```bash
# Test backend is running
curl https://hrms-lite-backend.render.com/

# Check API docs
# https://hrms-lite-backend.render.com/docs

# Create test employee
curl -X POST https://hrms-lite-backend.render.com/api/employees \
  -H "Content-Type: application/json" \
  -d '{"employee_id":"TEST001","name":"Test User","email":"test@example.com","department":"IT"}'
```

- [ ] Backend URL accessible: ************\_\_\_************
- [ ] API documentation loads at `/docs`
- [ ] Test endpoint returns data
- [ ] No CORS errors in logs

---

## Frontend Deployment (kapilraghav.info/HRMS)

### Step 1: Build Frontend

```bash
cd frontend

# Install dependencies (if not done)
npm install

# Update .env.production with live backend URL
# VITE_API_URL=https://hrms-lite-backend.render.com

# Build for production
npm run build
```

- [ ] Build completes successfully
- [ ] `dist/` folder created with optimized files
- [ ] No build warnings or errors

### Step 2: Upload to Server

#### Option A: Using SFTP (Recommended)

```bash
# Connect to server
sftp your-username@kapilraghav.info

# Inside SFTP:
cd /var/www/kapilraghav.info
mkdir -p HRMS
cd HRMS

# Upload from your local machine
put -r /path/to/frontend/dist/* .

bye
```

- [ ] Connected to SFTP successfully
- [ ] Created `/var/www/kapilraghav.info/HRMS/` directory
- [ ] Uploaded all files from `frontend/dist/`

#### Option B: Using Hosting Control Panel

1. [ ] Logged into hosting control panel
2. [ ] Opened File Manager
3. [ ] Navigated to `public_html/`
4. [ ] Created `HRMS` directory
5. [ ] Uploaded contents of `frontend/dist/`

### Step 3: Configure Web Server

#### For Nginx

Create/update `/etc/nginx/sites-available/kapilraghav.info`:

```nginx
server {
    server_name kapilraghav.info www.kapilraghav.info;

    location /HRMS/ {
        root /var/www/kapilraghav.info;
        try_files $uri $uri/ /HRMS/index.html;

        # Cache assets
        location ~* ^/HRMS/assets/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    listen 443 ssl http2;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
}

server {
    server_name kapilraghav.info www.kapilraghav.info;
    listen 80;
    return 301 https://$server_name$request_uri;
}
```

```bash
sudo systemctl reload nginx
```

- [ ] Nginx configuration updated
- [ ] Configuration syntax validated: `sudo nginx -t`
- [ ] Nginx reloaded successfully

#### For Apache

Create `/var/www/kapilraghav.info/HRMS/.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /HRMS/
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ index.html [QSA,L]
</IfModule>
```

```bash
sudo systemctl reload apache2
```

- [ ] `.htaccess` file created
- [ ] Apache reloaded successfully

### Step 4: Verify Frontend Accessibility

- [ ] Frontend loads at `https://kapilraghav.info/HRMS`
- [ ] No 404 errors
- [ ] All CSS/JS loaded correctly
- [ ] No mixed content warnings

---

## Post-Deployment Configuration

### Update Backend CORS

Edit `backend/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://kapilraghav.info",
        "https://www.kapilraghav.info",
        "https://hrms-lite-backend.render.com",  # Swagger UI
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

```bash
git add backend/main.py
git commit -m "Update CORS for production domains"
git push origin main
```

- [ ] CORS updated in `main.py`
- [ ] Changes pushed to GitHub
- [ ] Render auto-redeployed with new configuration

### Test API Connection

1. Open `https://kapilraghav.info/HRMS` in browser
2. Open DevTools (F12)
3. Check Console for errors
4. Verify API calls succeed

- [ ] No CORS errors in console
- [ ] API endpoints respond with data
- [ ] Employee creation works end-to-end

---

## Testing Checklist

### Functionality Testing

#### Employee Management

- [ ] Can create new employee
- [ ] Can view employee list
- [ ] Can search/filter employees
- [ ] Can update employee details
- [ ] Can delete employee (with confirmation)

#### Other Features

- [ ] Dashboard displays statistics
- [ ] Department management works
- [ ] Division management works
- [ ] Position management works

### Performance Testing

- [ ] Page loads in < 3 seconds
- [ ] Responsive on mobile (< 768px)
- [ ] Responsive on tablet (768px - 1024px)
- [ ] Responsive on desktop (> 1024px)

### Browser Compatibility

- [ ] Chrome/Edge: ✓ / ✗
- [ ] Firefox: ✓ / ✗
- [ ] Safari: ✓ / ✗
- [ ] Mobile Safari: ✓ / ✗

### Error Handling

- [ ] Network errors handled gracefully
- [ ] Empty states display correctly
- [ ] Loading states visible
- [ ] Error messages clear and helpful

---

## Monitoring & Maintenance

### Daily (First Week)

- [ ] Check Render dashboard for errors
- [ ] Monitor server logs for issues
- [ ] Test key workflows

### Weekly

- [ ] Review server error logs
- [ ] Check backend performance metrics
- [ ] Verify database size/growth

### Monthly

- [ ] Update dependencies: `npm update` and `pip install --upgrade`
- [ ] Review security vulnerabilities
- [ ] Backup database (`hrms.db`)

---

## Production Links

After deployment, update these in your profile/portfolio:

- **Frontend URL**: https://kapilraghav.info/HRMS
- **Backend API**: https://hrms-lite-backend.render.com
- **API Docs**: https://hrms-lite-backend.render.com/docs
- **GitHub Repository**: https://github.com/YOUR_USERNAME/HRMS-Lite-Js

---

## Troubleshooting

### Issue: "Cannot reach server"

- [ ] Check Render service status: https://status.render.com
- [ ] Verify backend URL is correct
- [ ] Check DNS propagation (wait 5 minutes)
- [ ] Check server logs for errors

### Issue: "CORS errors"

- [ ] Verify frontend domain in CORS middleware
- [ ] Check backend has been redeployed
- [ ] Clear browser cache (Ctrl+Shift+Del)

### Issue: "CSS/JS not loading (404)"

- [ ] Verify all files uploaded to correct path
- [ ] Check web server SPA routing configuration
- [ ] Verify `.htaccess` or nginx config

### Issue: "Database not found"

- [ ] SQLite database file created on first run
- [ ] Check file permissions (chmod 644 hrms.db)
- [ ] For persistent database, migrate to PostgreSQL

---

## Sign-Off

- [ ] All checklist items completed
- [ ] Tested by: **********\_\_\_**********
- [ ] Date: **********\_\_\_**********
- [ ] Production deployment confirmed: ✓ / ✗

**Application Status**: 🟢 LIVE  
**Last Updated**: February 2026
