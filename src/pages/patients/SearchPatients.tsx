import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Users, User, Phone, Mail, Calendar, MapPin, Heart, AlertTriangle } from 'lucide-react';

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
}

export function SearchPatients() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('name');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    // Mock patient database
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
        allergies: ['Penicillin']
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
        allergies: []
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
        allergies: ['Shellfish']
      }
    ];

    setPatients(mockPatients);
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    let results = patients.filter(patient => {
      switch (searchType) {
        case 'name':
          return patient.name.toLowerCase().includes(searchTerm.toLowerCase());
        case 'phone':
          return patient.phone.includes(searchTerm);
        case 'email':
          return patient.email.toLowerCase().includes(searchTerm.toLowerCase());
        case 'medicare':
          return patient.medicare_number.includes(searchTerm);
        default:
          return patient.name.toLowerCase().includes(searchTerm.toLowerCase());
      }
    });

    // Apply filters
    if (filterStatus !== 'all') {
      results = results.filter(patient => patient.status === filterStatus);
    }
    
    if (filterRisk !== 'all') {
      results = results.filter(patient => patient.risk_level === filterRisk);
    }

    setSearchResults(results);
    setHasSearched(true);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      new: 'bg-blue-100 text-blue-800'
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

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Search className="h-6 w-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Search Patients</h1>
          </div>
          <button
            onClick={() => navigate('/patients')}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Back to Patient Management
          </button>
        </div>

        {/* Search Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search By</label>
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="name">Name</option>
                <option value="phone">Phone</option>
                <option value="email">Email</option>
                <option value="medicare">Medicare Number</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Term</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder={`Search by ${searchType}...`}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">&nbsp;</label>
              <button
                onClick={handleSearch}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
              >
                Search
              </button>
            </div>
          </div>

          <div className="flex space-x-4">
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
          </div>
        </div>
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Search Results ({searchResults.length} found)
          </h2>
          
          {searchResults.length > 0 ? (
            <div className="space-y-4">
              {searchResults.map((patient) => (
                <div key={patient.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-indigo-600" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(patient.status)}`}>
                            {patient.status}
                          </span>
                          <div className={`flex items-center space-x-1 ${getRiskColor(patient.risk_level)}`}>
                            <AlertTriangle className="h-3 w-3" />
                            <span className="text-xs font-medium capitalize">{patient.risk_level} risk</span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{patient.age} years old • {patient.gender}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4" />
                            <span>{patient.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4" />
                            <span>{patient.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>{patient.address}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Heart className="h-4 w-4" />
                            <span>Medicare: {patient.medicare_number}</span>
                          </div>
                        </div>
                        
                        <div className="mt-2 text-xs text-gray-500">
                          Last visit: {new Date(patient.last_visit).toLocaleDateString('en-AU')}
                          {patient.next_appointment && (
                            <span> • Next: {new Date(patient.next_appointment).toLocaleDateString('en-AU')}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => navigate(`/patients/${patient.id}`)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm"
                      >
                        View Profile
                      </button>
                      <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 text-sm">
                        Schedule Appointment
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}