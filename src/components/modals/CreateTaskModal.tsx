import React, { useState, useEffect } from 'react';
import { CheckSquare, Save, User, Calendar, Flag } from 'lucide-react';
import { Modal } from '../Modal';
import { FormField } from '../FormField';
import { LoadingButton } from '../LoadingButton';
import { useFormValidation } from '../../hooks/useFormValidation';
import { useModalStore } from '../../stores/modalStore';
import { useAppStore } from '../../stores/appStore';

interface Patient {
  id: string;
  name: string;
}

export function CreateTaskModal() {
  const { modals, closeModal } = useModalStore();
  const { addNotification } = useAppStore();
  const [patients, setPatients] = useState<Patient[]>([]);
  
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
      title: '',
      description: '',
      type: 'follow_up',
      priority: 'medium',
      patientId: '',
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '',
      estimatedDuration: 30,
      notes: ''
    },
    {
      title: { required: true, minLength: 3, maxLength: 200 },
      description: { required: true, minLength: 10, maxLength: 1000 },
      type: { required: true },
      priority: { required: true },
      dueDate: { required: true },
      estimatedDuration: { required: true, min: 5, max: 480 }
    }
  );

  useEffect(() => {
    // Mock patients
    setPatients([
      { id: '1', name: 'Sarah Johnson' },
      { id: '2', name: 'Michael Chen' },
      { id: '3', name: 'Emma Wilson' },
      { id: '4', name: 'Robert Davis' }
    ]);
  }, []);

  const taskTypes = [
    { value: 'follow_up', label: 'Follow-up' },
    { value: 'review', label: 'Review' },
    { value: 'prescription', label: 'Prescription' },
    { value: 'referral', label: 'Referral' },
    { value: 'call', label: 'Call' },
    { value: 'admin', label: 'Administrative' },
    { value: 'reminder', label: 'Reminder' }
  ];

  const priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const handleClose = () => {
    reset();
    closeModal('createTask');
  };

  const onSubmit = async () => {
    await handleSubmit(
      async (data) => {
        console.log('Creating task:', data);
        await new Promise(resolve => setTimeout(resolve, 1500));
      },
      () => {
        addNotification({
          type: 'success',
          title: 'Task Created',
          message: 'Task has been created successfully.'
        });
        handleClose();
      },
      (error) => {
        addNotification({
          type: 'error',
          title: 'Creation Failed',
          message: 'Failed to create task. Please try again.'
        });
      }
    );
  };

  return (
    <Modal
      isOpen={modals.createTask}
      onClose={handleClose}
      title="Create New Task"
      size="lg"
      closeOnOverlayClick={!isSubmitting}
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
        <FormField
          label="Task Title"
          name="title"
          type="text"
          value={formData.title}
          onChange={updateField}
          error={getFieldError('title')}
          required
          placeholder="Enter task title"
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
          placeholder="Describe the task details..."
          rows={3}
          disabled={isSubmitting}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Task Type"
            name="type"
            type="select"
            value={formData.type}
            onChange={updateField}
            required
            options={taskTypes}
            disabled={isSubmitting}
          />
          
          <FormField
            label="Priority"
            name="priority"
            type="select"
            value={formData.priority}
            onChange={updateField}
            required
            options={priorities}
            disabled={isSubmitting}
          />
        </div>

        <FormField
          label="Patient (Optional)"
          name="patientId"
          type="select"
          value={formData.patientId}
          onChange={updateField}
          options={[
            { value: '', label: 'No specific patient' },
            ...patients.map(p => ({ value: p.id, label: p.name }))
          ]}
          disabled={isSubmitting}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Due Date"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={updateField}
            required
            min={new Date().toISOString().split('T')[0]}
            disabled={isSubmitting}
          />
          
          <FormField
            label="Due Time"
            name="dueTime"
            type="time"
            value={formData.dueTime}
            onChange={updateField}
            disabled={isSubmitting}
          />
          
          <FormField
            label="Estimated Duration (minutes)"
            name="estimatedDuration"
            type="number"
            value={formData.estimatedDuration}
            onChange={updateField}
            error={getFieldError('estimatedDuration')}
            required
            min={5}
            max={480}
            disabled={isSubmitting}
          />
        </div>

        <FormField
          label="Additional Notes"
          name="notes"
          type="textarea"
          value={formData.notes}
          onChange={updateField}
          placeholder="Any additional notes or instructions..."
          rows={2}
          disabled={isSubmitting}
        />

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
            disabled={!formData.title || !formData.description || !formData.dueDate}
            icon={<Save className="h-4 w-4" />}
            loadingText="Creating..."
          >
            Create Task
          </LoadingButton>
        </div>
      </form>
    </Modal>
  );
}