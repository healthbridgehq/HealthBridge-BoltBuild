import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Pill, Plus, Search, Filter, Download, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

interface Prescription {
  id: string;
  prescription_number: string;
  medication_name: string;
  strength: string;
  form: string;
  quantity: number;
  dosage_instructions: string;
  provider_name: string;
  prescription_date: string;
  status: 'active' | 'dispensed' | 'cancelled' | 'expired';
  repeats_remaining: number;
  expiry_date: string;
  pbs_listed: boolean;
  cost_to_patient: number;
}

export function Prescriptions() {
  const location = useLocation();
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [currentView, setCurrentView] = useState('overview');

  // Set view based on URL path
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/active')) {
      setCurrentView('active');
    } else if (path.includes('/history')) {
      setCurrentView('history');
    } else if (path.includes('/request')) {
      setCurrentView('request');
    } else {
      setCurrentView('overview');
    }
  }, [location.pathname]);

  // Mock data for preview
  useEffect(() => {
    setPrescriptions([
      {
        id: '1',
        prescription_number: 'RX20250115001',
        medication_name: 'Paracetamol',
        strength: '500mg',
        form: 'tablet',
        quantity: 20,
        dosage_instructions: 'Take 1-2 tablets every 4-6 hours as needed for pain. Maximum 8 tablets in 24 hours.',
        provider_name: 'Dr. Sarah Johnson',
        prescription_date: '2025-01-15',
        status: 'active',
        repeats_remaining: 2,
        expiry_date: '2025-07-15',
        pbs_listed: true,
        cost_to_patient: 5.99
      },
      {
        id: '2',
        prescription_number: 'RX20250112002',
        medication_name: 'Atorvastatin',
        strength: '20mg',
        form: 'tablet',
        quantity: 30,
        dosage_instructions: 'Take 1 tablet daily with evening meal.',
        provider_name: 'Dr. Michael Chen',
        prescription_date: '2025-01-12',
        status: 'dispensed',
        repeats_remaining: 4,
        expiry_date: '2025-07-12',
        pbs_listed: true,
        cost_to_patient: 15.99
      },
      {
        id: '3',
        prescription_number: 'RX20250110003',
        medication_name: 'Salbutamol Inhaler',
        strength: '100mcg',
        form: 'inhaler',
        quantity: 1,
        dosage_instructions: '1-2 puffs as needed for shortness of breath. Maximum 8 puffs in 24 hours.',
        provider_name: 'Dr. Emily Davis',
        prescription_date: '2025-01-10',
        status: 'active',
        repeats_remaining: 1,
        expiry_date: '2025-07-10',
        pbs_listed: true,
        cost_to_patient: 11.99
      },
      {
        id: '4',
        prescription_number: 'RX20241220004',
        medication_name: 'Amoxicillin',
        strength: '500mg',
        form: 'capsule',
        quantity: 21,
        dosage_instructions: 'Take 1 capsule three times daily for 7 days. Complete the full course.',
        provider_name: 'Dr. Sarah Johnson',
        prescription_date: '2024-12-20',
        status: 'expired',
        repeats_remaining: 0,
        expiry_date: '2024-12-27',
        pbs_listed: true,
        cost_to_patient: 12.50
      }
    ]);
  }, []);

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = prescription.medication_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.provider_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.prescription_number.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || prescription.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      dispensed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
      expired: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || colors.active;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'dispensed':
        return <Pill className="h-4 w-4" />;
      case 'expired':
        return <Clock className="h-4 w-4" />;
      case 'cancelled':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Pill className="h-4 w-4" />;
    }
  };

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Pill className="h-6 w-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Medications & Prescriptions</h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => navigate('/medications')}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  currentView === 'overview' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => navigate('/medications/active')}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  currentView === 'active' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => navigate('/medications/history')}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  currentView === 'history' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
              >
                History
              </button>
            </div>
            <button
              onClick={() => navigate('/medications/request')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Request Prescription</span>
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search medications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="dispensed">Dispensed</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Prescriptions List */}
      {currentView === 'request' ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Request Prescription</h2>
          <p className="text-gray-500">Prescription request form will be available here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPrescriptions
            .filter(prescription => {
              if (currentView === 'active') return ['active', 'dispensed'].includes(prescription.status);
              if (currentView === 'history') return ['expired', 'cancelled'].includes(prescription.status);
              return true;
            })
            .map((prescription) => (
          <div key={prescription.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Pill className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {prescription.medication_name} {prescription.strength}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${getStatusColor(prescription.status)}`}>
                      {getStatusIcon(prescription.status)}
                      <span>{prescription.status}</span>
                    </span>
                    {prescription.pbs_listed && (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        PBS Listed
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {prescription.form} • Quantity: {prescription.quantity}
                  </p>
                  <p className="text-sm text-gray-500">
                    Prescribed by {prescription.provider_name} on {new Date(prescription.prescription_date).toLocaleDateString('en-AU')}
                  </p>
                  <p className="text-xs text-gray-500">
                    Prescription #: {prescription.prescription_number}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">
                  ${prescription.cost_to_patient.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">Patient cost</p>
              </div>
            </div>

            {/* Dosage Instructions */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Dosage Instructions</h4>
              <p className="text-gray-700">{prescription.dosage_instructions}</p>
            </div>

            {/* Prescription Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Repeats Remaining</p>
                <p className="text-lg font-semibold text-gray-900">{prescription.repeats_remaining}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Expiry Date</p>
                <p className={`text-lg font-semibold ${
                  isExpiringSoon(prescription.expiry_date) ? 'text-yellow-600' : 'text-gray-900'
                }`}>
                  {new Date(prescription.expiry_date).toLocaleDateString('en-AU')}
                </p>
                {isExpiringSoon(prescription.expiry_date) && (
                  <p className="text-xs text-yellow-600">Expires soon</p>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <p className="text-lg font-semibold text-gray-900 capitalize">{prescription.status}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                {prescription.status === 'active' && prescription.repeats_remaining > 0 && (
                  <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                    Request Repeat
                  </button>
                )}
                <button className="text-gray-600 hover:text-gray-700 text-sm font-medium flex items-center space-x-1">
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
                <button className="text-gray-600 hover:text-gray-700 text-sm font-medium">
                  View Details
                </button>
              </div>
              {prescription.status === 'active' && isExpiringSoon(prescription.expiry_date) && (
                <div className="flex items-center space-x-1 text-yellow-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">Expiring soon</span>
                </div>
              )}
            </div>
          </div>
          ))}

          {filteredPrescriptions.filter(prescription => {
            if (currentView === 'active') return ['active', 'dispensed'].includes(prescription.status);
            if (currentView === 'history') return ['expired', 'cancelled'].includes(prescription.status);
            return true;
          }).length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No prescriptions found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : currentView === 'active' 
                    ? 'You don\'t have any active prescriptions.'
                    : currentView === 'history'
                      ? 'No prescription history available.'
                      : 'You don\'t have any prescriptions yet.'}
              </p>
              <button
                onClick={() => navigate('/medications/request')}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Request Prescription
              </button>
            </div>
          )}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {prescriptions.filter(p => p.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Pill className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Dispensed</p>
              <p className="text-2xl font-bold text-gray-900">
                {prescriptions.filter(p => p.status === 'dispensed').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-gray-900">
                {prescriptions.filter(p => isExpiringSoon(p.expiry_date)).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Pill className="h-5 w-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{prescriptions.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}