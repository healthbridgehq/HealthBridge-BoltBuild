import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Paperclip, User } from 'lucide-react';
import { Modal } from '../Modal';
import { FormField } from '../FormField';
import { LoadingButton } from '../LoadingButton';
import { useFormValidation } from '../../hooks/useFormValidation';
import { useModalStore } from '../../stores/modalStore';
import { useAppStore } from '../../stores/appStore';

interface Provider {
  id: string;
  name: string;
  specialty: string;
}

export function SendMessageModal() {
  const { modals, closeModal, modalData } = useModalStore();
  const { addNotification } = useAppStore();
  const [providers, setProviders] = useState<Provider[]>([]);
  
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
      providerId: modalData.selectedPatient || '',
      subject: '',
      message: '',
      priority: 'normal',
      attachments: [] as File[]
    },
    {
      providerId: { required: true },
      subject: { required: true, minLength: 3, maxLength: 200 },
      message: { required: true, minLength: 10, maxLength: 2000 }
    }
  );

  useEffect(() => {
    // Mock providers
    setProviders([
      { id: '1', name: 'Dr. Sarah Johnson', specialty: 'General Practice' },
      { id: '2', name: 'Dr. Michael Chen', specialty: 'Cardiology' },
      { id: '3', name: 'Dr. Emily Davis', specialty: 'Dermatology' },
      { id: '4', name: 'Practice Nurse', specialty: 'Nursing' }
    ]);
  }, []);

  const handleClose = () => {
    reset();
    closeModal('sendMessage');
  };

  const onSubmit = async () => {
    await handleSubmit(
      async (data) => {
        console.log('Sending message:', data);
        await new Promise(resolve => setTimeout(resolve, 1500));
      },
      () => {
        addNotification({
          type: 'success',
          title: 'Message Sent',
          message: 'Your message has been sent successfully.'
        });
        handleClose();
      },
      (error) => {
        addNotification({
          type: 'error',
          title: 'Send Failed',
          message: 'Failed to send message. Please try again.'
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
        message: `${newFiles.length} file(s) added to your message.`
      });
    }
  };

  const handleRemoveFile = (index: number) => {
    const newAttachments = formData.attachments.filter((_, i) => i !== index);
    updateField('attachments', newAttachments);
  };

  return (
    <Modal
      isOpen={modals.sendMessage}
      onClose={handleClose}
      title="Send Message"
      size="lg"
      closeOnOverlayClick={!isSubmitting}
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Send To"
            name="providerId"
            type="select"
            value={formData.providerId}
            onChange={updateField}
            error={getFieldError('providerId')}
            required
            options={providers.map(p => ({ value: p.id, label: `${p.name} - ${p.specialty}` }))}
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

        <FormField
          label="Subject"
          name="subject"
          type="text"
          value={formData.subject}
          onChange={updateField}
          error={getFieldError('subject')}
          required
          placeholder="Enter message subject"
          disabled={isSubmitting}
        />

        <FormField
          label="Message"
          name="message"
          type="textarea"
          value={formData.message}
          onChange={updateField}
          error={getFieldError('message')}
          required
          placeholder="Type your message here..."
          rows={6}
          disabled={isSubmitting}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Attachments
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <Paperclip className="h-6 w-6 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">Attach files (optional)</p>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              disabled={isSubmitting}
              className="hidden"
              id="message-file-upload"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
            <label
              htmlFor="message-file-upload"
              className={`bg-gray-100 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-200 cursor-pointer inline-block text-sm ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Choose Files
            </label>
          </div>
          
          {formData.attachments.length > 0 && (
            <div className="mt-3 space-y-2">
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
            disabled={!formData.providerId || !formData.subject || !formData.message}
            icon={<Send className="h-4 w-4" />}
            loadingText="Sending..."
          >
            Send Message
          </LoadingButton>
        </div>
      </form>
    </Modal>
  );
}