import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  Plus, 
  Search, 
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Video,
  Phone,
  MapPin,
  AlertTriangle,
  CheckCircle,
  XCircle,
  User,
  Bell,
  Activity,
  FileText,
  Stethoscope
} from 'lucide-react';

interface Appointment {
  id: string;
  patient_name: string;
  patient_id: string;
  patient_phone: string;
  patient_email: string;
  appointment_type: string;
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes: number;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  appointment_method: 'in_person' | 'telehealth' | 'phone';
  notes?: string;
  room?: string;
  priority: 'normal' | 'urgent' | 'emergency';
  checked_in_at?: string;
  vitals_completed?: boolean;
  forms_completed?: boolean;
}

interface WaitingPatient {
  id: string;
  name: string;
  appointment_time: string;
  wait_time_minutes: number;
  status: 'waiting' | 'ready' | 'in_room';
  priority: 'normal' | 'urgent' | 'emergency';
  vitals_needed: boolean;
  forms_pending: boolean;
}

export function PractitionerAppointments() {
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month' | 'waiting'>('day');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [waitingPatients, setWaitingPatients] = useState<WaitingPatient[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock data for today's appointments
  useEffect(() => {
    const mockAppointments: Appointment[] = [
      {
        id: '1',
        patient_name: 'Sarah Johnson',
        patient_id: 'P001',
        patient_phone: '0412 345 678',
        patient_email: 'sarah.j@email.com',
        appointment_type: 'Annual Health Check',
        scheduled_date: '2025-01-16',
        scheduled_time: '09:00',
        duration_minutes: 30,
        status: 'in_progress',
        appointment_method: 'in_person',
        room: 'Room 1',
        priority: 'normal',
        checked_in_at: '2025-01-16T08:55:00Z',
        vitals_completed: true,
        forms_completed: true
      },
      {
        id: '2',
        patient_name: 'Michael Chen',
        patient_id: 'P002',
        patient_phone: '0423 456 789',
        patient_email: 'michael.c@email.com',
        appointment_type: 'Follow-up Consultation',
        scheduled_date: '2025-01-16',
        scheduled_time: '10:00',
        duration_minutes: 15,
        status: 'confirmed',
        appointment_method: 'telehealth',
        priority: 'normal',
        notes: 'Blood pressure monitoring follow-up'
      },
      {
        id: '3',
        patient_name: 'Emma Wilson',
        patient_id: 'P003',
        patient_phone: '0434 567 890',
        patient_email: 'emma.w@email.com',
        appointment_type: 'Emergency Consultation',
        scheduled_date: '2025-01-16',
        scheduled_time: '11:00',
        duration_minutes: 45,
        status: 'scheduled',
        appointment_method: 'in_person',
        room: 'Room 2',
        priority: 'urgent',
        notes: 'Chest pain - requires immediate attention'
      },
      {
        id: '4',
        patient_name: 'Robert Davis',
        patient_id: 'P004',
        patient_phone: '0445 678 901',
        patient_email: 'robert.d@email.com',
        appointment_type: 'Specialist Referral',
        scheduled_date: '2025-01-16',
        scheduled_time: '14:00',
        duration_minutes: 30,
        status: 'scheduled',
        appointment_method: 'in_person',
        room: 'Room 1',
        priority: 'normal'
      },
      {
        id: '5',
        patient_name: 'Lisa Anderson',
        patient_id: 'P005',
        patient_phone: '0456 789 012',
        patient_email: 'lisa.a@email.com',
        appointment_type: 'Health Check',
        scheduled_date: '2025-01-16',
        scheduled_time: '15:30',
        duration_minutes: 45,
        status: 'scheduled',
        appointment_method: 'in_person',
        room: 'Room 3',
        priority: 'normal'
      }
    ];

    const mockWaitingPatients: WaitingPatient[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        appointment_time: '09:00',
        wait_time_minutes: 8,
        status: 'in_room',
        priority: 'normal',
        vitals_needed: false,
        forms_pending: false
      },
      {
        id: '6',
        name: 'Tom Wilson',
        appointment_time: '09:30',
        wait_time_minutes: 15,
        status: 'waiting',
        priority: 'normal',
        vitals_needed: true,
        forms_pending: false
      },
      {
        id: '7',
        name: 'Anna Smith',
        appointment_time: '10:30',
        wait_time_minutes: 5,
        status: 'ready',
        priority: 'normal',
        vitals_needed: false,
        forms_pending: false
      }
    ];

    setAppointments(mockAppointments);
    setWaitingPatients(mockWaitingPatients);
  }, [selectedDate]);

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
      confirmed: 'bg-green-100 text-green-800 border-green-200',
      in_progress: 'bg-purple-100 text-purple-800 border-purple-200',
      completed: 'bg-gray-100 text-gray-800 border-gray-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      no_show: 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[status as keyof typeof colors] || colors.scheduled;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      normal: 'border-l-blue-500',
      urgent: 'border-l-yellow-500',
      emergency: 'border-l-red-500'
    };
    return colors[priority as keyof typeof colors] || colors.normal;
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'telehealth': return <Video className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress': return <Activity className="h-4 w-4 text-purple-600 animate-pulse" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'no_show': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default: return <Clock className="h-4 w-4 text-blue-600" />;
    }
  };

  const handleStartConsultation = (appointmentId: string) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointmentId 
        ? { ...apt, status: 'in_progress' as const }
        : apt
    ));
  };

  const handleCompleteAppointment = (appointmentId: string) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointmentId 
        ? { ...apt, status: 'completed' as const }
        : apt
    ));
  };

  const handleCheckInPatient = (patientId: string) => {
    setWaitingPatients(prev => prev.map(patient => 
      patient.id === patientId 
        ? { ...patient, status: 'ready' as const }
        : patient
    ));
  };

  const todaysAppointments = appointments.filter(apt => 
    apt.scheduled_date === selectedDate.toISOString().split('T')[0]
  );

  const filteredAppointments = todaysAppointments.filter(apt => {
    const matchesSearch = apt.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.appointment_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || apt.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const renderDayView = () => (
    <div className="space-y-6">
      {/* Today's Overview */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Today's Schedule</h2>
            <p className="text-blue-100 mt-1">
              {selectedDate.toLocaleDateString('en-AU', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{todaysAppointments.length}</div>
            <div className="text-blue-100">appointments</div>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
            <div className="text-lg font-bold">{todaysAppointments.filter(a => a.status === 'completed').length}</div>
            <div className="text-xs text-blue-100">Completed</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
            <div className="text-lg font-bold">{todaysAppointments.filter(a => a.status === 'in_progress').length}</div>
            <div className="text-xs text-blue-100">In Progress</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
            <div className="text-lg font-bold">{todaysAppointments.filter(a => ['scheduled', 'confirmed'].includes(a.status)).length}</div>
            <div className="text-xs text-blue-100">Upcoming</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
            <div className="text-lg font-bold">{waitingPatients.length}</div>
            <div className="text-xs text-blue-100">Waiting</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search patients or appointment types..."
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
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Appointment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Appointments Timeline */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Today's Appointments</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className={`border-l-4 ${getPriorityColor(appointment.priority)} bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="text-center min-w-[60px]">
                      <div className="text-lg font-bold text-gray-900">{appointment.scheduled_time}</div>
                      <div className="text-xs text-gray-500">{appointment.duration_minutes}min</div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{appointment.patient_name}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(appointment.status)}`}>
                          {appointment.status.replace('_', ' ')}
                        </span>
                        {appointment.priority !== 'normal' && (
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            appointment.priority === 'urgent' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {appointment.priority}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center space-x-1">
                          {getMethodIcon(appointment.appointment_method)}
                          <span className="capitalize">{appointment.appointment_method.replace('_', ' ')}</span>
                        </div>
                        {appointment.room && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{appointment.room}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{appointment.patient_id}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-2">{appointment.appointment_type}</p>
                      
                      {appointment.notes && (
                        <p className="text-sm text-gray-600 italic">{appointment.notes}</p>
                      )}
                      
                      {appointment.checked_in_at && (
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>✓ Checked in at {new Date(appointment.checked_in_at).toLocaleTimeString()}</span>
                          {appointment.vitals_completed && <span>✓ Vitals completed</span>}
                          {appointment.forms_completed && <span>✓ Forms completed</span>}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(appointment.status)}
                    
                    <div className="flex items-center space-x-1">
                      {appointment.status === 'scheduled' || appointment.status === 'confirmed' ? (
                        <>
                          <button
                            onClick={() => handleStartConsultation(appointment.id)}
                            className="bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700 flex items-center space-x-1"
                          >
                            <Stethoscope className="h-3 w-3" />
                            <span>Start</span>
                          </button>
                          {appointment.appointment_method === 'telehealth' && (
                            <button className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 flex items-center space-x-1">
                              <Video className="h-3 w-3" />
                              <span>Join</span>
                            </button>
                          )}
                        </>
                      ) : appointment.status === 'in_progress' ? (
                        <button
                          onClick={() => handleCompleteAppointment(appointment.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 flex items-center space-x-1"
                        >
                          <CheckCircle className="h-3 w-3" />
                          <span>Complete</span>
                        </button>
                      ) : null}
                      
                      <button className="text-gray-400 hover:text-gray-600 p-1">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredAppointments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No appointments found for the selected criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderWaitingRoom = () => (
    <div className="space-y-6">
      {/* Waiting Room Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Waiting Room Management</h2>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Average wait time: <span className="font-medium">12 minutes</span>
            </div>
            <button className="text-indigo-600 hover:text-indigo-700">
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{waitingPatients.filter(p => p.status === 'waiting').length}</div>
            <div className="text-sm text-blue-600">Waiting</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{waitingPatients.filter(p => p.status === 'ready').length}</div>
            <div className="text-sm text-green-600">Ready</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{waitingPatients.filter(p => p.status === 'in_room').length}</div>
            <div className="text-sm text-purple-600">In Room</div>
          </div>
        </div>
      </div>

      {/* Waiting Patients */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Current Queue</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {waitingPatients.map((patient) => (
              <div
                key={patient.id}
                className={`p-4 rounded-lg border-2 ${
                  patient.status === 'waiting' ? 'border-blue-200 bg-blue-50' :
                  patient.status === 'ready' ? 'border-green-200 bg-green-50' :
                  'border-purple-200 bg-purple-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-indigo-600" />
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900">{patient.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Appointment: {patient.appointment_time}</span>
                        <span>Waiting: {patient.wait_time_minutes} min</span>
                        {patient.priority !== 'normal' && (
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            patient.priority === 'urgent' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {patient.priority}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 mt-1">
                        {patient.vitals_needed && (
                          <span className="text-xs text-orange-600">⚠ Vitals needed</span>
                        )}
                        {patient.forms_pending && (
                          <span className="text-xs text-orange-600">⚠ Forms pending</span>
                        )}
                        {!patient.vitals_needed && !patient.forms_pending && (
                          <span className="text-xs text-green-600">✓ Ready for consultation</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {patient.status === 'waiting' && (
                      <button
                        onClick={() => handleCheckInPatient(patient.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Call Patient
                      </button>
                    )}
                    
                    <button className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 flex items-center space-x-1">
                      <FileText className="h-3 w-3" />
                      <span>Notes</span>
                    </button>
                    
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
            <h1 className="text-2xl font-bold text-gray-900">Appointment Management</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setCurrentView('day')}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  currentView === 'day' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
              >
                Day
              </button>
              <button
                onClick={() => setCurrentView('week')}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  currentView === 'week' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setCurrentView('waiting')}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  currentView === 'waiting' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
              >
                Waiting Room
              </button>
            </div>
            
            {currentView !== 'waiting' && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedDate(new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000))}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm font-medium text-gray-900 min-w-[120px] text-center">
                  {selectedDate.toLocaleDateString('en-AU', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
                <button
                  onClick={() => setSelectedDate(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000))}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content based on current view */}
      {currentView === 'day' && renderDayView()}
      {currentView === 'waiting' && renderWaitingRoom()}
      {currentView === 'week' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-gray-500">Week view coming soon...</p>
        </div>
      )}
    </div>
  );
}