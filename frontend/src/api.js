import axios from 'axios';


const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


export const fetchEmployees = async () => {
  const response = await api.get('/api/employees');
  return response.data;
};

export const createEmployee = async (employee) => {
  const response = await api.post('/api/employees', employee);
  return response.data;
};

export const deleteEmployee = async (employeeId) => {
  await api.delete(`/api/employees/${employeeId}`);
};

// Attendance APIs
export const fetchEmployeeAttendance = async (employeeId) => {
  const response = await api.get(`/api/attendance/${employeeId}`);
  return response.data;
};

export const markAttendance = async (employeeId, date, status) => {
  const response = await api.post(`/api/attendance?employee_id=${employeeId}`, {
    date,
    status,
  });
  return response.data;
};

// Dashboard APIs
export const fetchDashboardStats = async () => {
  const response = await api.get('/api/dashboard/stats');
  return response.data;
};

export const fetchEmployeeStats = async (employeeId) => {
  const response = await api.get(`/api/employees/${employeeId}/stats`);
  return response.data;
};

export default api;
