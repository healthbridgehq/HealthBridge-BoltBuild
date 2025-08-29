import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
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
  BarChart3,
  X
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
  const navigate = useNavigate();
  const { addNotification, setLoading } = useAppStore();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingTasks: 0,
    completedToday: 0
  });
  const [showClinicalAlert, setShowClinicalAlert] = useState(true);

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
  }, []);

  const handleViewFullSchedule = () => {
    setLoading('appointments', true);
    setTimeout(() => {
      setLoading('appointments', false);
      navigate('/appointments');
    }, 500);
  };

  const handleNewConsultation = () => {
    addNotification({
      type: 'info',
      title: 'New Consultation',
      message: 'Starting a new patient consultation.'
    });
    navigate('/clinical-records/create');
  };

  const handleCreateRecord = () => {
    addNotification({
      type: 'info',
      title: 'Create Clinical Record',
      message: 'Creating a new clinical record for patient documentation.'
    });
    navigate('/clinical-records/create');
  };

  const handleMessagePatient = () => {
    addNotification({
      type: 'info',
      title: 'Patient Messaging',
      message: 'Access secure messaging with your patients.'
    });
    navigate('/messages');
  };

  const handleViewAnalytics = () => {
    addNotification({
      type: 'info',
      title: 'Practice Analytics',
      message: 'Loading comprehensive practice performance metrics.'
    });
    setLoading('records', true);
    setTimeout(() => {
      setLoading('records', false);
      navigate('/analytics');
    }, 500);
  };

  const handleCompleteTask = (taskId: string) => {
    setPendingTasks(prev => prev.filter(task => task.id !== taskId));
    addNotification({
      type: 'success',
      title: 'Task Completed',
      message: 'Task has been completed and removed from your list.'
    });
  };

  const handleDismissTask = (taskId: string) => {
    setPendingTasks(prev => prev.filter(task => task.id !== taskId));
    addNotification({
      type: 'info',
      title: 'Task Dismissed',
      message: 'Task has been dismissed and moved to completed items.'
    });
  };

  const handleDismissAlert = () => {
    setShowClinicalAlert(false);
    addNotification({
      type: 'success',
      title: 'Alert Dismissed',
      message: 'Clinical alert acknowledged and dismissed.'
    });
  };


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


  // Helper function for method icons
  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'telehealth': return <Video className="h-3 w-3" />;
      case 'phone': return <Phone className="h-3 w-3" />;
      default: return <MapPin className="h-3 w-3" />;
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all duration-200 transform hover:scale-105"
          onClick={() => {
            addNotification({
              type: 'info',
              title: 'Patient Management',
              message: `You have ${stats.totalPatients} patients in your care. Click to view patient list.`
            });
            navigate('/patients');
          }}
        >
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  +3 this week
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Click to manage patients</p>
            </div>
          </div>
        </div>

        <div 
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-lg hover:border-green-300 transition-all duration-200 transform hover:scale-105"
          onClick={() => {
            addNotification({
              type: 'info',
              title: 'Today\'s Schedule',
              message: `You have ${stats.todayAppointments} appointments scheduled for today.`
            });
            navigate('/appointments');
          }}
        >
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-gray-900">{stats.todayAppointments}</p>
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  {todayAppointments.filter(a => a.status === 'completed').length} done
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Click to view schedule</p>
            </div>
          </div>
        </div>

        <div 
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-lg hover:border-red-300 transition-all duration-200 transform hover:scale-105"
          onClick={() => {
            addNotification({
              type: 'warning',
              title: 'Urgent Tasks',
              message: `You have ${stats.pendingTasks} high-priority tasks requiring attention.`
            });
            navigate('/tasks');
          }}
        >
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Urgent Tasks</p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-gray-900">{stats.pendingTasks}</p>
                {stats.pendingTasks > 0 && (
                  <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full animate-pulse">
                    Action needed
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Click to view tasks</p>
            </div>
          </div>
        </div>

        <div 
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-lg hover:border-purple-300 transition-all duration-200 transform hover:scale-105"
          onClick={() => {
            addNotification({
              type: 'success',
              title: 'Practice Performance',
              message: 'Your practice efficiency is excellent at 94%!'
            });
            navigate('/analytics');
          }}
        >
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Efficiency Score</p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-gray-900">94%</p>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  +2% this week
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Click for analytics</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Today's Schedule</h2>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {todayAppointments.filter(a => a.status === 'completed').length}/{todayAppointments.length} done
                </span>
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div 
                  key={appointment.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                  onClick={() => {
                    addNotification({
                      type: 'info',
                      title: 'Appointment Selected',
                      message: `Viewing appointment with ${appointment.patient} at ${appointment.time}.`
                    });
                    navigate('/appointments');
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
                      {appointment.time}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{appointment.patient}</p>
                      <p className="text-sm text-gray-500">{appointment.type} • {appointment.duration}min</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {appointment.status === 'in_progress' && (
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    )}
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                    {appointment.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={handleViewFullSchedule}
              className="w-full mt-4 text-indigo-600 hover:text-indigo-700 text-sm font-medium bg-indigo-50 py-2 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              View Full Schedule
            </button>
          </div>
        </div>

        {/* Patient Overview */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Patient Overview</h2>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {patients.filter(p => p.status === 'needs_attention').length} need attention
                </span>
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
                <div 
                  key={patient.id} 
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-indigo-300"
                  onClick={() => {
                    addNotification({
                      type: 'info',
                      title: 'Patient Selected',
                      message: `Viewing ${patient.name}'s profile and medical history.`
                    });
                    navigate(`/patients/${patient.id}`);
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      patient.status === 'critical' ? 'bg-red-100' :
                      patient.status === 'needs_attention' ? 'bg-yellow-100' :
                      'bg-indigo-100'
                    }`}>
                      <span className="text-indigo-600 font-medium">{patient.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{patient.name}</p>
                      <p className="text-sm text-gray-500">Age {patient.age} • {patient.condition}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs text-gray-400">Last visit: {patient.lastVisit}</p>
                        {patient.status === 'critical' && (
                          <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full animate-pulse">
                            Critical
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      {patient.nextAppointment && (
                        <p className="text-xs text-gray-500 mb-1">Next: {patient.nextAppointment}</p>
                      )}
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(patient.status)}`}>
                      {patient.status.replace('_', ' ')}
                      </span>
                    </div>
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
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {pendingTasks.filter(t => t.priority === 'high').length} high priority
                </span>
                <span className="text-sm text-gray-500">{pendingTasks.length} total</span>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`p-4 border rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer ${getPriorityColor(task.priority)}`}
                  onClick={() => {
                    addNotification({
                      type: 'info',
                      title: 'Task Details',
                      message: `Viewing task: ${task.description}`
                    });
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`mt-1 p-1 rounded ${
                        task.priority === 'high' ? 'bg-red-100' : 'bg-gray-100'
                      }`}>
                        {getTaskIcon(task.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{task.description}</p>
                        <p className="text-sm text-gray-600">Patient: {task.patient}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-xs text-gray-500">Due: {task.dueDate}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            task.priority === 'high' ? 'bg-red-100 text-red-700' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {task.priority} priority
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCompleteTask(task.id);
                        }}
                        className="p-2 text-green-600 hover:text-green-700 hover:bg-green-100 rounded-full transition-colors"
                        title="Complete task"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDismissTask(task.id);
                        }}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
                        title="Dismiss task"
                      >
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
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
                <p className="text-xs text-gray-500">Click any action to get started</p>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <button 
                  onClick={handleNewConsultation}
                  className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 transform hover:scale-105 group"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                    <Stethoscope className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 group-hover:text-blue-700">New Consultation</span>
                  <span className="text-xs text-gray-500 mt-1">Start patient visit</span>
                </button>
                <button 
                  onClick={handleCreateRecord}
                  className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-all duration-200 transform hover:scale-105 group"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-green-200 transition-colors">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 group-hover:text-green-700">Create Record</span>
                  <span className="text-xs text-gray-500 mt-1">Document patient care</span>
                </button>
                <button 
                  onClick={handleMessagePatient}
                  className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 transform hover:scale-105 group"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
                    <MessageSquare className="h-6 w-6 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 group-hover:text-purple-700">Message Patient</span>
                  <span className="text-xs text-gray-500 mt-1">Secure communication</span>
                </button>
                <button 
                  onClick={handleViewAnalytics}
                  className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 transform hover:scale-105 group"
                >
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-orange-200 transition-colors">
                    <BarChart3 className="h-6 w-6 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 group-hover:text-orange-700">View Analytics</span>
                  <span className="text-xs text-gray-500 mt-1">Practice insights</span>
                </button>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">This Week's Performance</h2>
                <button
                  onClick={() => {
                    addNotification({
                      type: 'info',
                      title: 'Performance Details',
                      message: 'Opening detailed performance analytics.'
                    });
                    navigate('/analytics');
                  }}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                  View Details
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div 
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => {
                    addNotification({
                      type: 'success',
                      title: 'Excellent Patient Care',
                      message: 'You\'ve seen 96% of scheduled patients this week!'
                    });
                  }}
                >
                  <span className="text-sm text-gray-600">Patients Seen</span>
                  <div className="text-right">
                    <span className="font-bold text-green-600">24/25</span>
                    <p className="text-xs text-gray-500">96% completion</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '96%' }}></div>
                </div>
                
                <div 
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => {
                    addNotification({
                      type: 'info',
                      title: 'Consultation Efficiency',
                      message: 'Your average consultation time is optimal at 28 minutes.'
                    });
                  }}
                >
                  <span className="text-sm text-gray-600">Average Consultation Time</span>
                  <div className="text-right">
                    <span className="font-bold text-blue-600">28 min</span>
                    <p className="text-xs text-gray-500">Target: 30 min</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                
                <div 
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => {
                    addNotification({
                      type: 'success',
                      title: 'Outstanding Satisfaction',
                      message: 'Your patient satisfaction score is excellent at 4.8/5.0!'
                    });
                  }}
                >
                  <span className="text-sm text-gray-600">Patient Satisfaction</span>
                  <div className="text-right">
                    <span className="font-bold text-purple-600">4.8/5.0</span>
                    <p className="text-xs text-gray-500">127 reviews</p>
                  </div>
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
      {showClinicalAlert && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-start justify-between">
            <div className="flex items-start">
              <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5" />
              <div className="ml-3">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-sm font-medium text-red-800">Clinical Alerts</h3>
                  <span className="bg-red-200 text-red-800 text-xs px-2 py-1 rounded-full animate-pulse">
                    2 urgent
                  </span>
                </div>
                <div className="mt-2 text-sm text-red-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li 
                      className="cursor-pointer hover:text-red-800 transition-colors"
                      onClick={() => {
                        addNotification({
                          type: 'warning',
                          title: 'Critical Alert',
                          message: 'Robert Davis requires immediate attention for blood pressure reading.'
                        });
                        navigate('/patients/4');
                      }}
                    >
                      <strong>Robert Davis:</strong> Critical blood pressure reading requires immediate attention
                    </li>
                    <li 
                      className="cursor-pointer hover:text-red-800 transition-colors"
                      onClick={() => {
                        addNotification({
                          type: 'warning',
                          title: 'Medication Alert',
                          message: 'Michael Chen\'s HbA1c levels are elevated - medication adjustment needed.'
                        });
                        navigate('/patients/2');
                      }}
                    >
                      <strong>Michael Chen:</strong> HbA1c levels elevated - medication adjustment needed
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    addNotification({
                      type: 'info',
                      title: 'View All Alerts',
                      message: 'Opening comprehensive clinical alerts dashboard.'
                    });
                  }}
                  className="mt-3 text-red-700 hover:text-red-800 text-sm font-medium underline"
                >
                  View All Clinical Alerts
                </button>
              </div>
            </div>
            <button
              onClick={handleDismissAlert}
              className="text-red-600 hover:text-red-700 p-2 hover:bg-red-100 rounded-full transition-colors"
              title="Dismiss alerts"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}