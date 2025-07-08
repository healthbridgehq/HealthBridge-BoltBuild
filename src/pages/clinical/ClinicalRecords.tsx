import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  User,
  Stethoscope,
  Pill,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Share2,
  Edit,
  Eye,
  Mic,
  Save,
  X
} from 'lucide-react';

interface ClinicalRecord {
  id: string;
  patient_name: string;
  patient_id: string;
  record_type: 'consultation' | 'diagnosis' | 'treatment' | 'test_result' | 'referral' | 'procedure';
  title: string;
  date: string;
  provider: string;
  status: 'draft' | 'completed' | 'reviewed' | 'signed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  chief_complaint?: string;
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
  diagnosis_codes?: string[];
  medications?: string[];
  follow_up?: string;
  attachments?: number;
  is_confidential: boolean;
}

interface Template {
  id: string;
  name: string;
  type: string;
  description: string;
  fields: string[];
}

export function ClinicalRecords() {
  const [records, setRecords] = useState<ClinicalRecord[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Mock data
  useEffect(() => {
    const mockRecords: ClinicalRecord[] = [
      {
        id: '1',
        patient_name: 'Sarah Johnson',
        patient_id: 'P001',
        record_type: 'consultation',
        title: 'Annual Health Check',
        date: '2025-01-15',
        provider: 'Dr. Sarah Mitchell',
        status: 'completed',
        priority: 'normal',
        chief_complaint: 'Annual health check and medication review',
        subjective: 'Patient reports feeling well overall. No new symptoms or concerns. Taking medications as prescribed.',
        objective: 'BP: 120/80, HR: 72, Temp: 36.5°C, Weight: 65kg. Physical examination normal.',
        assessment: 'Generally healthy. Hypertension well controlled on current medication.',
        plan: 'Continue current medications. Follow-up in 6 months. Annual blood work ordered.',
        diagnosis_codes: ['Z00.00', 'I10'],
        medications: ['Amlodipine 5mg daily'],
        follow_up: '6 months',
        attachments: 2,
        is_confidential: false
      },
      {
        id: '2',
        patient_name: 'Michael Chen',
        patient_id: 'P002',
        record_type: 'test_result',
        title: 'Blood Test Results - Diabetes Monitoring',
        date: '2025-01-12',
        provider: 'Dr. Sarah Mitchell',
        status: 'reviewed',
        priority: 'high',
        subjective: 'Patient for routine diabetes monitoring blood work.',
        objective: 'HbA1c: 8.2% (elevated), Fasting glucose: 9.8 mmol/L (elevated)',
        assessment: 'Diabetes Type 2 - poor glycemic control. HbA1c elevated above target.',
        plan: 'Increase metformin dose. Refer to diabetes educator. Follow-up in 4 weeks.',
        diagnosis_codes: ['E11.9'],
        medications: ['Metformin 1000mg BD'],
        follow_up: '4 weeks',
        attachments: 1,
        is_confidential: false
      },
      {
        id: '3',
        patient_name: 'Emma Wilson',
        patient_id: 'P003',
        record_type: 'diagnosis',
        title: 'Asthma Exacerbation',
        date: '2025-01-10',
        provider: 'Dr. Sarah Mitchell',
        status: 'signed',
        priority: 'urgent',
        chief_complaint: 'Shortness of breath and wheezing for 2 days',
        subjective: 'Patient reports increased shortness of breath, wheezing, and cough. Symptoms worse at night.',
        objective: 'Respiratory rate: 24, O2 sat: 94% on room air. Wheeze audible on auscultation.',
        assessment: 'Acute asthma exacerbation',
        plan: 'Prednisolone 25mg daily for 5 days. Increase salbutamol use. Follow-up in 48 hours.',
        diagnosis_codes: ['J45.9'],
        medications: ['Prednisolone 25mg daily', 'Salbutamol inhaler PRN'],
        follow_up: '48 hours',
        attachments: 0,
        is_confidential: false
      },
      {
        id: '4',
        patient_name: 'Robert Davis',
        patient_id: 'P004',
        record_type: 'referral',
        title: 'Cardiology Referral',
        date: '2025-01-08',
        provider: 'Dr. Sarah Mitchell',
        status: 'completed',
        priority: 'high',
        chief_complaint: 'Chest pain and abnormal ECG',
        subjective: 'Patient reports intermittent chest pain over past week. Pain described as pressure-like.',
        objective: 'ECG shows ST depression in leads V4-V6. BP: 150/95, HR: 88',
        assessment: 'Possible coronary artery disease. Requires urgent cardiology assessment.',
        plan: 'Urgent referral to cardiology. Start aspirin 100mg daily. Follow-up after cardiology review.',
        diagnosis_codes: ['R06.02', 'I25.9'],
        medications: ['Aspirin 100mg daily'],
        follow_up: 'After cardiology review',
        attachments: 3,
        is_confidential: true
      }
    ];

    const mockTemplates: Template[] = [
      {
        id: '1',
        name: 'General Consultation',
        type: 'consultation',
        description: 'Standard consultation template with SOAP format',
        fields: ['Chief Complaint', 'History of Present Illness', 'Physical Examination', 'Assessment', 'Plan']
      },
      {
        id: '2',
        name: 'Annual Health Check',
        type: 'consultation',
        description: 'Comprehensive health assessment template',
        fields: ['Health Review', 'Risk Assessment', 'Screening', 'Preventive Care', 'Follow-up Plan']
      },
      {
        id: '3',
        name: 'Mental Health Assessment',
        type: 'consultation',
        description: 'Mental health consultation template',
        fields: ['Mental State Exam', 'Risk Assessment', 'Treatment Plan', 'Safety Planning']
      },
      {
        id: '4',
        name: 'Procedure Note',
        type: 'procedure',
        description: 'Template for documenting medical procedures',
        fields: ['Indication', 'Procedure Details', 'Complications', 'Post-procedure Care']
      }
    ];

    setRecords(mockRecords);
    setTemplates(mockTemplates);
  }, []);

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.patient_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || record.record_type === filterType;
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800 border-gray-200',
      completed: 'bg-blue-100 text-blue-800 border-blue-200',
      reviewed: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      signed: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'text-gray-600',
      normal: 'text-blue-600',
      high: 'text-yellow-600',
      urgent: 'text-red-600'
    };
    return colors[priority as keyof typeof colors] || colors.normal;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'consultation': return <Stethoscope className="h-4 w-4" />;
      case 'diagnosis': return <Activity className="h-4 w-4" />;
      case 'treatment': return <Pill className="h-4 w-4" />;
      case 'test_result': return <FileText className="h-4 w-4" />;
      case 'referral': return <Share2 className="h-4 w-4" />;
      case 'procedure': return <Activity className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      consultation: 'Consultation',
      diagnosis: 'Diagnosis',
      treatment: 'Treatment',
      test_result: 'Test Result',
      referral: 'Referral',
      procedure: 'Procedure'
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Clinical Records</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowTemplateModal(true)}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 flex items-center space-x-2"
            >
              <FileText className="h-4 w-4" />
              <span>Templates</span>
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>New Record</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">Total Records</p>
                <p className="text-2xl font-bold text-blue-900">{records.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-600">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {records.filter(r => r.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-600">Urgent</p>
                <p className="text-2xl font-bold text-red-900">
                  {records.filter(r => r.priority === 'urgent').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600">Completed Today</p>
                <p className="text-2xl font-bold text-green-900">
                  {records.filter(r => r.date === '2025-01-15').length}
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
              placeholder="Search records by patient name, title, or ID..."
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
              <option value="consultation">Consultation</option>
              <option value="diagnosis">Diagnosis</option>
              <option value="treatment">Treatment</option>
              <option value="test_result">Test Result</option>
              <option value="referral">Referral</option>
              <option value="procedure">Procedure</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="completed">Completed</option>
              <option value="reviewed">Reviewed</option>
              <option value="signed">Signed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Records List */}
      <div className="space-y-4">
        {filteredRecords.map((record) => (
          <div key={record.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  {getTypeIcon(record.record_type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{record.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full bg-gray-100 ${getPriorityColor(record.priority)}`}>
                      {record.priority}
                    </span>
                    {record.is_confidential && (
                      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                        Confidential
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{record.patient_name} ({record.patient_id})</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(record.date).toLocaleDateString('en-AU')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Stethoscope className="h-4 w-4" />
                      <span>{record.provider}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-2">{getTypeLabel(record.record_type)}</p>
                  
                  {record.chief_complaint && (
                    <p className="text-sm text-gray-600 italic">"{record.chief_complaint}"</p>
                  )}
                  
                  {record.assessment && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-1">Assessment:</p>
                      <p className="text-sm text-gray-600">{record.assessment}</p>
                    </div>
                  )}
                  
                  {record.diagnosis_codes && record.diagnosis_codes.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-1">ICD-10 Codes:</p>
                      <div className="flex flex-wrap gap-1">
                        {record.diagnosis_codes.map((code, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                            {code}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {record.attachments && record.attachments > 0 && (
                  <span className="text-xs text-gray-500 flex items-center space-x-1">
                    <FileText className="h-3 w-3" />
                    <span>{record.attachments}</span>
                  </span>
                )}
                
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Download className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                {record.follow_up && (
                  <span>Follow-up: {record.follow_up}</span>
                )}
                {record.medications && record.medications.length > 0 && (
                  <span>{record.medications.length} medication(s)</span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                {record.status === 'draft' && (
                  <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                    Continue Editing
                  </button>
                )}
                {record.status === 'completed' && (
                  <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                    Review & Sign
                  </button>
                )}
                <button className="text-gray-600 hover:text-gray-700 text-sm font-medium">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredRecords.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No clinical records found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Create your first clinical record to get started.'}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Create Record
            </button>
          </div>
        )}
      </div>

      {/* Voice Recording Indicator */}
      {isRecording && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg flex items-center space-x-2">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          <span>Recording...</span>
          <button
            onClick={() => setIsRecording(false)}
            className="ml-2 text-white hover:text-gray-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}