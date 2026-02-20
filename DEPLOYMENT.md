# HRMS Lite - Deployment Guide

## Project Structure

```
hrms-lite-js/
├── frontend/          # React + JavaScript frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Dashboard, Employees, Attendance
│   │   ├── api.js         # API functions
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── public/
│   ├── package.json
│   ├── vite.config.js     # Configured for /HRMS-lite/ base path
│   └── .env               # API URL configuration
└── backend/           # FastAPI + SQLite backend
    ├── main.py
    ├── models.py
    ├── schemas.py
    ├── database.py
    └── requirements.txt
```

---

## Frontend Deployment (GitHub Pages)

### Step 1: Push to GitHub

1. Create a new repository on GitHub (e.g., `hrms-lite`)
2. Push the code:

```bash
cd hrms-lite-js/frontend
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hrms-lite.git
git push -u origin main
```

### Step 2: Configure for GitHub Pages

The `vite.config.js` is already configured with `base: '/HRMS-lite/'` for deployment to `kapilghav.info/HRMS-lite`.

If your repo name is different, update `vite.config.js`:
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/YOUR-REPO-NAME/',  // Change this
  build: { outDir: 'dist' }
})
```

### Step 3: Build and Deploy

#### Option A: Manual Deployment

```bash
cd frontend
npm install
npm run build
```

The `dist` folder will be created. Upload this to your server at `kapilghav.info/HRMS-lite`.

#### Option B: GitHub Actions (Auto Deploy)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: cd frontend && npm ci
      
      - name: Build
        run: cd frontend && npm run build
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './frontend/dist'
      
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Step 4: Update API URL

After deploying the backend to Render, update the frontend:

1. Create `.env.production` in `frontend/`:
```
VITE_API_URL=https://your-backend.onrender.com
```

2. Rebuild and redeploy.

---

## Backend Deployment (Render)

### Step 1: Push Backend to GitHub

Make sure your backend folder is in the same repository or a separate one.

### Step 2: Create Web Service on Render

1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `hrms-lite-api`
   - **Environment**: Python 3
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free

5. Click "Create Web Service"

### Step 3: Update CORS (Optional but Recommended)

After deploying frontend, update `backend/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://kapilghav.info",           # Your domain
        "https://www.kapilghav.info",       # www subdomain
        "http://localhost:5173",            # Local development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Redeploy the backend.

---

## Local Development

### Start Backend

```bash
cd backend
pip install -r requirements.txt
python main.py
```
Backend runs at http://localhost:8000

### Start Frontend

```bash
cd frontend
npm install
npm run dev
```
Frontend runs at http://localhost:5173

---

## Environment Variables

### Frontend (.env)
```
# Development
VITE_API_URL=http://localhost:8000

# Production (after Render deployment)
VITE_API_URL=https://your-backend.onrender.com
```

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/employees` | GET | List all employees |
| `/api/employees` | POST | Create employee |
| `/api/employees/{id}` | DELETE | Delete employee |
| `/api/attendance/{id}` | GET | Get employee attendance |
| `/api/attendance` | POST | Mark attendance |
| `/api/dashboard/stats` | GET | Dashboard statistics |
| `/api/employees/{id}/stats` | GET | Employee attendance stats |

---

## Testing

```bash
# Health check
curl https://your-backend.onrender.com/api/health

# Create employee
curl -X POST https://your-backend.onrender.com/api/employees \
  -H "Content-Type: application/json" \
  -d '{"employee_id":"EMP001","full_name":"John Doe","email":"john@company.com","department":"Engineering"}'

# List employees
curl https://your-backend.onrender.com/api/employees
```
