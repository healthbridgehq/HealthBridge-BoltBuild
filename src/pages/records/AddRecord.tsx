import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Save, X, Upload, Calendar, User, Stethoscope } from 'lucide-react';
import { useFormValidation } from '../../hooks/useFormValidation';
import { FormField } from '../../components/FormField';
import { LoadingButton } from '../../components/LoadingButton';
import { useAppStore } from '../../stores/appStore';

export function AddRecord() {
  const navigate = useNavigate();
  const { addNotification } = useAppStore();
  
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
      recordType: '',
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      provider: '',
      attachments: [] as File[]
    },
    {
      recordType: { required: true },
      title: { required: true, minLength: 3, maxLength: 100 },
      description: { required: true, minLength: 10, maxLength: 1000 },
      date: { required: true, date: true },
      provider: { minLength: 2, maxLength: 100 }
    }
  );

  const recordTypes = [
    { value: 'consultation', label: 'Consultation Notes', icon: <Stethoscope className="h-4 w-4" /> },
    { value: 'test_result', label: 'Test Result', icon: <FileText className="h-4 w-4" /> },
    { value: 'prescription', label: 'Prescription', icon: <FileText className="h-4 w-4" /> },
    { value: 'imaging', label: 'Imaging Report', icon: <FileText className="h-4 w-4" /> },
    { value: 'vaccination', label: 'Vaccination Record', icon: <FileText className="h-4 w-4" /> },
    { value: 'other', label: 'Other', icon: <FileText className="h-4 w-4" /> }
  ];

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await handleSubmit(
      async (data) => {
        // In production, this would save to Supabase
        console.log('Saving record:', data);
        await new Promise(resolve => setTimeout(resolve, 1500));
      },
      () => {
        addNotification({
          type: 'success',
          title: 'Record Saved',
          message: 'Your health record has been saved successfully.'
        });
        navigate('/records');
      },
      (error) => {
        addNotification({
          type: 'error',
          title: 'Save Failed',
          message: 'Failed to save health record. Please try again.'
        });
      }
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      updateField('attachments', [...formData.attachments, ...newFiles]);
      
      addNotification({
        type: 'success',
        title: 'Files Added',
        message: `${newFiles.length} file(s) added to your record.`
      });
    }
  };

  const handleRemoveFile = (index: number) => {
    const newAttachments = formData.attachments.filter((_, i) => i !== index);
    updateField('attachments', newAttachments);
    
    addNotification({
      type: 'info',
      title: 'File Removed',
      message: 'File has been removed from your record.'
    });
  };

  const handleRecordTypeSelect = (type: string) => {
    updateField('recordType', type);
    
    addNotification({
      type: 'info',
      title: 'Record Type Selected',
      message: `Selected ${recordTypes.find(t => t.value === type)?.label} record type.`
    });
  };
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Add Health Record</h1>
          </div>
          <button
            className={`flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => !isSubmitting && navigate('/records')}
          >
            <X className="h-4 w-4" />
            <span>Cancel</span>
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Record Type *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {recordTypes.map((type) => (
                <div
                  key={type.value}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.recordType === type.value
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => !isSubmitting && handleRecordTypeSelect(type.value)}
                >
                  <div className="flex items-center space-x-2">
                    {type.icon}
                    <span className="text-sm font-medium">{type.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <FormField
            label="Title"
            name="title"
            type="text"
            value={formData.title}
            onChange={updateField}
            error={getFieldError('title')}
            required
            placeholder="Enter a title for this record"
            disabled={isSubmitting}
          />

          <FormField
            label="Description"
            name="description"
            type="textarea"
            value={formData.description}
            onChange={updateField}
            error={getFieldError('description')}
            required
            placeholder="Describe the health record details..."
            rows={4}
            disabled={isSubmitting}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={updateField}
              error={getFieldError('date')}
              required
              icon={<Calendar className="h-4 w-4" />}
              max={new Date().toISOString().split('T')[0]}
              disabled={isSubmitting}
            />

            <FormField
              label="Healthcare Provider"
              name="provider"
              type="text"
              value={formData.provider}
              onChange={updateField}
              error={getFieldError('provider')}
              placeholder="Enter provider name"
              icon={<User className="h-4 w-4" />}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachments
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">Upload files or drag and drop</p>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                disabled={isSubmitting}
                className="hidden"
                id="file-upload"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              <label
                htmlFor="file-upload"
                className={`bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 cursor-pointer inline-block ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Choose Files
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB each)
              </p>
            </div>
            
            {formData.attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                {formData.attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      disabled={isSubmitting}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/records')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <LoadingButton
              type="submit"
              loading={isSubmitting}
              disabled={!formData.recordType || !formData.title || !formData.description}
              icon={<Save className="h-4 w-4" />}
              loadingText="Saving..."
            >
              Save Record
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
}