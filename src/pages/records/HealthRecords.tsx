import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../stores/appStore';
import { useModalStore } from '../../stores/modalStore';
import { FileText, Plus, Share2, Download, Filter, Search, Eye, Lock, Trash2, Edit, Calendar, User } from 'lucide-react';
import { AddRecordModal } from '../../components/modals/AddRecordModal';
import { RecordDetailsModal } from '../../components/modals/RecordDetailsModal';
import { ConfirmDialog } from '../../components/ConfirmDialog';

interface HealthRecord {
  id: string;
  title: string;
  record_type: string;
  created_at: string;
  provider_name?: string;
  is_shared: boolean;
  content: string;
  attachments?: number;
  priority?: 'low' | 'normal' | 'high';
}

export function HealthRecords() {
  const navigate = useNavigate();
  const { addNotification, setLoading, toggleItemSelection, selectedItems } = useAppStore();
  const { openModal, closeModal, modals, setModalData, modalData, showConfirmDialog } = useModalStore();
  
  // State management
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterShared, setFilterShared] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');
  const [loading, setLocalLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadHealthRecords();
  }, []);

  const loadHealthRecords = async () => {
    try {
      setLocalLoading(true);
      setError(null);
      
      // Mock data - in production this would come from Supabase
      const mockRecords: HealthRecord[] = [
        {
          id: '1',
          title: 'Annual Health Check',
          record_type: 'consultation',
          created_at: '2025-01-15T10:30:00Z',
          provider_name: 'Dr. Sarah Johnson',
          is_shared: false,
          content: 'Patient presented with mild headaches. Blood pressure normal. Recommended increased water intake and stress management.',
          attachments: 2,
          priority: 'normal'
        },
        {
          id: '2',
          title: 'Blood Test Results',
          record_type: 'test_result',
          created_at: '2025-01-12T14:15:00Z',
          provider_name: 'PathLab Australia',
          is_shared: true,
          content: 'Blood test results: All values within normal range. Cholesterol: 4.2 mmol/L, Blood glucose: 5.1 mmol/L',
          attachments: 1,
          priority: 'normal'
        },
        {
          id: '3',
          title: 'Prescription - Pain Relief',
          record_type: 'prescription',
          created_at: '2025-01-10T09:45:00Z',
          provider_name: 'Dr. Michael Chen',
          is_shared: false,
          content: 'Prescribed Paracetamol 500mg, 2 tablets every 6 hours as needed for pain relief. 5 days supply.',
          priority: 'normal'
        },
        {
          id: '4',
          title: 'Chest X-ray Report',
          record_type: 'imaging',
          created_at: '2025-01-08T16:20:00Z',
          provider_name: 'Sydney Radiology',
          is_shared: true,
          content: 'Chest X-ray: No abnormalities detected. Lungs clear, heart size normal.',
          attachments: 3,
          priority: 'normal'
        }
      ];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setRecords(mockRecords);
    } catch (err) {
      setError('Failed to load health records');
      addNotification({
        type: 'error',
        title: 'Loading Error',
        message: 'Failed to load health records. Please try again.'
      });
    } finally {
      setLocalLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadHealthRecords();
    setRefreshing(false);
    addNotification({
      type: 'success',
      title: 'Records Refreshed',
      message: 'Your health records have been updated.'
    });
  };

  const handleAddRecord = () => {
    openModal('addRecord');
    addNotification({
      type: 'info',
      title: 'Add Record',
      message: 'Opening form to add a new health record.'
    });
  };

  const handleViewRecord = (recordId: string) => {
    setModalData('selectedRecord', recordId);
    openModal('recordDetails');
    addNotification({
      type: 'info',
      title: 'Record Details',
      message: 'Loading detailed record information.'
    });
  };

  const handleDownloadRecord = (recordId: string) => {
    const record = records.find(r => r.id === recordId);
    addNotification({
      type: 'success',
      title: 'Download Started',
      message: `Downloading "${record?.title}" as PDF...`
    });
  };

  const handleShareRecord = (recordId: string) => {
    toggleItemSelection('records', recordId);
    addNotification({
      type: 'info',
      title: 'Share Record',
      message: 'Record selected for sharing. Redirecting to share page.'
    });
    navigate('/records/share');
  };

  const handleEditRecord = (recordId: string) => {
    const record = records.find(r => r.id === recordId);
    addNotification({
      type: 'info',
      title: 'Edit Record',
      message: `Opening "${record?.title}" for editing.`
    });
    navigate(`/records/edit/${recordId}`);
  };

  const handleDeleteRecord = (recordId: string) => {
    const record = records.find(r => r.id === recordId);
    showConfirmDialog({
      title: 'Delete Health Record',
      message: `Are you sure you want to delete "${record?.title}"? This action cannot be undone.`,
      type: 'danger',
      confirmText: 'Delete Record',
      cancelText: 'Keep Record',
      onConfirm: () => {
        setRecords(prev => prev.filter(r => r.id !== recordId));
        addNotification({
          type: 'success',
          title: 'Record Deleted',
          message: `"${record?.title}" has been deleted successfully.`
        });
      }
    });
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
    addNotification({
      type: 'info',
      title: 'Bulk Share',
      message: `Sharing ${selectedItems.records.length} selected records.`
    });
    navigate('/records/share');
  };

  const handleSelectRecord = (recordId: string) => {
    toggleItemSelection('records', recordId);
  };

  const handleBulkDelete = () => {
    if (selectedItems.records.length === 0) {
      addNotification({
        type: 'warning',
        title: 'No Records Selected',
        message: 'Please select at least one record to delete.'
      });
      return;
    }
    
    showConfirmDialog({
      title: 'Delete Selected Records',
      message: `Are you sure you want to delete ${selectedItems.records.length} selected records? This action cannot be undone.`,
      type: 'danger',
      confirmText: 'Delete Records',
      cancelText: 'Cancel',
      onConfirm: () => {
        setRecords(prev => prev.filter(r => !selectedItems.records.includes(r.id)));
        addNotification({
          type: 'success',
          title: 'Records Deleted',
          message: `${selectedItems.records.length} records have been deleted.`
        });
      }
    });
  };
  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    addNotification({
      type: 'info',
      title: 'Sort Updated',
      message: 'Records have been re-sorted.'
    });
  };

  const filteredAndSortedRecords = records
    .filter(record => {
    const matchesSearch = record.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (record.provider_name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    
    const matchesFilter = filterType === 'all' || record.record_type === filterType;
    const matchesShared = filterShared === 'all' || 
                         (filterShared === 'shared' && record.is_shared) ||
                         (filterShared === 'private' && !record.is_shared);
    
    return matchesSearch && matchesFilter && matchesShared;
  })
  .sort((a, b) => {
    switch (sortBy) {
      case 'date_desc':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'date_asc':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'provider':
        return (a.provider_name || '').localeCompare(b.provider_name || '');
      default:
        return 0;
    }
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Health Records</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <Activity className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            {selectedItems.records.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {selectedItems.records.length} selected
                </span>
                <button
                  onClick={handleBulkShare}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center space-x-1"
                >
                  <Share2 className="h-3 w-3" />
                  <span>Share</span>
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 flex items-center space-x-1"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Delete</span>
                </button>
              </div>
            )}
            <button
              onClick={handleAddRecord}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Record</span>
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
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
          <div className="flex space-x-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Types</option>
              <option value="consultation">Consultations</option>
              <option value="prescription">Prescriptions</option>
              <option value="test_result">Test Results</option>
              <option value="imaging">Imaging</option>
              <option value="vaccination">Vaccinations</option>
            </select>
            <select
              value={filterShared}
              onChange={(e) => setFilterShared(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Records</option>
              <option value="shared">Shared</option>
              <option value="private">Private</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="title">By Title</option>
              <option value="provider">By Provider</option>
            </select>
          </div>
        </div>
      </div>

      {/* Records List */}
      <div className="space-y-4">
        {filteredAndSortedRecords.map((record) => (
          <div key={record.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <>
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                <input
                  type="checkbox"
                  checked={selectedItems.records.includes(record.id)}
                  onChange={() => handleSelectRecord(record.id)}
                  className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <FileText className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">{record.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRecordTypeColor(record.record_type)}`}>
                      {getRecordTypeLabel(record.record_type)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(record.created_at).toLocaleDateString('en-AU')}</span>
                    </div>
                  {record.provider_name && (
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{record.provider_name}</span>
                      </div>
                  )}
                    {record.attachments && record.attachments > 0 && (
                      <div className="flex items-center space-x-1">
                        <FileText className="h-4 w-4" />
                        <span>{record.attachments} files</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600">{record.content.substring(0, 150)}...</p>
                </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {record.is_shared ? (
                  <div className="flex items-center space-x-1 text-green-600">
                    <Share2 className="h-4 w-4" />
                    <span className="text-xs">Shared</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-gray-400">
                    <Lock className="h-4 w-4" />
                    <span className="text-xs">Private</span>
                  </div>
                )}
              </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => handleViewRecord(record.id)}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center space-x-1"
                >
                  <Eye className="h-4 w-4" />
                  View Details
                </button>
                <button 
                  onClick={() => handleEditRecord(record.id)}
                  className="text-gray-600 hover:text-gray-700 text-sm font-medium flex items-center space-x-1"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                <button 
                  onClick={() => handleDownloadRecord(record.id)}
                  className="text-gray-600 hover:text-gray-700 text-sm font-medium flex items-center space-x-1"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
                <button 
                  onClick={() => handleShareRecord(record.id)}
                  className="text-gray-600 hover:text-gray-700 text-sm font-medium flex items-center space-x-1"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
                <button 
                  onClick={() => handleDeleteRecord(record.id)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center space-x-1"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
              <div className="text-xs text-gray-500">
                Record ID: {record.id}
              </div>
            </div>
            </>
          </div>
        ))}

        {filteredAndSortedRecords.length === 0 && (
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