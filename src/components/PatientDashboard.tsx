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
          value: '120/80',
          unit: 'mmHg',
          trend: 'stable',
          status: 'good',
          lastUpdated: '2025-01-15'
        },
        {
          id: '2',
          name: 'Weight',
          value: '68',
          unit: 'kg',
          trend: 'down',
          status: 'good',
          lastUpdated: '2025-01-14'
        },
        {
          id: '3',
          name: 'Heart Rate',
          value: '72',
          unit: 'bpm',
          trend: 'stable',
          status: 'good',
          lastUpdated: '2025-01-15'
        }
      ];

      const mockAppointments: UpcomingAppointment[] = [
        {
          id: '1',
          provider_name: 'Dr. Sarah Johnson',
          appointment_type: 'Annual Health Check',
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
          title: 'General Consultation',
          type: 'consultation',
          date: '2025-01-10',
          provider: 'Dr. Sarah Johnson'
        }
      ];

      const mockMedications: Medication[] = [
        {
          id: '1',
          name: 'Paracetamol',
          dosage: '500mg',
          frequency: 'As needed',
          next_dose: 'N/A'
        },
        {
          id: '2',
          name: 'Atorvastatin',
          dosage: '20mg',
          frequency: 'Daily',
          next_dose: 'Tonight 8:00 PM'
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setHealthMetrics(mockHealthMetrics);
      setUpcomingAppointments(mockAppointments);
      setRecentRecords(mockRecords);
      setCurrentMedications(mockMedications);
      setHealthScore(85);
      
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Health Score */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100">Health Score</p>
              <p className="text-3xl font-bold">{healthScore}/100</p>
            </div>
            <Heart className="h-8 w-8 text-indigo-200" />
          </div>
          <div className="mt-4">
            <div className="bg-white bg-opacity-20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${healthScore}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Next Appointment */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <h3 className="font-medium text-gray-900">Next Appointment</h3>
            </div>
            <button
              onClick={handleBookAppointment}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Book New
            </button>
          </div>
          {upcomingAppointments.length > 0 ? (
            <div>
              <p className="font-medium text-gray-900">{upcomingAppointments[0].provider_name}</p>
              <p className="text-sm text-gray-600">{upcomingAppointments[0].appointment_type}</p>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(upcomingAppointments[0].date).toLocaleDateString('en-AU')} at {upcomingAppointments[0].time}
              </p>
              {upcomingAppointments[0].method === 'telehealth' && (
                <button
                  onClick={() => handleJoinTelehealth(upcomingAppointments[0].id)}
                  className="mt-2 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center space-x-1"
                >
                  <Video className="h-3 w-3" />
                  <span>Join Video</span>
                </button>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No upcoming appointments</p>
          )}
        </div>

        {/* Medications */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Pill className="h-5 w-5 text-green-600" />
              <h3 className="font-medium text-gray-900">Medications</h3>
            </div>
            <button
              onClick={handleViewMedications}
              className="text-green-600 hover:text-green-700 text-sm"
            >
              View All
            </button>
          </div>
          <div className="space-y-2">
            {currentMedications.slice(0, 2).map((medication) => (
              <div key={medication.id} className="text-sm">
                <p className="font-medium text-gray-900">{medication.name} {medication.dosage}</p>
                <p className="text-gray-500">{medication.frequency}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Health Records */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-purple-600" />
              <h3 className="font-medium text-gray-900">Recent Records</h3>
            </div>
            <button
              onClick={handleViewRecords}
              className="text-purple-600 hover:text-purple-700 text-sm"
            >
              View All
            </button>
          </div>
          <div className="space-y-2">
            {recentRecords.slice(0, 2).map((record) => (
              <div key={record.id} className="text-sm">
                <p className="font-medium text-gray-900">{record.title}</p>
                <p className="text-gray-500">{new Date(record.date).toLocaleDateString('en-AU')}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Health Metrics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Latest Health Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {healthMetrics.map((metric) => (
            <div key={metric.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{metric.name}</h4>
                {getTrendIcon(metric.trend)}
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                <span className="text-sm text-gray-500">{metric.unit}</span>
              </div>
              <div className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-2 ${getMetricStatusColor(metric.status)}`}>
                {metric.status}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Updated {new Date(metric.lastUpdated).toLocaleDateString('en-AU')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={handleBookAppointment}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Calendar className="h-6 w-6 text-indigo-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Book Appointment</span>
          </button>
          <button 
            onClick={handleViewRecords}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileText className="h-6 w-6 text-indigo-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">View Records</span>
          </button>
          <button 
            onClick={handleSendMessage}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <MessageSquare className="h-6 w-6 text-indigo-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Message Provider</span>
          </button>
          <button 
            onClick={handleViewGoals}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Target className="h-6 w-6 text-indigo-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Health Goals</span>
          </button>
        </div>
      </div>

      {/* Health Alerts */}
      {healthMetrics.some(m => m.status === 'warning' || m.status === 'critical') && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Bell className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800">Health Reminders</h4>
              <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                <li>• Your next health check is due in 2 weeks</li>
                <li>• Remember to take your evening medication</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedProvider || !selectedType || !selectedTime}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Scheduling...</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Schedule Appointment</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}