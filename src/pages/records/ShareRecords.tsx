import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Share2, Users, Shield, CheckCircle, X, Search, Filter } from 'lucide-react';

interface HealthRecord {
  id: string;
  title: string;
  type: string;
  date: string;
  provider: string;
  isShared: boolean;
  sharedWith: string[];
}

interface Provider {
  id: string;
  name: string;
  specialty: string;
  clinic: string;
}

export function ShareRecords() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Mock data
    setRecords([
      {
        id: '1',
        title: 'Annual Health Check',
        type: 'consultation',
        date: '2025-01-15',
        provider: 'Dr. Sarah Johnson',
        isShared: false,
        sharedWith: []
      },
      {
        id: '2',
        title: 'Blood Test Results',
        type: 'test_result',
        date: '2025-01-12',
        provider: 'PathLab Australia',
        isShared: true,
        sharedWith: ['Dr. Michael Chen']
      },
      {
        id: '3',
        title: 'Chest X-ray Report',
        type: 'imaging',
        date: '2025-01-08',
        provider: 'Sydney Radiology',
        isShared: false,
        sharedWith: []
      }
    ]);

    setProviders([
      { id: '1', name: 'Dr. Michael Chen', specialty: 'Cardiology', clinic: 'Heart Health Clinic' },
      { id: '2', name: 'Dr. Emily Davis', specialty: 'Dermatology', clinic: 'Skin Cancer Clinic' },
      { id: '3', name: 'Dr. James Wilson', specialty: 'Orthopedics', clinic: 'Bone & Joint Centre' }
    ]);
  }, []);

  const handleShare = async () => {
    if (selectedRecords.length === 0 || selectedProviders.length === 0) {
      alert('Please select records and providers to share with');
      return;
    }

    setLoading(true);
    try {
      // In production, this would update sharing permissions in Supabase
      console.log('Sharing records:', { selectedRecords, selectedProviders });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setRecords(prev => prev.map(record => 
        selectedRecords.includes(record.id)
          ? { 
              ...record, 
              isShared: true, 
              sharedWith: [...new Set([...record.sharedWith, ...selectedProviders.map(id => 
                providers.find(p => p.id === id)?.name || ''
              )])]
            }
          : record
      ));
      
      setSelectedRecords([]);
      setSelectedProviders([]);
      alert('Records shared successfully!');
    } catch (error) {
      console.error('Error sharing records:', error);
      alert('Failed to share records');
    } finally {
      setLoading(false);
    }
  };

  const toggleRecordSelection = (recordId: string) => {
    setSelectedRecords(prev => 
      prev.includes(recordId)
        ? prev.filter(id => id !== recordId)
        : [...prev, recordId]
    );
  };

  const toggleProviderSelection = (providerId: string) => {
    setSelectedProviders(prev => 
      prev.includes(providerId)
        ? prev.filter(id => id !== providerId)
        : [...prev, providerId]
    );
  };

  const filteredProviders = providers.filter(provider =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Share2 className="h-6 w-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Share Health Records</h1>
          </div>
          <button
            onClick={() => navigate('/records')}
            className="text-gray-600 hover:text-gray-800 flex items-center space-x-1"
          >
            <X className="h-4 w-4" />
            <span>Back</span>
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Privacy & Security</h4>
              <p className="text-sm text-blue-700 mt-1">
                You have full control over who can access your health records. Sharing is secure and compliant with Australian privacy laws.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Select Records */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Records to Share</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {records.map((record) => (
                <div
                  key={record.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedRecords.includes(record.id)
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => toggleRecordSelection(record.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{record.title}</h4>
                      <p className="text-sm text-gray-600">{record.type.replace('_', ' ')}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(record.date).toLocaleDateString('en-AU')} • {record.provider}
                      </p>
                      {record.isShared && (
                        <div className="mt-2">
                          <p className="text-xs text-green-600">
                            ✓ Currently shared with: {record.sharedWith.join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                    {selectedRecords.includes(record.id) && (
                      <CheckCircle className="h-5 w-5 text-indigo-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Select Providers */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Share With Providers</h3>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search providers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredProviders.map((provider) => (
                <div
                  key={provider.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedProviders.includes(provider.id)
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => toggleProviderSelection(provider.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{provider.name}</h4>
                      <p className="text-sm text-gray-600">{provider.specialty}</p>
                      <p className="text-sm text-gray-500">{provider.clinic}</p>
                    </div>
                    {selectedProviders.includes(provider.id) && (
                      <CheckCircle className="h-5 w-5 text-indigo-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/records')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleShare}
            disabled={loading || selectedRecords.length === 0 || selectedProviders.length === 0}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                <span>Sharing...</span>
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" />
                <span>Share Records</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}