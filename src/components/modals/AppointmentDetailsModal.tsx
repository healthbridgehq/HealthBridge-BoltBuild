import React from 'react';
import { Calendar, Clock, User, Video, MapPin, Phone, Edit, X as Cancel, CheckCircle } from 'lucide-react';
import { Modal } from '../Modal';
import { LoadingButton } from '../LoadingButton';
import { useModalStore } from '../../stores/modalStore';
import { useAppStore } from '../../stores/appStore';

interface Appointment {
  id: string;
  patient_name: string;
  provider_name: string;
  appointment_type: string;
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes: number;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  appointment_method: 'in_person' | 'telehealth' | 'phone';
  location?: string;
  notes?: string;
  cost: number;
  bulk_billing: boolean;
}

export function AppointmentDetailsModal() {
  const { modals, closeModal, modalData, showConfirmDialog } = useModalStore();
  const { addNotification } = useAppStore();
  
  // Mock appointment data
  const appointment: Appointment = {
    id: modalData.selectedAppointment || '1',
    patient_name: 'Sarah Johnson',
    provider_name: 'Dr. Michael Chen',
    appointment_type: 'Follow-up Consultation',
    scheduled_date: '2025-01-25',
    scheduled_time: '14:30',
    duration_minutes: 30,
    status: 'confirmed',
    appointment_method: 'telehealth',
    notes: 'Blood pressure monitoring follow-up',
    cost: 85,
    bulk_billing: false
  };

  const handleJoinVideo = () => {
    addNotification({
      type: 'info',
      title: 'Joining Video Call',
      message: 'Connecting to your telehealth appointment...'
    });
    closeModal('appointmentDetails');
  };

  const handleReschedule = () => {
    closeModal('appointmentDetails');
    addNotification({
      type: 'info',
      title: 'Reschedule Appointment',
      message: 'Opening reschedule options...'
    });
  };

  const handleCancel = () => {
    showConfirmDialog({
      title: 'Cancel Appointment',
      message: 'Are you sure you want to cancel this appointment? This action cannot be undone.',
      type: 'danger',
      confirmText: 'Yes, Cancel',
      cancelText: 'Keep Appointment',
      onConfirm: () => {
        addNotification({
          type: 'success',
          title: 'Appointment Cancelled',
          message: 'Your appointment has been cancelled successfully.'
        });
        closeModal('appointmentDetails');
      }
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-green-100 text-green-800',
      in_progress: 'bg-purple-100 text-purple-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || colors.scheduled;
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'telehealth': return <Video className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  return (
    <Modal
      isOpen={modals.appointmentDetails}
      onClose={() => closeModal('appointmentDetails')}
      title="Appointment Details"
      size="lg"
    >
      <div className="space-y-6">
        {/* Appointment Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Calendar className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{appointment.appointment_type}</h3>
              <p className="text-sm text-gray-600">with {appointment.provider_name}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(appointment.scheduled_date).toLocaleDateString('en-AU')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{appointment.scheduled_time} ({appointment.duration_minutes} min)</span>
                </div>
                <div className="flex items-center space-x-1">
                  {getMethodIcon(appointment.appointment_method)}
                  <span className="capitalize">{appointment.appointment_method.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          </div>
          
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(appointment.status)}`}>
            {appointment.status.replace('_', ' ')}
          </span>
        </div>

        {/* Appointment Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Patient Information</h4>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-900">{appointment.patient_name}</span>
                </div>
              </div>
            </div>
            
            {appointment.location && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Location</h4>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-900">{appointment.location}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Cost Information</h4>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-lg font-bold text-gray-900">
                  {appointment.cost === 0 ? 'Free' : `$${appointment.cost}`}
                </div>
                <div className="text-sm text-gray-600">
                  {appointment.bulk_billing ? 'Bulk billed' : 'Private billing'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {appointment.notes && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">{appointment.notes}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t border-gray-200">
          <div className="flex space-x-3">
            {appointment.status === 'confirmed' && appointment.appointment_method === 'telehealth' && (
              <LoadingButton
                onClick={handleJoinVideo}
                variant="success"
                icon={<Video className="h-4 w-4" />}
              >
                Join Video Call
              </LoadingButton>
            )}
            
            {['scheduled', 'confirmed'].includes(appointment.status) && (
              <>
                <button
                  onClick={handleReschedule}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  <Edit className="h-4 w-4" />
                  <span>Reschedule</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-4 py-2 border border-red-300 rounded-md text-red-700 hover:bg-red-50"
                >
                  <Cancel className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
              </>
            )}
          </div>
          
          <button
            onClick={() => closeModal('appointmentDetails')}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}