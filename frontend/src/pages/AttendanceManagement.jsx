import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, XCircle, User, Filter, BarChart3, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { fetchEmployees, fetchEmployeeAttendance, markAttendance, fetchEmployeeStats } from '../api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import Button from '../components/Button';
import Select from '../components/Select';
import Modal from '../components/Modal';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import Badge from '../components/Badge';

const AttendanceManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [employeeStats, setEmployeeStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterDate, setFilterDate] = useState('');

  const [attendanceForm, setAttendanceForm] = useState({
    employee_id: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present',
  });

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await fetchEmployees();
      setEmployees(data);
    } catch (error) {
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleViewAttendance = async (employee) => {
    setSelectedEmployee(employee);
    setAttendanceLoading(true);
    try {
      const [attendanceData, statsData] = await Promise.all([
        fetchEmployeeAttendance(employee.id),
        fetchEmployeeStats(employee.id),
      ]);
      setAttendanceRecords(attendanceData);
      setEmployeeStats(statsData);
    } catch (error) {
      toast.error('Failed to load attendance records');
    } finally {
      setAttendanceLoading(false);
    }
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const employeeId = parseInt(attendanceForm.employee_id);
      await markAttendance(employeeId, attendanceForm.date, attendanceForm.status);
      toast.success('Attendance marked successfully');
      setAttendanceForm({
        employee_id: '',
        date: new Date().toISOString().split('T')[0],
        status: 'present',
      });
      setIsMarkModalOpen(false);
      
      // Refresh if viewing the same employee
      if (selectedEmployee && selectedEmployee.id === employeeId) {
        handleViewAttendance(selectedEmployee);
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to mark attendance');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRecords = filterDate
    ? attendanceRecords.filter((record) => record.date === filterDate)
    : attendanceRecords;

  const getStatusBadge = (status) => {
    return status === 'present' ? (
      <Badge variant="success" className="flex items-center gap-1">
        <CheckCircle2 className="h-3 w-3" />
        Present
      </Badge>
    ) : (
      <Badge variant="danger" className="flex items-center gap-1">
        <XCircle className="h-3 w-3" />
        Absent
      </Badge>
    );
  };

  const employeeOptions = employees.map((emp) => ({
    value: emp.id.toString(),
    label: `${emp.full_name} (${emp.employee_id})`,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Attendance Management</h2>
          <p className="text-gray-500 mt-1">Track and manage employee attendance</p>
        </div>
        <Button onClick={() => setIsMarkModalOpen(true)} className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Mark Attendance
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employee List */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Select Employee</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                  ))}
              </div>
            ) : employees.length === 0 ? (
              <EmptyState
                title="No employees"
                description="Add employees first to manage attendance"
              />
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {employees.map((employee) => (
                  <button
                    key={employee.id}
                    onClick={() => handleViewAttendance(employee)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                      selectedEmployee?.id === employee.id
                        ? 'bg-blue-50 border-blue-200 border'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {employee.full_name}
                      </p>
                      <p className="text-sm text-gray-500">{employee.department}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Attendance Records */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              {selectedEmployee
                ? `Attendance - ${selectedEmployee.full_name}`
                : 'Attendance Records'}
            </CardTitle>
            {selectedEmployee && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsStatsModalOpen(true)}
                className="flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Stats
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {!selectedEmployee ? (
              <EmptyState
                title="Select an employee"
                description="Click on an employee from the list to view their attendance records"
              />
            ) : attendanceLoading ? (
              <div className="space-y-3">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  {filterDate && (
                    <Button variant="ghost" size="sm" onClick={() => setFilterDate('')}>
                      Clear
                    </Button>
                  )}
                </div>

                {/* Records */}
                {filteredRecords.length === 0 ? (
                  <EmptyState
                    title="No attendance records"
                    description={
                      filterDate
                        ? 'No records found for the selected date'
                        : 'No attendance records for this employee yet'
                    }
                  />
                ) : (
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {filteredRecords.map((record) => (
                      <div
                        key={record.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium">
                            {new Date(record.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        {getStatusBadge(record.status)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Mark Attendance Modal */}
      <Modal
        isOpen={isMarkModalOpen}
        onClose={() => setIsMarkModalOpen(false)}
        title="Mark Attendance"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setIsMarkModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleMarkAttendance} 
              disabled={isSubmitting || !attendanceForm.employee_id}
            >
              {isSubmitting ? 'Saving...' : 'Mark Attendance'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleMarkAttendance} className="space-y-4">
          <Select
            label="Employee"
            name="employee_id"
            value={attendanceForm.employee_id}
            onChange={(e) =>
              setAttendanceForm((prev) => ({ ...prev, employee_id: e.target.value }))
            }
            options={employeeOptions}
            required
            placeholder="Select an employee"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={attendanceForm.date}
              onChange={(e) =>
                setAttendanceForm((prev) => ({ ...prev, date: e.target.value }))
              }
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <Select
            label="Status"
            name="status"
            value={attendanceForm.status}
            onChange={(e) =>
              setAttendanceForm((prev) => ({ ...prev, status: e.target.value }))
            }
            options={[
              { value: 'present', label: 'Present' },
              { value: 'absent', label: 'Absent' },
            ]}
            required
          />
        </form>
      </Modal>

      {/* Stats Modal */}
      <Modal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        title="Attendance Statistics"
      >
        <div className="py-4">
          {employeeStats ? (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-gray-500">{selectedEmployee?.full_name}</p>
                <p className="text-lg font-medium text-gray-900">
                  {employeeStats.total_days} total records
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {employeeStats.present_days}
                  </p>
                  <p className="text-sm text-green-700 mt-1">Present Days</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-red-600">
                    {employeeStats.absent_days}
                  </p>
                  <p className="text-sm text-red-700 mt-1">Absent Days</p>
                </div>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-4xl font-bold text-blue-600">
                  {employeeStats.attendance_rate}%
                </p>
                <p className="text-sm text-blue-700 mt-1">Attendance Rate</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default AttendanceManagement;
