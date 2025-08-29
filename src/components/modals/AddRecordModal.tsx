import React from 'react';
import { FileText, Save, Upload, Calendar, User } from 'lucide-react';
import { Modal } from '../Modal';
import { FormField } from '../FormField';
import { LoadingButton } from '../LoadingButton';
import { useFormValidation } from '../../hooks/useFormValidation';
import { useModalStore } from '../../stores/modalStore';
import { useAppStore } from '../../stores/appStore';

export function AddRecordModal() {
  const { modals, closeModal } = useModalStore();
  const { addNotification } = useAppStore();
  
  const {
    data: formData,
    errors,
    updateField,
    handleSubmit,
    isSubmitting,
    getFieldError,
    reset
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
    { value: 'consultation', label: 'Consultation Notes' },
    { value: 'test_result', label: 'Test Result' },
    { value: 'prescription', label: 'Prescription' },
    { value: 'imaging', label: 'Imaging Report' },
    { value: 'vaccination', label: 'Vaccination Record' },
    { value: 'other', label: 'Other' }
  ];

  const handleClose = () => {
    reset();
    closeModal('addRecord');
  };

  const onSubmit = async () => {
    await handleSubmit(
      async (data) => {
        console.log('Creating health record:', data);
        await new Promise(resolve => setTimeout(resolve, 1500));
      },
      () => {
        addNotification({
          type: 'success',
          title: 'Record Created',
          message: 'Your health record has been created successfully.'
        });
        handleClose();
      },
      (error) => {
        addNotification({
          type: 'error',
          title: 'Creation Failed',
          message: 'Failed to create health record. Please try again.'
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
  };

  return (
    <Modal
      isOpen={modals.addRecord}
      onClose={handleClose}
      title="Add Health Record"
      size="lg"
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
        <FormField
          label="Record Type"
          name="recordType"
          type="select"
          value={formData.recordType}
          onChange={updateField}
          error={getFieldError('recordType')}
          required
          options={recordTypes}
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
              id="file-upload-modal"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
            <label
              htmlFor="file-upload-modal"
              className={`bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 cursor-pointer inline-block ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Choose Files
            </label>
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
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleClose}
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
    </Modal>
  );
}