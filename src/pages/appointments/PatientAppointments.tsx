import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../../stores/appStore';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Search, 
  Filter,
  Video,
  Phone,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Star,
  ChevronRight,
  FileText,
  Bell
} from 'lucide-react';

interface Appointment {
  id: string;
  provider_name: string;
  provider_specialty: string;
  provider_rating: number;
  appointment_type: string;
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes: number;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  appointment_method: 'in_person' | 'telehealth' | 'phone';
  location?: string;
  notes?: string;
  cost: number;
  bulk_billing: boolean;
  reminder_sent: boolean;
  can_reschedule: boolean;
  can_cancel: boolean;
}

interface Provider {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews_count: number;
  next_available: string;
  bulk_billing: boolean;
  telehealth_available: boolean;
  location: string;
  distance: string;
  photo_url?: string;
}

export function PatientAppointments() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addNotification, setLoading } = useAppStore();
  const [currentView, setCurrentView] = useState<'overview' | 'book' | 'history'>('overview');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Set view based on URL path
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/book')) {
      setCurrentView('book');
    } else if (path.includes('/history')) {
      setCurrentView('history');
    } else {
      setCurrentView('overview');
    }
  }, [location.pathname]);

  // Mock data
  useEffect(() => {
    const mockAppointments: Appointment[] = [
      {
        id: '1',
        provider_name: 'Dr. Sarah Johnson',
        provider_specialty: 'General Practice',
        provider_rating: 4.9,
        appointment_type: 'Annual Health Check',
        scheduled_date: '2025-01-20',
        scheduled_time: '10:00',
        duration_minutes: 30,
        status: 'confirmed',
        appointment_method: 'in_person',
        location: 'Collins Street Medical Centre',
        cost: 0,
        bulk_billing: true,
        reminder_sent: true,
        can_reschedule: true,
        can_cancel: true
      },
      {
        id: '2',
        provider_name: 'Dr. Michael Chen',
        provider_specialty: 'Cardiology',
        provider_rating: 4.8,
        appointment_type: 'Follow-up Consultation',
        scheduled_date: '2025-01-25',
        scheduled_time: '14:30',
        duration_minutes: 30,
        status: 'scheduled',
        appointment_method: 'telehealth',
        notes: 'Blood pressure monitoring follow-up',
        cost: 85,
        bulk_billing: false,
        reminder_sent: false,
        can_reschedule: true,
        can_cancel: true
      },
      {
        id: '3',
        provider_name: 'Dr. Emily Davis',
        provider_specialty: 'Dermatology',
        provider_rating: 4.7,
        appointment_type: 'Skin Check',
        scheduled_date: '2025-01-30',
        scheduled_time: '09:00',
        duration_minutes: 45,
        status: 'scheduled',
        appointment_method: 'in_person',
        location: 'Skin Cancer Clinic',
        cost: 120,
        bulk_billing: false,
        reminder_sent: false,
        can_reschedule: true,
        can_cancel: true
      },
      {
        id: '4',
        provider_name: 'Dr. Sarah Johnson',
        provider_specialty: 'General Practice',
        provider_rating: 4.9,
        appointment_type: 'General Consultation',
        scheduled_date: '2025-01-15',
        scheduled_time: '15:30',
        duration_minutes: 30,
        status: 'completed',
        appointment_method: 'in_person',
        location: 'Collins Street Medical Centre',
        cost: 0,
        bulk_billing: true,
        reminder_sent: true,
        can_reschedule: false,
        can_cancel: false
      }
    ];

    const mockProviders: Provider[] = [
      {
        id: '1',
        name: 'Dr. Sarah Johnson',
        specialty: 'General Practice',
        rating: 4.9,
        reviews_count: 127,
        next_available: 'Tomorrow 10:00 AM',
        bulk_billing: true,
        telehealth_available: true,
        location: 'Collins Street Medical Centre',
        distance: '2.1 km'
      },
      {
        id: '2',
        name: 'Dr. Michael Chen',
        specialty: 'Cardiology',
        rating: 4.8,
        reviews_count: 89,
        next_available: 'Jan 25, 2:30 PM',
        bulk_billing: false,
        telehealth_available: true,
        location: 'Heart Health Clinic',
        distance: '3.5 km'
      },
      {
        id: '3',
        name: 'Dr. Emily Davis',
        specialty: 'Dermatology',
        rating: 4.7,
        reviews_count: 156,
        next_available: 'Jan 30, 9:00 AM',
        bulk_billing: false,
        telehealth_available: false,
        location: 'Skin Cancer Clinic',
        distance: '1.8 km'
      }
    ];

    setAppointments(mockAppointments);
    setProviders(mockProviders);
  }, []);

  const handleJoinVideo = (appointmentId: string) => {
    addNotification({
      type: 'info',
      title: 'Joining Video Call',
      message: 'Connecting to your telehealth appointment...'
    });
    navigate('/telehealth');
  };

  const handleReschedule = (appointmentId: string) => {
    addNotification({
      type: 'info',
      title: 'Reschedule Appointment',
      message: 'Redirecting to reschedule your appointment.'
    });
    navigate('/appointments/book');
  };

  const handleCancel = (appointmentId: string) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      setAppointments(prev => prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: 'cancelled' as const }
          : apt
      ));
      addNotification({
        type: 'success',
        title: 'Appointment Cancelled',
        message: 'Your appointment has been successfully cancelled.'
      });
    }
  };

  const handleViewDetails = (appointmentId: string) => {
    addNotification({
      type: 'info',
      title: 'Appointment Details',
      message: 'Opening detailed appointment information.'
    });
  };

  const handleBookWithProvider = (providerId: string) => {
    addNotification({
      type: 'info',
      title: 'Booking Appointment',
      message: 'Proceeding to book appointment with selected provider.'
    });
    navigate('/appointments/book', { state: { providerId } });
  };

  const handleViewProviderProfile = (providerId: string) => {
    addNotification({
      type: 'info',
      title: 'Provider Profile',
      message: 'Viewing provider details and reviews.'
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
      confirmed: 'bg-green-100 text-green-800 border-green-200',
      completed: 'bg-gray-100 text-gray-800 border-gray-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status as keyof typeof colors] || colors.scheduled;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'telehealth': return <Video className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const upcomingAppointments = appointments.filter(apt => 
    ['scheduled', 'confirmed'].includes(apt.status) && 
    new Date(apt.scheduled_date) >= new Date()
  );

  const pastAppointments = appointments.filter(apt => 
    apt.status === 'completed' || 
    (apt.status === 'cancelled' && new Date(apt.scheduled_date) < new Date())
  );

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.provider_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.appointment_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || apt.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-gray-900">{upcomingAppointments.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {appointments.filter(a => a.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Video className="h-5 w-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Telehealth</p>
              <p className="text-2xl font-bold text-gray-900">
                {appointments.filter(a => a.appointment_method === 'telehealth').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Bell className="h-5 w-5 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {appointments.filter(a => 
                  new Date(a.scheduled_date).getMonth() === new Date().getMonth()
                ).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Next Appointment */}
      {upcomingAppointments.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
          <h2 className="text-xl font-bold mb-4">Next Appointment</h2>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{upcomingAppointments[0].provider_name}</h3>
                <p className="text-indigo-100">{upcomingAppointments[0].provider_specialty}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(upcomingAppointments[0].scheduled_date).toLocaleDateString('en-AU')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{upcomingAppointments[0].scheduled_time}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {getMethodIcon(upcomingAppointments[0].appointment_method)}
                    <span className="capitalize">{upcomingAppointments[0].appointment_method}</span>
                  </div>
                </div>
                <p className="text-indigo-100 mt-2">{upcomingAppointments[0].appointment_type}</p>
              </div>
              <div className="flex space-x-2">
                {upcomingAppointments[0].appointment_method === 'telehealth' && (
                  <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2">
                    <Video className="h-4 w-4" />
                    <span>Join Video</span>
                  </button>
                )}
                <button className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-md hover:bg-opacity-30">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex space-x-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              onClick={() => setCurrentView('book')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.map((appointment) => (
          <div key={appointment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-indigo-600" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{appointment.provider_name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border flex items-center space-x-1 ${getStatusColor(appointment.status)}`}>
                      {getStatusIcon(appointment.status)}
                      <span>{appointment.status}</span>
                    </span>
                    {appointment.bulk_billing && (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Bulk Billing
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{appointment.provider_specialty}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(appointment.scheduled_date).toLocaleDateString('en-AU')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{appointment.scheduled_time} ({appointment.duration_minutes} min)</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getMethodIcon(appointment.appointment_method)}
                      <span className="capitalize">{appointment.appointment_method.replace('_', ' ')}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm font-medium text-gray-900 mb-1">{appointment.appointment_type}</p>
                  
                  {appointment.location && (
                    <p className="text-sm text-gray-600 mb-2">📍 {appointment.location}</p>
                  )}
                  
                  {appointment.notes && (
                    <p className="text-sm text-gray-600 italic">{appointment.notes}</p>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  {appointment.cost === 0 ? 'Free' : `$${appointment.cost}`}
                </div>
                <div className="text-sm text-gray-500">
                  {appointment.bulk_billing ? 'Bulk billed' : 'Private'}
                </div>
                
                <div className="flex items-center space-x-2 mt-4">
                  {appointment.status === 'scheduled' || appointment.status === 'confirmed' ? (
                    <>
                      {appointment.appointment_method === 'telehealth' && (
                        <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center space-x-1">
                          <Video className="h-3 w-3" />
                          <span>Join</span>
                        </button>
                      )}
                      {appointment.can_reschedule && (
                        <button 
                          onClick={() => handleReschedule(appointment.id)}
                          className="border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-50"
                        >
                          Reschedule
                        </button>
                      )}
                      {appointment.can_cancel && (
                        <button 
                          onClick={() => handleCancel(appointment.id)}
                          className="text-red-600 hover:text-red-700 px-3 py-1 text-sm"
                        >
                          Cancel
                        </button>
                      )}
                    </>
                  ) : appointment.status === 'completed' ? (
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewDetails(appointment.id)}
                        className="border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-50 flex items-center space-x-1"
                      >
                        <FileText className="h-3 w-3" />
                        <span>Summary</span>
                      </button>
                      <button 
                        onClick={() => navigate('/appointments/book')}
                        className="border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-50"
                      >
                        Book Follow-up
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {filteredAppointments.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'You don\'t have any appointments yet.'}
            </p>
            <button
              onClick={() => setCurrentView('book')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Book Your First Appointment
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderBooking = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Book New Appointment</h2>
            <p className="text-gray-600 mt-1">Find and book with healthcare providers</p>
          </div>
          <button
            onClick={() => navigate('/appointments')}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Back to Overview
          </button>
        </div>
      </div>

      {/* Quick Book Options */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Book</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium">General Consultation</span>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm font-medium">Health Check</span>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Video className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium">Telehealth</span>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <span className="text-sm font-medium">Urgent Care</span>
          </button>
        </div>
      </div>

      {/* Provider Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Available Providers</h3>
          <div className="flex items-center space-x-2">
            <button className="text-indigo-600 hover:text-indigo-700 text-sm">📍 Near me</button>
            <button className="text-indigo-600 hover:text-indigo-700 text-sm">⭐ Highly rated</button>
            <button className="text-indigo-600 hover:text-indigo-700 text-sm">💰 Bulk billing</button>
          </div>
        </div>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search by name, specialty, or location..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="space-y-4">
          {providers.map((provider) => (
            <div key={provider.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-indigo-600" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{provider.name}</h4>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{provider.rating}/5</span>
                        <span className="text-sm text-gray-500">({provider.reviews_count} reviews)</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{provider.specialty}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{provider.location} ({provider.distance})</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Next: {provider.next_available}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {provider.bulk_billing && (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Bulk Billing
                        </span>
                      )}
                      {provider.telehealth_available && (
                        <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                          Telehealth Available
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm">
                    Book Appointment
                  </button>
                  <button 
                    onClick={() => handleViewProviderProfile(provider.id)}
                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 text-sm"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          </div>
          
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setCurrentView('overview')}
              className={`px-3 py-1 rounded text-sm font-medium ${
                currentView === 'overview' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => navigate('/appointments/book')}
              className={`px-3 py-1 rounded text-sm font-medium ${
                currentView === 'book' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Book New
            </button>
            <button
              onClick={() => navigate('/appointments/history')}
              className={`px-3 py-1 rounded text-sm font-medium ${
                currentView === 'history' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              History
            </button>
          </div>
        </div>
      </div>

      {/* Content based on current view */}
      {currentView === 'overview' && renderOverview()}
      {currentView === 'book' && renderBooking()}
      {currentView === 'history' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Appointment History</h2>
          <div className="space-y-4">
            {pastAppointments.map((appointment) => (
              <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{appointment.provider_name}</h4>
                    <p className="text-sm text-gray-600">{appointment.appointment_type}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(appointment.scheduled_date).toLocaleDateString('en-AU')} at {appointment.scheduled_time}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                    <button className="text-indigo-600 hover:text-indigo-700 text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}