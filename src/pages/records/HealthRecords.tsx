import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../stores/appStore';
import { useModalStore } from '../../stores/modalStore';
import { FileText, Plus, Share2, Download, Filter, Search, Eye, Lock } from 'lucide-react';
import { AddRecordModal } from '../../components/modals/AddRecordModal';
import { RecordDetailsModal } from '../../components/modals/RecordDetailsModal';
import { ConfirmDialog } from '../../components/ConfirmDialog';

interface HealthRecord {
  id: string;
  record_type: string;
  created_at: string;
  provider_name?: string;
  is_shared: boolean;
  content: string;
}

export function HealthRecords() {
  const navigate = useNavigate();
  const { addNotification, setLoading, toggleItemSelection, selectedItems } = useAppStore();
  const { openModal, closeModal, modals, setModalData, modalData, showConfirmDialog } = useModalStore();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Mock data for preview
  useEffect(() => {
    setRecords([
      {
        id: '1',
        record_type: 'consultation',
        created_at: '2025-01-15T10:30:00Z',
        provider_name: 'Dr. Sarah Johnson',
        is_shared: false,
        content: 'Patient presented with mild headaches. Blood pressure normal. Recommended increased water intake and stress management.'
      },
      {
        id: '2',
        record_type: 'test_result',
        created_at: '2025-01-12T14:15:00Z',
        provider_name: 'PathLab Australia',
        is_shared: true,
        content: 'Blood test results: All values within normal range. Cholesterol: 4.2 mmol/L, Blood glucose: 5.1 mmol/L'
      },
      {
        id: '3',
        record_type: 'prescription',
        created_at: '2025-01-10T09:45:00Z',
        provider_name: 'Dr. Michael Chen',
        is_shared: false,
        content: 'Prescribed Paracetamol 500mg, 2 tablets every 6 hours as needed for pain relief. 5 days supply.'
      },
      {
        id: '4',
        record_type: 'imaging',
        created_at: '2025-01-08T16:20:00Z',
        provider_name: 'Sydney Radiology',
        is_shared: true,
        content: 'Chest X-ray: No abnormalities detected. Lungs clear, heart size normal.'
      }
    ]);
  }, []);

  const handleAddRecord = () => {
    openModal('addRecord');
  };

  const handleViewRecord = (recordId: string) => {
    setModalData('selectedRecord', recordId);
    openModal('recordDetails');
  };

  const handleDownloadRecord = (recordId: string) => {
    // In production, this would generate and download a PDF
    console.log('Downloading record:', recordId);
    addNotification({
      type: 'success',
      title: 'Download Started',
      message: 'Your health record is being prepared for download.'
    });
  };

  const handleShareRecord = (recordId: string) => {
    toggleItemSelection('records', recordId);
    navigate('/records/share');
  };

  const handleDeleteRecord = (recordId: string) => {
    showConfirmDialog({
      title: 'Delete Health Record',
      message: 'Are you sure you want to delete this health record? This action cannot be undone.',
      type: 'danger',
      confirmText: 'Delete Record',
      cancelText: 'Keep Record',
      onConfirm: () => {
        setRecords(prev => prev.filter(r => r.id !== recordId));
        addNotification({
          type: 'success',
          title: 'Record Deleted',
          message: 'Health record has been deleted successfully.'
        });
      }
    });
  };

  const handleShareWithProvider = () => {
    addNotification({
      type: 'info',
      title: 'Share with Provider',
      message: 'Select records to share with your healthcare providers.'
    });
    navigate('/records/share');
  };

  const handleSelectRecord = (recordId: string) => {
    toggleItemSelection('records', recordId);
  };

  const handleBulkShare = () => {
    if (selectedItems.records.length === 0) {
      addNotification({
        type: 'warning',
        title: 'No Records Selected',
        message: 'Please select at least one record to share.'
      });
      return;
    }
    navigate('/records/share');
  };
  const filteredRecords = records.filter(record => {
    const matchesSearch = record.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.record_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (record.provider_name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    
    const matchesFilter = filterType === 'all' || record.record_type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const getRecordTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      consultation: 'Consultation Notes',
      prescription: 'Prescription',
      test_result: 'Test Result',
      imaging: 'Imaging Report',
      vaccination: 'Vaccination Record'
    };
    return labels[type] || type;
  };

  const getRecordTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      consultation: 'bg-blue-100 text-blue-800',
      prescription: 'bg-green-100 text-green-800',
      test_result: 'bg-purple-100 text-purple-800',
      imaging: 'bg-orange-100 text-orange-800',
      vaccination: 'bg-pink-100 text-pink-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Health Records</h1>
          </div>
          <button
            onClick={handleAddRecord}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Record</span>
            {selectedItems.records.length > 0 && (
              <button
                onClick={handleBulkShare}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2"
              >
                <Share2 className="h-4 w-4" />
                <span>Share Selected ({selectedItems.records.length})</span>
              </button>
            )}
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Types</option>
              <option value="consultation">Consultations</option>
              <option value="prescription">Prescriptions</option>
              <option value="test_result">Test Results</option>
              <option value="imaging">Imaging</option>
              <option value="vaccination">Vaccinations</option>
            </select>
          </div>
        </div>
      </div>

      {/* Records List */}
      <div className="space-y-4">
        {filteredRecords.map((record) => (
          <div key={record.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  checked={selectedItems.records.includes(record.id)}
                  onChange={() => handleSelectRecord(record.id)}
                  className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <div className="flex items-start space-x-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <FileText className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {getRecordTypeLabel(record.record_type)}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRecordTypeColor(record.record_type)}`}>
                      {record.record_type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(record.created_at).toLocaleDateString('en-AU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  {record.provider_name && (
                    <p className="text-sm text-gray-600">Provider: {record.provider_name}</p>
                  )}
                </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {record.is_shared ? (
                  <Share2 className="h-5 w-5 text-green-600" title="Shared" />
                ) : (
                  <Lock className="h-5 w-5 text-gray-400" title="Private" />
                )}
                <button 
                  onClick={() => handleViewRecord(record.id)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDownloadRecord(record.id)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleShareRecord(record.id)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <Share2 className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDeleteRecord(record.id)}
                  className="p-2 text-red-400 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-wrap">{record.content}</p>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => handleViewRecord(record.id)}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                  View Details
                </button>
                <button 
                  onClick={handleShareWithProvider}
                  className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                >
                  Share with Provider
                </button>
              </div>
              <div className="text-xs text-gray-500">
                Record ID: {record.id}
              </div>
            </div>
          </div>
        ))}

        {filteredRecords.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No records found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'You don\'t have any health records yet.'}
            </p>
            <button
              onClick={handleAddRecord}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Add Your First Record
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddRecordModal />
      <RecordDetailsModal />
      <ConfirmDialog
        isOpen={modals.confirmDialog}
        onClose={() => closeModal('confirmDialog')}
        onConfirm={modalData.confirmDialog?.onConfirm || (() => {})}
        title={modalData.confirmDialog?.title || ''}
        message={modalData.confirmDialog?.message || ''}
        type={modalData.confirmDialog?.type || 'warning'}
        confirmText={modalData.confirmDialog?.confirmText}
        cancelText={modalData.confirmDialog?.cancelText}
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-gray-900">{records.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Share2 className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Shared Records</p>
              <p className="text-2xl font-bold text-gray-900">
                {records.filter(r => r.is_shared).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {records.filter(r => new Date(r.created_at).getMonth() === new Date().getMonth()).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FileText className="h-5 w-5 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Providers</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(records.map(r => r.provider_name).filter(Boolean)).size}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}