import React from 'react';
import { Users, UserCheck, UserX, TrendingUp, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import Button from '../components/Button';
import Skeleton from '../components/Skeleton';

const Dashboard = ({ stats, loading, onRefresh }) => {
  const statCards = [
    {
      title: 'Total Employees',
      value: stats?.total_employees || 0,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
    },
    {
      title: 'Present Today',
      value: stats?.total_present_today || 0,
      icon: UserCheck,
      color: 'bg-green-500',
      textColor: 'text-green-600',
    },
    {
      title: 'Absent Today',
      value: stats?.total_absent_today || 0,
      icon: UserX,
      color: 'bg-red-500',
      textColor: 'text-red-600',
    },
    {
      title: 'Attendance Rate',
      value: `${stats?.attendance_rate || 0}%`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-500 mt-1">Overview of your HR system</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array(4)
              .fill(0)
              .map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <Skeleton className="h-12 w-12 rounded-lg mb-4" />
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-16" />
                  </CardContent>
                </Card>
              ))
          : statCards.map((stat, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <p className={`text-2xl font-bold ${stat.textColor} mt-1`}>
                      {stat.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Quick Info */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Employee Management</h4>
              <p className="text-sm text-blue-700">
                Manage your workforce by adding, viewing, and removing employee records. 
                Each employee has a unique ID, name, email, and department assignment.
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Attendance Tracking</h4>
              <p className="text-sm text-green-700">
                Track daily attendance for all employees. Mark attendance as Present or Absent 
                and view historical records with filtering options.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
