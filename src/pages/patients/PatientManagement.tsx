import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  MoreVertical,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Heart,
  Activity,
  Pill,
  Star,
  Edit,
  Eye,
  MessageSquare
} from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  address: string;
  medicare_number: string;
  last_visit: string;
  next_appointment?: string;
  status: 'active' | 'inactive' | 'new';
  risk_level: 'low' | 'medium' | 'high';
  conditions: string[];
  medications: number;
  allergies: string[];
  notes: string;
  photo_url?: string;
}

export function PatientManagement() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock data
  useEffect(() => {
    const mockPatients: Patient[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        age: 34,
        gender: 'Female',
        phone: '0412 345 678',
        email: 'sarah.j@email.com',
        address: '123 Collins St, Melbourne VIC 3000',
        medicare_number: '1234567890',
        last_visit: '2025-01-15',
        next_appointment: '2025-01-20',
        status: 'active',
        risk_level: 'low',
        conditions: ['Hypertension'],
        medications: 2,
        allergies: ['Penicillin'],
        notes: 'Regular patient, good compliance with medication'
      },
      {
        id: '2',
        name: 'Michael Chen',
        age: 45,
        gender: 'Male',
        phone: '0423 456 789',
        email: 'michael.c@email.com',
        address: '456 Swanston St, Melbourne VIC 3000',
        medicare_number: '2345678901',
        last_visit: '2025-01-12',
        next_appointment: '2025-01-25',
        status: 'active',
        risk_level: 'medium',
        conditions: ['Diabetes Type 2', 'High Cholesterol'],
        medications: 4,
        allergies: [],
        notes: 'Needs regular monitoring of blood glucose levels'
      },
      {
        id: '3',
        name: 'Emma Wilson',
        age: 28,
        gender: 'Female',
        phone: '0434 567 890',
        email: 'emma.w@email.com',
        address: '789 Bourke St, Melbourne VIC 3000',
        medicare_number: '3456789012',
        last_visit: '2025-01-10',
        status: 'new',
        risk_level: 'low',
        conditions: ['Asthma'],
        medications: 1,
        allergies: ['Shellfish'],
        notes: 'New patient, first consultation completed'
      },
      {
        id: '4',
        name: 'Robert Davis',
        age: 67,
        gender: 'Male',
        phone: '0445 678 901',
        email: 'robert.d@email.com',
        address: '321 Flinders St, Melbourne VIC 3000',
        medicare_number: '4567890123',
        last_visit: '2025-01-08',
        next_appointment: '2025-01-18',
        status: 'active',
        risk_level: 'high',
        conditions: ['Heart Disease', 'Hypertension', 'Diabetes Type 2'],
        medications: 6,
        allergies: ['Aspirin'],
        notes: 'High-risk patient, requires frequent monitoring'
      },
      {
        id: '5',
        name: 'Lisa Anderson',
        age: 52,
        gender: 'Female',
        phone: '0456 789 012',
        email: 'lisa.a@email.com',
        address: '654 Chapel St, Melbourne VIC 3000',
        medicare_number: '5678901234',
        last_visit: '2025-01-05',
        status: 'active',
        risk_level: 'medium',
        conditions: ['Arthritis', 'Osteoporosis'],
        medications: 3,
        allergies: [],
        notes: 'Responds well to current treatment plan'
      }
    ];

    setPatients(mockPatients);
  }, []);

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.medicare_number.includes(searchTerm);
    
    const matchesStatus = filterStatus === 'all' || patient.status === filterStatus;
    const matchesRisk = filterRisk === 'all' || patient.risk_level === filterRisk;
    
    return matchesSearch && matchesStatus && matchesRisk;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200',
      new: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[status as keyof typeof colors] || colors.active;
  };

  const getRiskColor = (risk: string) => {
    const colors = {
      low: 'text-green-600',
      medium: 'text-yellow-600',
      high: 'text-red-600'
    };
    return colors[risk as keyof typeof colors] || colors.low;
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Clock className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const renderPatientCard = (patient: Patient) => (
    <div key={patient.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{patient.name}</h3>
            <p className="text-sm text-gray-600">{patient.age} years old • {patient.gender}</p>
            <p className="text-xs text-gray-500">Medicare: {patient.medicare_number}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(patient.status)}`}>
            {patient.status}
          </span>
          <div className={`flex items-center space-x-1 ${getRiskColor(patient.risk_level)}`}>
            {getRiskIcon(patient.risk_level)}
            <span className="text-xs font-medium capitalize">{patient.risk_level} risk</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Phone className="h-4 w-4" />
          <span>{patient.phone}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Mail className="h-4 w-4" />
          <span>{patient.email}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{patient.address}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{patient.conditions.length}</div>
          <div className="text-xs text-gray-500">Conditions</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{patient.medications}</div>
          <div className="text-xs text-gray-500">Medications</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{patient.allergies.length}</div>
          <div className="text-xs text-gray-500">Allergies</div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-1">Conditions:</p>
        <div className="flex flex-wrap gap-1">
          {patient.conditions.slice(0, 2).map((condition, index) => (
            <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
              {condition}
            </span>
          ))}
          {patient.conditions.length > 2 && (
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
              +{patient.conditions.length - 2} more
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          Last visit: {new Date(patient.last_visit).toLocaleDateString('en-AU')}
          {patient.next_appointment && (
            <div>Next: {new Date(patient.next_appointment).toLocaleDateString('en-AU')}</div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <Eye className="h-4 w-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <Edit className="h-4 w-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <MessageSquare className="h-4 w-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderPatientRow = (patient: Patient) => (
    <tr key={patient.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{patient.name}</div>
            <div className="text-sm text-gray-500">{patient.age} years • {patient.gender}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{patient.phone}</div>
        <div className="text-sm text-gray-500">{patient.email}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(patient.status)}`}>
          {patient.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className={`flex items-center space-x-1 ${getRiskColor(patient.risk_level)}`}>
          {getRiskIcon(patient.risk_level)}
          <span className="text-sm font-medium capitalize">{patient.risk_level}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {new Date(patient.last_visit).toLocaleDateString('en-AU')}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {patient.next_appointment ? new Date(patient.next_appointment).toLocaleDateString('en-AU') : '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center space-x-2">
          <button className="text-indigo-600 hover:text-indigo-900">
            <Eye className="h-4 w-4" />
          </button>
          <button className="text-indigo-600 hover:text-indigo-900">
            <Edit className="h-4 w-4" />
          </button>
          <button className="text-indigo-600 hover:text-indigo-900">
            <MessageSquare className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Users className="h-6 w-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Patient Management</h1>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Patient</span>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">Total Patients</p>
                <p className="text-2xl font-bold text-blue-900">{patients.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600">Active Patients</p>
                <p className="text-2xl font-bold text-green-900">
                  {patients.filter(p => p.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-600">High Risk</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {patients.filter(p => p.risk_level === 'high').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-600">New Patients</p>
                <p className="text-2xl font-bold text-purple-900">
                  {patients.filter(p => p.status === 'new').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search patients by name, email, or Medicare number..."
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="new">New</option>
            </select>
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
              >
                <div className="grid grid-cols-2 gap-1 w-4 h-4">
                  <div className="bg-gray-400 rounded-sm"></div>
                  <div className="bg-gray-400 rounded-sm"></div>
                  <div className="bg-gray-400 rounded-sm"></div>
                  <div className="bg-gray-400 rounded-sm"></div>
                </div>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
              >
                <div className="space-y-1 w-4 h-4">
                  <div className="bg-gray-400 h-1 rounded"></div>
                  <div className="bg-gray-400 h-1 rounded"></div>
                  <div className="bg-gray-400 h-1 rounded"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Patient List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {viewMode === 'grid' ? (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPatients.map(renderPatientCard)}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Visit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Next Appointment
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.map(renderPatientRow)}
              </tbody>
            </table>
          </div>
        )}

        {filteredPatients.length === 0 && (
          <div className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterStatus !== 'all' || filterRisk !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Add your first patient to get started.'}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Add Patient
            </button>
          </div>
        )}
      </div>
    </div>
  );
}