import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Calendar, 
  Pill, 
  Activity, 
  FileText, 
  MessageSquare, 
  AlertTriangle,
  TrendingUp,
  Clock,
  Shield,
  Plus,
  Bell
} from 'lucide-react';

interface HealthMetric {
  id: string;
  type: string;
  value: string;
  unit: string;
  date: string;
  status: 'normal' | 'warning' | 'critical';
}

interface Appointment {
  id: string;
  provider: string;
  date: string;
  time: string;
  type: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export function PatientDashboard() {
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [recentRecords, setRecentRecords] = useState<any[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Mock data for demonstration - no async operations that could fail
    setHealthMetrics([
      { id: '1', type: 'Blood Pressure', value: '120/80', unit: 'mmHg', date: '2025-01-15', status: 'normal' },
      { id: '2', type: 'Heart Rate', value: '72', unit: 'bpm', date: '2025-01-15', status: 'normal' },
      { id: '3', type: 'Weight', value: '70', unit: 'kg', date: '2025-01-14', status: 'normal' },
      { id: '4', type: 'Blood Sugar', value: '95', unit: 'mg/dL', date: '2025-01-13', status: 'normal' }
    ]);

    setUpcomingAppointments([
      { id: '1', provider: 'Dr. Sarah Johnson', date: '2025-01-20', time: '10:00 AM', type: 'General Checkup', status: 'upcoming' },
      { id: '2', provider: 'Dr. Michael Chen', date: '2025-01-25', time: '2:30 PM', type: 'Cardiology', status: 'upcoming' }
    ]);

    setRecentRecords([
      { id: '1', record_type: 'consultation', created_at: '2025-01-10' },
      { id: '2', record_type: 'prescription', created_at: '2025-01-08' },
      { id: '3', record_type: 'test_result', created_at: '2025-01-05' }
    ]);

    setLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <Activity className="h-8 w-8 text-indigo-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, Sarah Johnson</h1>
            <p className="text-indigo-100 mt-1">Here's your health overview for today</p>
          </div>
          <div className="flex items-center space-x-2">
            <Bell className="h-6 w-6" />
            <span className="bg-red-500 text-xs rounded-full px-2 py-1">2</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Heart className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Health Score</p>
              <p className="text-2xl font-bold text-gray-900">85/100</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Next Appointment</p>
              <p className="text-lg font-bold text-gray-900">Jan 20</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Pill className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Medications</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FileText className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Records</p>
              <p className="text-2xl font-bold text-gray-900">{recentRecords.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Metrics */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Latest Health Metrics</h2>
              <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {healthMetrics.map((metric) => (
                <div key={metric.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getStatusColor(metric.status)}`}>
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{metric.type}</p>
                      <p className="text-sm text-gray-500">{metric.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{metric.value} {metric.unit}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(metric.status)}`}>
                      {metric.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{appointment.provider}</p>
                      <p className="text-sm text-gray-600">{appointment.type}</p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {appointment.date}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {appointment.time}
                      </div>
                    </div>
                    <span className="inline-flex px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full">
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              Schedule New Appointment
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Health Records */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Health Records</h2>
              <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            {recentRecords.length > 0 ? (
              <div className="space-y-3">
                {recentRecords.slice(0, 3).map((record) => (
                  <div key={record.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <FileText className="h-5 w-5 text-indigo-600" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {record.record_type.replace('_', ' ').charAt(0).toUpperCase() + record.record_type.slice(1)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(record.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Shield className="h-4 w-4 text-green-600" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No health records yet</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Plus className="h-6 w-6 text-indigo-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">Add Record</span>
              </button>
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <MessageSquare className="h-6 w-6 text-indigo-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">Message Provider</span>
              </button>
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Calendar className="h-6 w-6 text-indigo-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">Book Appointment</span>
              </button>
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Activity className="h-6 w-6 text-indigo-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">Health Goals</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Health Alerts */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start">
          <AlertTriangle className="h-6 w-6 text-yellow-600 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Health Reminders</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Annual physical exam due in 2 weeks</li>
                <li>Flu vaccination recommended for this season</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}