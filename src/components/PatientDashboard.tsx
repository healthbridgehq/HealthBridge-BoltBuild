import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import { 
  Calendar, 
  Clock, 
  User, 
  Video, 
  MapPin, 
  Plus, 
  FileText, 
  Pill, 
  Target, 
  MessageSquare,
  Activity,
  Heart,
  TrendingUp,
  Bell,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface HealthMetric {
  id: string;
  name: string;
  value: string;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
  lastUpdated: string;
}

interface UpcomingAppointment {
  id: string;
  provider_name: string;
  appointment_type: string;
  date: string;
  time: string;
  method: 'in_person' | 'telehealth' | 'phone';
  location?: string;
}

interface RecentRecord {
  id: string;
  title: string;
  type: string;
  date: string;
  provider: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  next_dose: string;
}

export function PatientDashboard() {
  const navigate = useNavigate();
  const { addNotification, setLoading } = useAppStore();
  
  // State management
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<UpcomingAppointment[]>([]);
  const [recentRecords, setRecentRecords] = useState<RecentRecord[]>([]);
  const [currentMedications, setCurrentMedications] = useState<Medication[]>([]);
  const [healthScore, setHealthScore] = useState(0);
  const [loading, setLocalLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLocalLoading(true);
      setError(null);
      
      // Mock data - in production this would come from Supabase
      const mockHealthMetrics: HealthMetric[] = [
        {
          id: '1',
          name: 'Blood Pressure',
          value: '118/76',
          unit: 'mmHg',
          trend: 'down',
          status: 'good',
          lastUpdated: '2025-01-16'
        },
        {
          id: '2',
          name: 'Weight',
          value: '67.5',
          unit: 'kg',
          trend: 'down',
          status: 'good',
          lastUpdated: '2025-01-16'
        },
        {
          id: '3',
          name: 'Heart Rate',
          value: '68',
          unit: 'bpm',
          trend: 'down',
          status: 'good',
          lastUpdated: '2025-01-16'
        },
        {
          id: '4',
          name: 'Steps Today',
          value: '8,247',
          unit: 'steps',
          trend: 'up',
          status: 'good',
          lastUpdated: '2025-01-16'
        }
      ];

      const mockAppointments: UpcomingAppointment[] = [
        {
          id: '1',
          provider_name: 'Dr. Sarah Johnson',
          appointment_type: 'Follow-up Consultation',
          date: '2025-01-20',
          time: '10:00',
          method: 'in_person',
          location: 'Collins Street Medical Centre'
        },
        {
          id: '2',
          provider_name: 'Dr. Michael Chen',
          appointment_type: 'Cardiology Follow-up',
          date: '2025-01-25',
          time: '14:30',
          method: 'telehealth'
        },
        {
          id: '3',
          provider_name: 'Dr. Emily Davis',
          provider_type: 'Dermatology',
          date: '2025-02-05',
          time: '09:30',
          method: 'in_person',
          location: 'Skin Cancer Clinic'
        }
      ];

      const mockRecords: RecentRecord[] = [
        {
          id: '1',
          title: 'Blood Test Results',
          type: 'test_result',
          date: '2025-01-12',
          provider: 'PathLab Australia'
        },
        {
          id: '2',
          title: 'Annual Health Check',
          type: 'consultation',
          date: '2025-01-15',
          provider: 'Dr. Sarah Johnson'
        },
        {
          id: '3',
          title: 'Prescription Update',
          type: 'prescription',
          date: '2025-01-14',
          provider: 'Dr. Michael Chen'
        }
      ];

      const mockMedications: Medication[] = [
        {
          id: '1',
          name: 'Paracetamol',
          dosage: '500mg',
          frequency: 'As needed',
          next_dose: 'Take as needed for pain'
        },
        {
          id: '2',
          name: 'Atorvastatin',
          dosage: '20mg',
          frequency: 'Daily',
          next_dose: 'Tonight 8:00 PM'
        },
        {
          id: '3',
          name: 'Vitamin D',
          dosage: '1000IU',
          frequency: 'Daily',
          next_dose: 'Tomorrow morning'
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setHealthMetrics(mockHealthMetrics);
      setUpcomingAppointments(mockAppointments);
      setRecentRecords(mockRecords);
      setCurrentMedications(mockMedications);
      setHealthScore(87);
      
    } catch (err) {
      setError('Failed to load dashboard data');
      addNotification({
        type: 'error',
        title: 'Loading Error',
        message: 'Failed to load dashboard data. Please try again.'
      });
    } finally {
      setLocalLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
    addNotification({
      type: 'success',
      title: 'Dashboard Refreshed',
      message: 'Your dashboard data has been updated.'
    });
  };

  const handleBookAppointment = () => {
    setLoading('appointments', true);
    setTimeout(() => {
      setLoading('appointments', false);
      navigate('/appointments/book');
    }, 500);
  };

  const handleViewRecords = () => {
    setLoading('records', true);
    setTimeout(() => {
      setLoading('records', false);
      navigate('/records');
    }, 500);
  };

  const handleViewMedications = () => {
    setLoading('prescriptions', true);
    setTimeout(() => {
      setLoading('prescriptions', false);
      navigate('/medications');
    }, 500);
  };

  const handleSendMessage = () => {
    setLoading('messages', true);
    setTimeout(() => {
      setLoading('messages', false);
      navigate('/messages');
    }, 500);
  };

  const handleJoinTelehealth = (appointmentId: string) => {
    addNotification({
      type: 'info',
      title: 'Joining Telehealth',
      message: 'Connecting to your video consultation...'
    });
    navigate('/telehealth');
  };

  const handleViewGoals = () => {
    addNotification({
      type: 'info',
      title: 'Health Goals',
      message: 'Opening your health goals and progress tracking.'
    });
    navigate('/health-goals');
  };

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, Sarah!</h1>
            <p className="text-gray-600 mt-1">Here's your health overview for today</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{healthScore}</div>
              <div className="text-sm text-gray-500">Health Score</div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <Activity className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Health Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Health Score */}
        <div 
          className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white cursor-pointer hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          onClick={() => {
            addNotification({
              type: 'info',
              title: 'Health Score Details',
              message: 'Your health score is calculated from recent vitals, activity, and health goals progress.'
            });
            navigate('/health-goals');
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100">Health Score</p>
              <p className="text-3xl font-bold">{healthScore}/100</p>
              <p className="text-sm text-indigo-200 mt-1">+2 from last week</p>
            </div>
            <div className="relative">
              <Heart className="h-8 w-8 text-indigo-200" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="mt-4">
            <div className="bg-white bg-opacity-20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${healthScore}%` }}
              ></div>
            </div>
            <p className="text-xs text-indigo-200 mt-2">Click to view health goals</p>
          </div>
        </div>

        {/* Next Appointment */}
        <div 
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all duration-200"
          onClick={() => {
            if (upcomingAppointments.length > 0) {
              addNotification({
                type: 'info',
                title: 'Appointment Details',
                message: `Viewing details for appointment with ${upcomingAppointments[0].provider_name}.`
              });
              navigate('/appointments');
            } else {
              handleBookAppointment();
            }
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <h3 className="font-medium text-gray-900">Next Appointment</h3>
            </div>
            <div className="flex items-center space-x-2">
              {upcomingAppointments.length > 0 && (
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  Confirmed
                </span>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleBookAppointment();
                }}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Book New
              </button>
            </div>
          </div>
          {upcomingAppointments.length > 0 ? (
            <div>
              <p className="font-medium text-gray-900">{upcomingAppointments[0].provider_name}</p>
              <p className="text-sm text-gray-600">{upcomingAppointments[0].appointment_type}</p>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(upcomingAppointments[0].date).toLocaleDateString('en-AU')} at {upcomingAppointments[0].time}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex items-center space-x-1">
                  {getMethodIcon(upcomingAppointments[0].method)}
                  <span className="text-xs text-gray-500 capitalize">
                    {upcomingAppointments[0].method.replace('_', ' ')}
                  </span>
                </div>
                {upcomingAppointments[0].location && (
                  <span className="text-xs text-gray-500">• {upcomingAppointments[0].location}</span>
                )}
              </div>
              {upcomingAppointments[0].method === 'telehealth' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJoinTelehealth(upcomingAppointments[0].id);
                  }}
                  className="mt-3 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center space-x-1 transition-colors"
                >
                  <Video className="h-3 w-3" />
                  <span>Join Video</span>
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm mb-2">No upcoming appointments</p>
              <p className="text-xs text-blue-600">Click to book your next appointment</p>
            </div>
          )}
        </div>

        {/* Medications */}
        <div 
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md hover:border-green-300 transition-all duration-200"
          onClick={() => {
            addNotification({
              type: 'info',
              title: 'Medications Overview',
              message: 'Viewing your current medications and prescription history.'
            });
            handleViewMedications();
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Pill className="h-5 w-5 text-green-600" />
              <h3 className="font-medium text-gray-900">Medications</h3>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {currentMedications.length} active
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewMedications();
                }}
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                View All
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {currentMedications.slice(0, 2).map((medication) => (
              <div key={medication.id} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{medication.name} {medication.dosage}</p>
                    <p className="text-xs text-gray-500">{medication.frequency}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">{medication.next_dose}</p>
                  </div>
                </div>
              </div>
            ))}
            {currentMedications.length > 2 && (
              <p className="text-xs text-gray-500 text-center">
                +{currentMedications.length - 2} more medications
              </p>
            )}
          </div>
        </div>

        {/* Health Records */}
        <div 
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md hover:border-purple-300 transition-all duration-200"
          onClick={() => {
            addNotification({
              type: 'info',
              title: 'Health Records',
              message: 'Accessing your complete health record history.'
            });
            handleViewRecords();
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-purple-600" />
              <h3 className="font-medium text-gray-900">Recent Records</h3>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {recentRecords.length} recent
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewRecords();
                }}
                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                View All
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {recentRecords.slice(0, 2).map((record) => (
              <div key={record.id} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{record.title}</p>
                    <p className="text-xs text-gray-500">{record.provider}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">{new Date(record.date).toLocaleDateString('en-AU')}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      record.type === 'test_result' ? 'bg-blue-100 text-blue-700' :
                      record.type === 'consultation' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {record.type.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {recentRecords.length > 2 && (
              <p className="text-xs text-gray-500 text-center">
                +{recentRecords.length - 2} more records
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Health Metrics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Latest Health Metrics</h2>
          <button
            onClick={() => {
              addNotification({
                type: 'info',
                title: 'Health Trends',
                message: 'Viewing detailed health metrics and trends.'
              });
            }}
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
          >
            View Trends
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {healthMetrics.map((metric) => (
            <div 
              key={metric.id} 
              className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md hover:border-indigo-300 transition-all duration-200 transform hover:scale-105"
              onClick={() => {
                addNotification({
                  type: 'info',
                  title: `${metric.name} Details`,
                  message: `Current ${metric.name.toLowerCase()}: ${metric.value} ${metric.unit}. Last updated ${new Date(metric.lastUpdated).toLocaleDateString('en-AU')}.`
                });
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{metric.name}</h4>
                <div className="flex items-center space-x-1">
                  {getTrendIcon(metric.trend)}
                  <span className={`text-xs ${
                    metric.trend === 'up' ? 'text-green-600' :
                    metric.trend === 'down' ? 'text-blue-600' :
                    'text-gray-600'
                  }`}>
                    {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
                  </span>
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                <span className="text-sm text-gray-500">{metric.unit}</span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getMetricStatusColor(metric.status)}`}>
                  {metric.status}
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {new Date(metric.lastUpdated).toLocaleDateString('en-AU')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          <p className="text-sm text-gray-500">Click any action to get started</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <button 
            onClick={handleBookAppointment}
            className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 transform hover:scale-105 group"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-900 group-hover:text-blue-700">Book Appointment</span>
            <span className="text-xs text-gray-500 mt-1">Schedule with providers</span>
          </button>
          <button 
            onClick={handleViewRecords}
            className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 transform hover:scale-105 group"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-gray-900 group-hover:text-purple-700">View Records</span>
            <span className="text-xs text-gray-500 mt-1">Access health history</span>
          </button>
          <button 
            onClick={handleSendMessage}
            className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-all duration-200 transform hover:scale-105 group"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-green-200 transition-colors">
              <MessageSquare className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-900 group-hover:text-green-700">Message Provider</span>
            <span className="text-xs text-gray-500 mt-1">Secure communication</span>
          </button>
          <button 
            onClick={handleViewGoals}
            className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 transform hover:scale-105 group"
          >
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-orange-200 transition-colors">
              <Target className="h-6 w-6 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-gray-900 group-hover:text-orange-700">Health Goals</span>
            <span className="text-xs text-gray-500 mt-1">Track progress</span>
          </button>
        </div>
      </div>

      {/* Health Alerts */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-6 w-6 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Health Status</h4>
              <ul className="mt-2 text-sm text-blue-700 space-y-1">
                <li>• All vital signs within normal range</li>
                <li>• Medication adherence: 95% this month</li>
                <li>• Next health check due in 3 weeks</li>
              </ul>
            </div>
          </div>
          <button
            onClick={() => {
              addNotification({
                type: 'success',
                title: 'Health Status',
                message: 'Your health indicators are all looking good!'
              });
            }}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View Details
          </button>
        </div>
      </div>

      {/* Activity Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white cursor-pointer hover:shadow-lg transition-all duration-200"
            onClick={() => {
              addNotification({
                type: 'success',
                title: 'Step Goal Progress',
                message: 'You\'ve completed 82% of your daily step goal!'
              });
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Steps Today</p>
                <p className="text-2xl font-bold">8,247</p>
                <p className="text-green-200 text-xs">Goal: 10,000</p>
              </div>
              <Activity className="h-8 w-8 text-green-200" />
            </div>
            <div className="mt-3">
              <div className="bg-white bg-opacity-20 rounded-full h-2">
                <div className="bg-white h-2 rounded-full" style={{ width: '82%' }}></div>
              </div>
            </div>
          </div>
          
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white cursor-pointer hover:shadow-lg transition-all duration-200"
            onClick={() => {
              addNotification({
                type: 'info',
                title: 'Water Intake',
                message: 'Remember to stay hydrated! You\'ve had 6 out of 8 glasses today.'
              });
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Water Intake</p>
                <p className="text-2xl font-bold">6/8</p>
                <p className="text-blue-200 text-xs">Glasses</p>
              </div>
              <div className="relative">
                <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-bold">💧</span>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <div className="bg-white bg-opacity-20 rounded-full h-2">
                <div className="bg-white h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
          
          <div 
            className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white cursor-pointer hover:shadow-lg transition-all duration-200"
            onClick={() => {
              addNotification({
                type: 'info',
                title: 'Sleep Quality',
                message: 'Your sleep quality has been excellent this week!'
              });
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Sleep Quality</p>
                <p className="text-2xl font-bold">8.5/10</p>
                <p className="text-purple-200 text-xs">Last night</p>
              </div>
              <div className="relative">
                <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-sm font-bold">😴</span>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <div className="bg-white bg-opacity-20 rounded-full h-2">
                <div className="bg-white h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}