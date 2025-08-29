import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Save, X, User, Calendar, Stethoscope, Mic, MicOff } from 'lucide-react';

interface ClinicalRecordForm {
  patient_id: string;
  patient_name: string;
  record_type: 'consultation' | 'diagnosis' | 'treatment' | 'procedure' | 'referral';
  title: string;
  chief_complaint: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  diagnosis_codes: string[];
  medications: string[];
  follow_up: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  is_confidential: boolean;
}

export function CreateRecord() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ClinicalRecordForm>({
    patient_id: '',
    patient_name: '',
    record_type: 'consultation',
    title: '',
    chief_complaint: '',
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
    diagnosis_codes: [],
    medications: [],
    follow_up: '',
    priority: 'normal',
    is_confidential: false
  });
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const templates = [
    { id: 'general', name: 'General Consultation', type: 'consultation' },
    { id: 'annual', name: 'Annual Health Check', type: 'consultation' },
    { id: 'mental', name: 'Mental Health Assessment', type: 'consultation' },
    { id: 'procedure', name: 'Procedure Note', type: 'procedure' }
  ];

  const recordTypes = [
    { value: 'consultation', label: 'Consultation' },
    { value: 'diagnosis', label: 'Diagnosis' },
    { value: 'treatment', label: 'Treatment' },
    { value: 'procedure', label: 'Procedure' },
    { value: 'referral', label: 'Referral' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In production, this would save to Supabase
      console.log('Creating clinical record:', formData);
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigate('/clinical-records');
    } catch (error) {
      console.error('Error creating record:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    // In production, this would load template content
    console.log('Loading template:', templateId);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In production, this would start/stop voice recording
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Create Clinical Record</h1>
          </div>
          <button
            onClick={() => navigate('/clinical-records')}
            className="text-gray-600 hover:text-gray-800 flex items-center space-x-1"
          >
            <X className="h-4 w-4" />
            <span>Cancel</span>
          </button>
        </div>

        {/* Template Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Use Template (Optional)</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template.id)}
                className={`p-3 border rounded-lg text-left transition-colors ${
                  selectedTemplate === template.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-sm font-medium text-gray-900">{template.name}</div>
                <div className="text-xs text-gray-500 capitalize">{template.type}</div>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Patient *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  value={formData.patient_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, patient_name: e.target.value }))}
                  placeholder="Search and select patient..."
                  className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Record Type *</label>
              <select
                value={formData.record_type}
                onChange={(e) => setFormData(prev => ({ ...prev, record_type: e.target.value as any }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                {recordTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter record title"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* SOAP Notes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">SOAP Notes</h3>
              <button
                type="button"
                onClick={toggleRecording}
                className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm ${
                  isRecording 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                <span>{isRecording ? 'Stop Recording' : 'Voice Dictation'}</span>
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chief Complaint</label>
              <textarea
                value={formData.chief_complaint}
                onChange={(e) => setFormData(prev => ({ ...prev, chief_complaint: e.target.value }))}
                rows={2}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Patient's main concern or reason for visit..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subjective</label>
              <textarea
                value={formData.subjective}
                onChange={(e) => setFormData(prev => ({ ...prev, subjective: e.target.value }))}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Patient's description of symptoms, history of present illness..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Objective</label>
              <textarea
                value={formData.objective}
                onChange={(e) => setFormData(prev => ({ ...prev, objective: e.target.value }))}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Physical examination findings, vital signs, test results..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assessment</label>
              <textarea
                value={formData.assessment}
                onChange={(e) => setFormData(prev => ({ ...prev, assessment: e.target.value }))}
                rows={2}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Clinical impression, diagnosis..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Plan</label>
              <textarea
                value={formData.plan}
                onChange={(e) => setFormData(prev => ({ ...prev, plan: e.target.value }))}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Treatment plan, medications, follow-up instructions..."
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up</label>
              <input
                type="text"
                value={formData.follow_up}
                onChange={(e) => setFormData(prev => ({ ...prev, follow_up: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., 2 weeks, 1 month, PRN"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="confidential"
                checked={formData.is_confidential}
                onChange={(e) => setFormData(prev => ({ ...prev, is_confidential: e.target.checked }))}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="confidential" className="ml-2 text-sm text-gray-900">
                Mark as confidential
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/clinical-records')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              disabled={loading || !formData.patient_name || !formData.title}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Create Record</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Voice Recording Indicator */}
      {isRecording && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg flex items-center space-x-2">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          <span>Recording...</span>
          <button
            onClick={toggleRecording}
            className="ml-2 text-white hover:text-gray-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}