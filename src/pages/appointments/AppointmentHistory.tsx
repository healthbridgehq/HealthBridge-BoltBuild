import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, FileText, Star, Filter, Search, Download } from 'lucide-react';

interface HistoricalAppointment {
  id: string;
  provider_name: string;
  provider_specialty: string;
  appointment_type: string;
  date: string;
  time: string;
  duration: number;
  status: 'completed' | 'cancelled' | 'no_show';
  method: 'in_person' | 'telehealth' | 'phone';
  location?: string;
  cost: number;
  bulk_billing: boolean;
  notes?: string;
  rating?: number;
  follow_up_required: boolean;
  prescription_issued: boolean;
  referral_made: boolean;
}

export function AppointmentHistory() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<HistoricalAppointment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');

  useEffect(() => {
    // Mock historical data
    const mockAppointments: HistoricalAppointment[] = [
      {
        id: '1',
        provider_name: 'Dr. Sarah Johnson',
        provider_specialty: 'General Practice',
        appointment_type: 'General Consultation',
        date: '2025-01-15',
        time: '15:30',
        duration: 30,
        status: 'completed',
        method: 'in_person',
        location: 'Collins Street Medical Centre',
        cost: 0,
        bulk_billing: true,
        notes: 'Discussed headache symptoms. Recommended stress management.',
        rating: 5,
        follow_up_required: false,
        prescription_issued: true,
        referral_made: false
      },
      {
        id: '2',
        provider_name: 'Dr. Michael Chen',
        provider_specialty: 'Cardiology',
        appointment_type: 'Specialist Consultation',
        date: '2025-01-10',
        time: '14:00',
        duration: 45,
        status: 'completed',
        method: 'telehealth',
        cost: 85,
        bulk_billing: false,
        notes: 'Blood pressure review. Medication adjustment recommended.',
        rating: 4,
        follow_up_required: true,
        prescription_issued: true,
        referral_made: false
      },
      {
        id: '3',
        provider_name: 'Dr. Emily Davis',
        provider_specialty: 'Dermatology',
        appointment_type: 'Skin Check',
        date: '2024-12-20',
        time: '10:00',
        duration: 30,
        status: 'completed',
        method: 'in_person',
        location: 'Skin Cancer Clinic',
        cost: 120,
        bulk_billing: false,
        notes: 'Annual skin cancer screening. All clear.',
        rating: 5,
        follow_up_required: false,
        prescription_issued: false,
        referral_made: false
      },
      {
        id: '4',
        provider_name: 'Dr. James Wilson',
        provider_specialty: 'Orthopedics',
        appointment_type: 'Follow-up',
        date: '2024-12-15',
        time: '11:30',
        duration: 20,
        status: 'cancelled',
        method: 'in_person',
        location: 'Bone & Joint Centre',
        cost: 95,
        bulk_billing: false,
        notes: 'Patient cancelled due to illness.',
        follow_up_required: false,
        prescription_issued: false,
        referral_made: false
      }
    ];

    setAppointments(mockAppointments);
  }, []);

  const filteredAppointments = appointments
    .filter(apt => {
      const matchesSearch = apt.provider_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           apt.appointment_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           apt.provider_specialty.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || apt.status === filterStatus;
      
      const matchesPeriod = filterPeriod === 'all' || (() => {
        const aptDate = new Date(apt.date);
        const now = new Date();
        const monthsAgo = new Date(now.getFullYear(), now.getMonth() - parseInt(filterPeriod), now.getDate());
        return aptDate >= monthsAgo;
      })();
      
      return matchesSearch && matchesStatus && matchesPeriod;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date_asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'provider':
          return a.provider_name.localeCompare(b.provider_name);
        default:
          return 0;
      }
    });

  const getStatusColor = (status: string) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      no_show: 'bg-orange-100 text-orange-800'
    };
    return colors[status as keyof typeof colors] || colors.completed;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Appointment History</h1>
          </div>
          <button
            onClick={() => navigate('/appointments')}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Back to Appointments
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no_show">No Show</option>
            </select>
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Time</option>
              <option value="1">Last Month</option>
              <option value="3">Last 3 Months</option>
              <option value="6">Last 6 Months</option>
              <option value="12">Last Year</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="provider">By Provider</option>
            </select>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">
              {appointments.filter(a => a.status === 'completed').length}
            </div>
            <div className="text-sm text-blue-600">Completed</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">
              {appointments.filter(a => a.rating && a.rating >= 4).length}
            </div>
            <div className="text-sm text-green-600">Highly Rated</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">
              {appointments.filter(a => a.method === 'telehealth').length}
            </div>
            <div className="text-sm text-purple-600">Telehealth</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-600">
              ${appointments.reduce((sum, a) => sum + a.cost, 0).toFixed(0)}
            </div>
            <div className="text-sm text-orange-600">Total Cost</div>
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
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                      {appointment.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-1">{appointment.provider_specialty}</p>
                  <p className="text-sm font-medium text-gray-900 mb-2">{appointment.appointment_type}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(appointment.date).toLocaleDateString('en-AU')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{appointment.time} ({appointment.duration} min)</span>
                    </div>
                    <span className="capitalize">{appointment.method.replace('_', ' ')}</span>
                  </div>
                  
                  {appointment.location && (
                    <p className="text-sm text-gray-600 mb-2">📍 {appointment.location}</p>
                  )}
                  
                  {appointment.notes && (
                    <p className="text-sm text-gray-600 italic mb-2">"{appointment.notes}"</p>
                  )}
                  
                  {appointment.rating && appointment.status === 'completed' && (
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm text-gray-600">Your rating:</span>
                      <div className="flex space-x-1">
                        {renderStars(appointment.rating)}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    {appointment.prescription_issued && <span>✓ Prescription issued</span>}
                    {appointment.referral_made && <span>✓ Referral made</span>}
                    {appointment.follow_up_required && <span>⚠ Follow-up required</span>}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  {appointment.cost === 0 ? 'Free' : `$${appointment.cost}`}
                </div>
                <div className="text-sm text-gray-500">
                  {appointment.bulk_billing ? 'Bulk billed' : 'Private'}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-4">
              <div className="flex items-center space-x-4">
                <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center space-x-1">
                  <FileText className="h-4 w-4" />
                  <span>View Summary</span>
                </button>
                {appointment.status === 'completed' && (
                  <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                    Book Follow-up
                  </button>
                )}
                <button className="text-gray-600 hover:text-gray-700 text-sm font-medium flex items-center space-x-1">
                  <Download className="h-4 w-4" />
                  <span>Download Receipt</span>
                </button>
              </div>
              
              {appointment.status === 'completed' && !appointment.rating && (
                <button className="text-yellow-600 hover:text-yellow-700 text-sm font-medium flex items-center space-x-1">
                  <Star className="h-4 w-4" />
                  <span>Rate Experience</span>
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredAppointments.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointment history found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterStatus !== 'all' || filterPeriod !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'You don\'t have any past appointments yet.'}
            </p>
            <button
              onClick={() => navigate('/appointments/book')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Book Your First Appointment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}