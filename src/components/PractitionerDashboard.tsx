import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  FileText, 
  MessageSquare, 
  AlertTriangle,
  TrendingUp,
  Activity,
  Stethoscope,
  CheckCircle,
  XCircle,
  Bell,
  Search,
  Filter,
  BarChart3
} from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  age: number;
  lastVisit: string;
  condition: string;
  status: 'stable' | 'needs_attention' | 'critical';
  nextAppointment?: string;
}

interface Appointment {
  id: string;
  patient: string;
  time: string;
  type: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  duration: number;
}

interface Task {
  id: string;
  type: 'review' | 'follow_up' | 'prescription' | 'referral';
  patient: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
}

export function PractitionerDashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingTasks: 0,
    completedToday: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Mock data for demonstration - no async operations that could fail
    const mockPatients: Patient[] = [
      { id: '1', name: 'Sarah Johnson', age: 34, lastVisit: '2025-01-10', condition: 'Hypertension', status: 'stable', nextAppointment: '2025-01-20' },
      { id: '2', name: 'Michael Chen', age: 45, lastVisit: '2025-01-12', condition: 'Diabetes Type 2', status: 'needs_attention', nextAppointment: '2025-01-18' },
      { id: '3', name: 'Emma Wilson', age: 28, lastVisit: '2025-01-15', condition: 'Asthma', status: 'stable' },
      { id: '4', name: 'Robert Davis', age: 67, lastVisit: '2025-01-08', condition: 'Heart Disease', status: 'critical', nextAppointment: '2025-01-17' },
      { id: '5', name: 'Lisa Anderson', age: 52, lastVisit: '2025-01-14', condition: 'Arthritis', status: 'stable' }
    ];

    const mockAppointments: Appointment[] = [
      { id: '1', patient: 'Sarah Johnson', time: '09:00', type: 'Follow-up', status: 'scheduled', duration: 30 },
      { id: '2', patient: 'Michael Chen', time: '10:30', type: 'Consultation', status: 'in_progress', duration: 45 },
      { id: '3', patient: 'Robert Davis', time: '14:00', type: 'Emergency', status: 'scheduled', duration: 60 },
      { id: '4', patient: 'Emma Wilson', time: '15:30', type: 'Check-up', status: 'scheduled', duration: 30 }
    ];

    const mockTasks: Task[] = [
      { id: '1', type: 'review', patient: 'Michael Chen', description: 'Review blood test results', priority: 'high', dueDate: '2025-01-16' },
      { id: '2', type: 'follow_up', patient: 'Robert Davis', description: 'Post-surgery follow-up call', priority: 'high', dueDate: '2025-01-16' },
      { id: '3', type: 'prescription', patient: 'Sarah Johnson', description: 'Renew hypertension medication', priority: 'medium', dueDate: '2025-01-17' },
      { id: '4', type: 'referral', patient: 'Lisa Anderson', description: 'Refer to orthopedic specialist', priority: 'low', dueDate: '2025-01-18' }
    ];

    setPatients(mockPatients);
    setTodayAppointments(mockAppointments);
    setPendingTasks(mockTasks);
    setStats({
      totalPatients: mockPatients.length,
      todayAppointments: mockAppointments.length,
      pendingTasks: mockTasks.filter(t => t.priority === 'high').length,
      completedToday: 3
    });
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <Activity className="h-8 w-8 text-indigo-600" />
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'stable': return 'text-green-600 bg-green-50';
      case 'needs_attention': return 'text-yellow-600 bg-yellow-50';
      case 'critical': return 'text-red-600 bg-red-50';
      case 'scheduled': return 'text-blue-600 bg-blue-50';
      case 'in_progress': return 'text-purple-600 bg-purple-50';
      case 'completed': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'review': return <FileText className="h-4 w-4" />;
      case 'follow_up': return <MessageSquare className="h-4 w-4" />;
      case 'prescription': return <Activity className="h-4 w-4" />;
      case 'referral': return <Users className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Good morning, Dr. Sarah Mitchell</h1>
            <p className="text-blue-100 mt-1">You have {stats.todayAppointments} appointments and {stats.pendingTasks} urgent tasks today</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.completedToday}</p>
              <p className="text-blue-100 text-sm">Completed Today</p>
            </div>
            <div className="flex items-center space-x-2">
              <Bell className="h-6 w-6" />
              <span className="bg-red-500 text-xs rounded-full px-2 py-1">{stats.pendingTasks}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.todayAppointments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Urgent Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Efficiency Score</p>
              <p className="text-2xl font-bold text-gray-900">94%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Today's Schedule</h2>
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-medium text-gray-900">{appointment.time}</div>
                    <div>
                      <p className="font-medium text-gray-900">{appointment.patient}</p>
                      <p className="text-sm text-gray-500">{appointment.type} • {appointment.duration}min</p>
                    </div>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                    {appointment.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              View Full Schedule
            </button>
          </div>
        </div>

        {/* Patient Overview */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Patient Overview</h2>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Search className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Filter className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {patients.map((patient) => (
                <div key={patient.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-medium">{patient.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{patient.name}</p>
                      <p className="text-sm text-gray-500">Age {patient.age} • {patient.condition}</p>
                      <p className="text-xs text-gray-400">Last visit: {patient.lastVisit}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(patient.status)}`}>
                      {patient.status.replace('_', ' ')}
                    </span>
                    {patient.nextAppointment && (
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Next:</p>
                        <p className="text-xs font-medium">{patient.nextAppointment}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tasks and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Tasks */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Pending Tasks</h2>
              <span className="text-sm text-gray-500">{pendingTasks.length} tasks</span>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <div key={task.id} className={`p-4 border rounded-lg ${getPriorityColor(task.priority)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">
                        {getTaskIcon(task.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{task.description}</p>
                        <p className="text-sm text-gray-600">Patient: {task.patient}</p>
                        <p className="text-xs text-gray-500">Due: {task.dueDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-green-600 hover:text-green-700">
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:text-red-700">
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions & Analytics */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Stethoscope className="h-6 w-6 text-indigo-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">New Consultation</span>
                </button>
                <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <FileText className="h-6 w-6 text-indigo-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Create Record</span>
                </button>
                <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <MessageSquare className="h-6 w-6 text-indigo-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Message Patient</span>
                </button>
                <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <BarChart3 className="h-6 w-6 text-indigo-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">View Analytics</span>
                </button>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">This Week's Performance</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Patients Seen</span>
                  <span className="font-medium">24/25</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '96%' }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average Consultation Time</span>
                  <span className="font-medium">28 min</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Patient Satisfaction</span>
                  <span className="font-medium">4.8/5.0</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '96%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Alerts */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start">
          <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Clinical Alerts</h3>
            <div className="mt-2 text-sm text-red-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Robert Davis: Critical blood pressure reading requires immediate attention</li>
                <li>Michael Chen: HbA1c levels elevated - medication adjustment needed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}