# HRMS Lite

A lightweight Human Resource Management System built with **React (JavaScript)** and **FastAPI**.

## Features

### Core Features
- Add new employees (ID, Name, Email, Department)
- View all employees with search functionality
- Delete employees with confirmation
- Mark attendance (Present/Absent) for any date
- View attendance records per employee
- Date filtering for attendance records

### Bonus Features
- Dashboard with real-time statistics
- Employee attendance statistics (present/absent days, attendance rate)
- Responsive design for mobile and desktop
- Loading states and empty states
- Toast notifications for user feedback

## Tech Stack

### Frontend
- React 18 (JavaScript)
- Vite (Build tool)
- Tailwind CSS (Styling)
- Axios (HTTP client)
- Sonner (Toast notifications)
- Lucide React (Icons)

### Backend
- FastAPI (Python)
- SQLAlchemy (ORM)
- SQLite (Database)
- Pydantic (Validation)

## Project Structure

```
hrms-lite-js/
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Dashboard, EmployeeManagement, AttendanceManagement
│   │   ├── api.js         # API functions
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── .env
└── backend/
    ├── main.py
    ├── models.py
    ├── schemas.py
    ├── database.py
    └── requirements.txt
```

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/hrms-lite.git
cd hrms-lite-js
```

### 2. Start the Backend

```bash
cd backend
pip install -r requirements.txt
python main.py
```

Backend will run at http://localhost:8000

### 3. Start the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at http://localhost:5173

## Deployment

### Frontend (GitHub Pages / Your Domain)

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

Quick steps:
```bash
cd frontend
npm install
npm run build
```

Upload the `dist` folder to your server at `kapilghav.info/HRMS-lite`.

### Backend (Render)

1. Push code to GitHub
2. Create Web Service on Render
3. Set build command: `pip install -r backend/requirements.txt`
4. Set start command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Deploy

## Environment Variables

### Frontend (.env)
```
# Development
VITE_API_URL=http://localhost:8000

# Production (after Render deployment)
VITE_API_URL=https://your-backend.onrender.com
```

## API Documentation

When backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Screenshots

*Add screenshots here*

## License

MIT License

## Author

Built for full-stack development assignment.
