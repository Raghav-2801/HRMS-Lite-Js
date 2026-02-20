from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from typing import List
from datetime import date

import models
import schemas
from database import engine, get_db

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="HRMS Lite API",
    description="Lightweight Human Resource Management System API",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*",  # Allow all for development; update for production
        # "https://kapilraghav.info",
        # "https://www.kapilraghav.info",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== EMPLOYEE ENDPOINTS ====================

@app.post("/api/employees", response_model=schemas.EmployeeListResponse, status_code=status.HTTP_201_CREATED)
def create_employee(employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    """Create a new employee"""
    # Check for duplicate employee_id
    existing_employee = db.query(models.Employee).filter(
        models.Employee.employee_id == employee.employee_id
    ).first()
    
    if existing_employee:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Employee with ID '{employee.employee_id}' already exists"
        )
    
    # Check for duplicate email
    existing_email = db.query(models.Employee).filter(
        models.Employee.email == employee.email
    ).first()
    
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Employee with email '{employee.email}' already exists"
        )
    
    db_employee = models.Employee(**employee.dict())
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee


@app.get("/api/employees", response_model=List[schemas.EmployeeListResponse])
def get_employees(db: Session = Depends(get_db)):
    """Get all employees"""
    employees = db.query(models.Employee).all()
    return employees


@app.get("/api/employees/{employee_id}", response_model=schemas.EmployeeResponse)
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    """Get a specific employee with attendance records"""
    employee = db.query(models.Employee).filter(models.Employee.id == employee_id).first()
    
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID {employee_id} not found"
        )
    
    return employee


@app.delete("/api/employees/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    """Delete an employee"""
    employee = db.query(models.Employee).filter(models.Employee.id == employee_id).first()
    
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID {employee_id} not found"
        )
    
    db.delete(employee)
    db.commit()
    return None


# ==================== ATTENDANCE ENDPOINTS ====================

@app.post("/api/attendance", response_model=schemas.AttendanceResponse, status_code=status.HTTP_201_CREATED)
def mark_attendance(attendance: schemas.AttendanceCreate, employee_id: int, db: Session = Depends(get_db)):
    """Mark attendance for an employee"""
    # Check if employee exists
    employee = db.query(models.Employee).filter(models.Employee.id == employee_id).first()
    
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID {employee_id} not found"
        )
    
    # Check if attendance already marked for this date
    existing_attendance = db.query(models.Attendance).filter(
        and_(
            models.Attendance.employee_id == employee_id,
            models.Attendance.date == attendance.date
        )
    ).first()
    
    if existing_attendance:
        # Update existing attendance
        existing_attendance.status = attendance.status
        db.commit()
        db.refresh(existing_attendance)
        return existing_attendance
    
    db_attendance = models.Attendance(
        employee_id=employee_id,
        date=attendance.date,
        status=attendance.status
    )
    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)
    return db_attendance


@app.get("/api/attendance/{employee_id}", response_model=List[schemas.AttendanceResponse])
def get_employee_attendance(
    employee_id: int, 
    start_date: date = None, 
    end_date: date = None,
    db: Session = Depends(get_db)
):
    """Get attendance records for an employee with optional date filtering"""
    employee = db.query(models.Employee).filter(models.Employee.id == employee_id).first()
    
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID {employee_id} not found"
        )
    
    query = db.query(models.Attendance).filter(models.Attendance.employee_id == employee_id)
    
    if start_date:
        query = query.filter(models.Attendance.date >= start_date)
    if end_date:
        query = query.filter(models.Attendance.date <= end_date)
    
    attendances = query.order_by(models.Attendance.date.desc()).all()
    return attendances


@app.get("/api/attendance", response_model=List[schemas.AttendanceResponse])
def get_all_attendance(
    date: date = None,
    db: Session = Depends(get_db)
):
    """Get all attendance records with optional date filtering"""
    query = db.query(models.Attendance)
    
    if date:
        query = query.filter(models.Attendance.date == date)
    
    attendances = query.order_by(models.Attendance.date.desc()).all()
    return attendances


# ==================== DASHBOARD ENDPOINTS ====================

@app.get("/api/dashboard/stats", response_model=schemas.DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    """Get dashboard statistics"""
    today = date.today()
    
    total_employees = db.query(models.Employee).count()
    
    today_attendance = db.query(models.Attendance).filter(
        models.Attendance.date == today
    ).all()
    
    total_present_today = sum(1 for a in today_attendance if a.status == models.AttendanceStatus.PRESENT)
    total_absent_today = sum(1 for a in today_attendance if a.status == models.AttendanceStatus.ABSENT)
    
    # Calculate attendance rate
    if total_employees > 0:
        attendance_rate = (total_present_today / total_employees) * 100
    else:
        attendance_rate = 0.0
    
    return schemas.DashboardStats(
        total_employees=total_employees,
        total_present_today=total_present_today,
        total_absent_today=total_absent_today,
        attendance_rate=round(attendance_rate, 2)
    )


@app.get("/api/employees/{employee_id}/stats")
def get_employee_stats(employee_id: int, db: Session = Depends(get_db)):
    """Get attendance statistics for a specific employee"""
    employee = db.query(models.Employee).filter(models.Employee.id == employee_id).first()
    
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID {employee_id} not found"
        )
    
    attendances = db.query(models.Attendance).filter(
        models.Attendance.employee_id == employee_id
    ).all()
    
    total_days = len(attendances)
    present_days = sum(1 for a in attendances if a.status == models.AttendanceStatus.PRESENT)
    absent_days = sum(1 for a in attendances if a.status == models.AttendanceStatus.ABSENT)
    
    attendance_rate = (present_days / total_days * 100) if total_days > 0 else 0.0
    
    return {
        "employee_id": employee_id,
        "total_days": total_days,
        "present_days": present_days,
        "absent_days": absent_days,
        "attendance_rate": round(attendance_rate, 2)
    }


# Health check endpoint
@app.get("/api/health")
def health_check():
    return {"status": "healthy", "message": "HRMS Lite API is running"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
