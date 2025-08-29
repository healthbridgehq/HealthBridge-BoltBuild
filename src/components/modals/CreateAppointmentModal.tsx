import React, { useState, useEffect } from 'react';
import { Calendar, Save, User, Clock, Video, MapPin } from 'lucide-react';
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

interface AppointmentType {
  id: string;
  name: string;
  duration_minutes: number;
  description: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

export function CreateAppointmentModal() {
  const { modals, closeModal, modalData } = useModalStore();
  const { addNotification } = useAppStore();
  
  const [providers, setProviders] = useState<Provider[]>([]);
  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>([]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  
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
      patientId: modalData.selectedPatient || '',
      providerId: '',
      appointmentTypeId: '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      method: 'in_person' as 'in_person' | 'telehealth',
      notes: ''
    },
    {
      patientId: { required: true },
      providerId: { required: true },
      appointmentTypeId: { required: true },
      date: { required: true },
      time: { required: true }
    }
  );

  useEffect(() => {
    // Mock data
    setProviders([
      { id: '1', name: 'Dr. Sarah Johnson', specialty: 'General Practice' },
      { id: '2', name: 'Dr. Michael Chen', specialty: 'Cardiology' },
      { id: '3', name: 'Dr. Emily Davis', specialty: 'Dermatology' }
    ]);

    setAppointmentTypes([
      { id: '1', name: 'General Consultation', duration_minutes: 30, description: 'Standard consultation' },
      { id: '2', name: 'Follow-up', duration_minutes: 15, description: 'Follow-up appointment' },
      { id: '3', name: 'Health Check', duration_minutes: 45, description: 'Comprehensive health screening' }
    ]);

    // Generate time slots
    const slots: TimeSlot[] = [];
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push({
          time,
          available: Math.random() > 0.3
        });
      }
    }
    setAvailableSlots(slots);
  }, [formData.date, formData.providerId]);

  const handleClose = () => {
    reset();
    closeModal('createAppointment');
  };

  const onSubmit = async () => {
    await handleSubmit(
      async (data) => {
        console.log('Creating appointment:', data);
        await new Promise(resolve => setTimeout(resolve, 1500));
      },
      () => {
        addNotification({
          type: 'success',
          title: 'Appointment Created',
          message: 'Appointment has been scheduled successfully.'
        });
        handleClose();
      },
      (error) => {
        addNotification({
          type: 'error',
          title: 'Booking Failed',
          message: 'Failed to create appointment. Please try again.'
        });
      }
    );
  };

  return (
    <Modal
      isOpen={modals.createAppointment}
      onClose={handleClose}
      title="Create New Appointment"
      size="lg"
      closeOnOverlayClick={!isSubmitting}
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Provider"
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
            label="Appointment Type"
            name="appointmentTypeId"
            type="select"
            value={formData.appointmentTypeId}
            onChange={updateField}
            error={getFieldError('appointmentTypeId')}
            required
            options={appointmentTypes.map(t => ({ value: t.id, label: `${t.name} (${t.duration_minutes}min)` }))}
            disabled={isSubmitting}
          />
          
          <FormField
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={updateField}
            error={getFieldError('date')}
            required
            min={new Date().toISOString().split('T')[0]}
            disabled={isSubmitting}
          />
        </div>

        {formData.providerId && formData.appointmentTypeId && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Times
            </label>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
              {availableSlots.map((slot) => (
                <button
                  key={slot.time}
                  type="button"
                  disabled={!slot.available || isSubmitting}
                  onClick={() => updateField('time', slot.time)}
                  className={`p-2 text-sm rounded-md border transition-colors ${
                    formData.time === slot.time
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : slot.available
                      ? 'border-gray-200 hover:border-gray-300 text-gray-700'
                      : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Appointment Method
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                formData.method === 'in_person'
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => !isSubmitting && updateField('method', 'in_person')}
            >
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">In-Person</p>
                  <p className="text-sm text-gray-500">Visit the clinic</p>
                </div>
              </div>
            </div>
            <div
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                formData.method === 'telehealth'
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => !isSubmitting && updateField('method', 'telehealth')}
            >
              <div className="flex items-center space-x-3">
                <Video className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Telehealth</p>
                  <p className="text-sm text-gray-500">Video consultation</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <FormField
          label="Notes"
          name="notes"
          type="textarea"
          value={formData.notes}
          onChange={updateField}
          placeholder="Any additional notes or special requirements..."
          rows={3}
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
            disabled={!formData.providerId || !formData.appointmentTypeId || !formData.time}
            icon={<Save className="h-4 w-4" />}
            loadingText="Creating..."
          >
            Create Appointment
          </LoadingButton>
        </div>
      </form>
    </Modal>
  );
}