import React from 'react';
import { FileText, Download, Share2, Edit, Calendar, User, Lock, Globe } from 'lucide-react';
import { Modal } from '../Modal';
import { useModalStore } from '../../stores/modalStore';
import { useAppStore } from '../../stores/appStore';

interface HealthRecord {
  id: string;
  title: string;
  record_type: string;
  created_at: string;
  provider_name?: string;
  is_shared: boolean;
  content: string;
  attachments?: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
  }>;
}

export function RecordDetailsModal() {
  const { modals, closeModal, modalData } = useModalStore();
  const { addNotification } = useAppStore();
  
  // Mock record data - in production this would come from props or API
  const record: HealthRecord = {
    id: modalData.selectedRecord || '1',
    title: 'Annual Health Check',
    record_type: 'consultation',
    created_at: '2025-01-15T10:30:00Z',
    provider_name: 'Dr. Sarah Johnson',
    is_shared: false,
    content: 'Patient presented for annual health check. Blood pressure normal at 120/80. Weight stable. Discussed lifestyle factors and preventive care. Recommended annual blood work and mammogram screening.',
    attachments: [
      { id: '1', name: 'blood_pressure_chart.pdf', size: 245760, type: 'application/pdf' },
      { id: '2', name: 'health_summary.pdf', size: 156432, type: 'application/pdf' }
    ]
  };

  const handleDownload = () => {
    addNotification({
      type: 'success',
      title: 'Download Started',
      message: 'Your health record is being prepared for download.'
    });
    closeModal('recordDetails');
  };

  const handleShare = () => {
    closeModal('recordDetails');
    // Open share modal with this record pre-selected
    addNotification({
      type: 'info',
      title: 'Share Record',
      message: 'Opening record sharing options.'
    });
  };

  const handleEdit = () => {
    closeModal('recordDetails');
    addNotification({
      type: 'info',
      title: 'Edit Record',
      message: 'Opening record for editing.'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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

  return (
    <Modal
      isOpen={modals.recordDetails}
      onClose={() => closeModal('recordDetails')}
      title="Health Record Details"
      size="lg"
    >
      <div className="space-y-6">
        {/* Record Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <FileText className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{record.title}</h3>
              <p className="text-sm text-gray-600">{getRecordTypeLabel(record.record_type)}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
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
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {record.is_shared ? (
              <div className="flex items-center space-x-1 text-green-600">
                <Globe className="h-4 w-4" />
                <span className="text-sm">Shared</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 text-gray-500">
                <Lock className="h-4 w-4" />
                <span className="text-sm">Private</span>
              </div>
            )}
          </div>
        </div>

        {/* Record Content */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Record Content</h4>
          <p className="text-gray-700 whitespace-pre-wrap">{record.content}</p>
        </div>

        {/* Attachments */}
        {record.attachments && record.attachments.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Attachments ({record.attachments.length})</h4>
            <div className="space-y-2">
              {record.attachments.map((attachment) => (
                <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{attachment.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      addNotification({
                        type: 'success',
                        title: 'Download Started',
                        message: `Downloading ${attachment.name}...`
                      });
                    }}
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t border-gray-200">
          <div className="flex space-x-3">
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>
            <button
              onClick={handleEdit}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </button>
          </div>
          
          <button
            onClick={() => closeModal('recordDetails')}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}