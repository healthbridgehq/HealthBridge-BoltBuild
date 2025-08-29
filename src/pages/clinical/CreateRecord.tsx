import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Save, X, User, Calendar, Stethoscope, Mic, MicOff } from 'lucide-react';
import { useFormValidation } from '../../hooks/useFormValidation';
import { FormField } from '../../components/FormField';
import { LoadingButton } from '../../components/LoadingButton';
import { useAppStore } from '../../stores/appStore';

export function CreateRecord() {
  const navigate = useNavigate();
  const { addNotification } = useAppStore();
  const [isRecording, setIsRecording] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  
  const {
    data: formData,
    errors,
    updateField,
    validateAll,
    handleSubmit,
    isSubmitting,
    getFieldError
  } = useFormValidation(
    {
      patient_id: '',
      patient_name: '',
      record_type: 'consultation',
      title: '',
      chief_complaint: '',
      subjective: '',
      objective: '',
      assessment: '',
      plan: '',
      follow_up: '',
      priority: 'normal',
      is_confidential: false
    },
    {
      patient_name: { required: true, minLength: 2, maxLength: 100 },
      title: { required: true, minLength: 3, maxLength: 200 },
      chief_complaint: { minLength: 5, maxLength: 500 },
      subjective: { minLength: 10, maxLength: 2000 },
      objective: { minLength: 10, maxLength: 2000 },
      assessment: { minLength: 5, maxLength: 1000 },
      plan: { minLength: 5, maxLength: 1000 }
    }
  );

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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await handleSubmit(
      async (data) => {
        // In production, this would save to Supabase
        console.log('Creating clinical record:', data);
        await new Promise(resolve => setTimeout(resolve, 1500));
      },
      () => {
        addNotification({
          type: 'success',
          title: 'Record Created',
          message: 'Clinical record has been created successfully.'
        });
        navigate('/clinical-records');
      },
      (error) => {
        addNotification({
          type: 'error',
          title: 'Creation Failed',
          message: 'Failed to create clinical record. Please try again.'
        });
      }
    );
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    addNotification({
      type: 'info',
      title: 'Template Selected',
      message: `Loading ${templates.find(t => t.id === templateId)?.name} template.`
    });
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    addNotification({
      type: 'info',
      title: isRecording ? 'Recording Stopped' : 'Recording Started',
      message: isRecording ? 'Voice recording has been stopped.' : 'Voice recording has started.'
    });
  };

  const handleSaveDraft = async () => {
    addNotification({
      type: 'info',
      title: 'Draft Saved',
      message: 'Clinical record has been saved as draft.'
    });
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
                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="text-sm font-medium text-gray-900">{template.name}</div>
                <div className="text-xs text-gray-500 capitalize">{template.type}</div>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Patient"
              name="patient_name"
              type="text"
              value={formData.patient_name}
              onChange={updateField}
              error={getFieldError('patient_name')}
              required
              placeholder="Search and select patient..."
              icon={<User className="h-4 w-4" />}
              disabled={isSubmitting}
            />
            
            <FormField
              label="Record Type"
              name="record_type"
              type="select"
              value={formData.record_type}
              onChange={updateField}
              required
              options={recordTypes.map(type => ({ value: type.value, label: type.label }))}
              disabled={isSubmitting}
            />
            
            <FormField
              label="Title"
              name="title"
              type="text"
              value={formData.title}
              onChange={updateField}
              error={getFieldError('title')}
              required
              placeholder="Enter record title"
              disabled={isSubmitting}
            />
            
            <FormField
              label="Priority"
              name="priority"
              type="select"
              value={formData.priority}
              onChange={updateField}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'normal', label: 'Normal' },
                { value: 'high', label: 'High' },
                { value: 'urgent', label: 'Urgent' }
              ]}
              disabled={isSubmitting}
            />
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
                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isSubmitting}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                <span>{isRecording ? 'Stop Recording' : 'Voice Dictation'}</span>
              </button>
            </div>

            <FormField
              label="Chief Complaint"
              name="chief_complaint"
              type="textarea"
              value={formData.chief_complaint}
              onChange={updateField}
              error={getFieldError('chief_complaint')}
              rows={2}
              placeholder="Patient's main concern or reason for visit..."
              disabled={isSubmitting}
            />

            <FormField
              label="Subjective"
              name="subjective"
              type="textarea"
              value={formData.subjective}
              onChange={updateField}
              error={getFieldError('subjective')}
              rows={3}
              placeholder="Patient's description of symptoms, history of present illness..."
              disabled={isSubmitting}
            />

            <FormField
              label="Objective"
              name="objective"
              type="textarea"
              value={formData.objective}
              onChange={updateField}
              error={getFieldError('objective')}
              rows={3}
              placeholder="Physical examination findings, vital signs, test results..."
              disabled={isSubmitting}
            />

            <FormField
              label="Assessment"
              name="assessment"
              type="textarea"
              value={formData.assessment}
              onChange={updateField}
              error={getFieldError('assessment')}
              rows={2}
              placeholder="Clinical impression, diagnosis..."
              disabled={isSubmitting}
            />

            <FormField
              label="Plan"
              name="plan"
              type="textarea"
              value={formData.plan}
              onChange={updateField}
              error={getFieldError('plan')}
              rows={3}
              placeholder="Treatment plan, medications, follow-up instructions..."
              disabled={isSubmitting}
            />
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Follow-up"
              name="follow_up"
              type="text"
              value={formData.follow_up}
              onChange={updateField}
              placeholder="e.g., 2 weeks, 1 month, PRN"
              disabled={isSubmitting}
            />
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="confidential"
                checked={formData.is_confidential}
                onChange={(e) => updateField('is_confidential', e.target.checked)}
                disabled={isSubmitting}
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
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Save as Draft
            </button>
            <LoadingButton
              type="submit"
              loading={isSubmitting}
              disabled={!formData.patient_name || !formData.title}
              icon={<Save className="h-4 w-4" />}
              loadingText="Creating..."
            >
              Create Record
            </LoadingButton>
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