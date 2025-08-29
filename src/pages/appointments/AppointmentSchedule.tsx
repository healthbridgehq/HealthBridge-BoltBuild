import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../../stores/appStore';
import { useFormValidation } from '../../hooks/useFormValidation';
import { Calendar, Clock, User, Video, MapPin, Plus } from 'lucide-react';

interface Provider {
  id: string;
  name: string;
  specialty: string;
  avatar?: string;
}

interface AppointmentType {
  id: string;
  name: string;
  duration_minutes: number;
  description: string;
  color: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

export function AppointmentSchedule() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addNotification, setLoading } = useAppStore();
  
  // Get pre-selected provider from navigation state
  const preSelectedProvider = location.state?.providerId;
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedProvider, setSelectedProvider] = useState<string>(preSelectedProvider || '');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [appointmentMethod, setAppointmentMethod] = useState<'in_person' | 'telehealth'>('in_person');
  
  const { data: formData, updateField, validateAll, errors } = useFormValidation(
    {
      provider: preSelectedProvider || '',
      appointmentType: '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      method: 'in_person',
      notes: ''
    },
    {
      provider: { required: true },
      appointmentType: { required: true },
      date: { required: true },
      time: { required: true }
    }
  );
  
  const [providers, setProviders] = useState<Provider[]>([]);
  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>([]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);

  // Mock data for preview
  useEffect(() => {
    setProviders([
      { id: '1', name: 'Dr. Sarah Johnson', specialty: 'General Practice' },
      { id: '2', name: 'Dr. Michael Chen', specialty: 'Cardiology' },
      { id: '3', name: 'Dr. Emily Davis', specialty: 'Dermatology' },
      { id: '4', name: 'Dr. James Wilson', specialty: 'Orthopedics' }
    ]);

    setAppointmentTypes([
      { id: '1', name: 'General Consultation', duration_minutes: 30, description: 'Standard consultation', color: '#3B82F6' },
      { id: '2', name: 'Follow-up', duration_minutes: 15, description: 'Follow-up appointment', color: '#10B981' },
      { id: '3', name: 'Health Check', duration_minutes: 45, description: 'Comprehensive health screening', color: '#F59E0B' },
      { id: '4', name: 'Telehealth Consultation', duration_minutes: 30, description: 'Video consultation', color: '#8B5CF6' }
    ]);

    // Generate available time slots
    const slots: TimeSlot[] = [];
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push({
          time,
          available: Math.random() > 0.3 // 70% chance of being available
        });
      }
    }
    setAvailableSlots(slots);
  }, [selectedDate, selectedProvider]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAll()) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill in all required fields correctly.'
      });
      return;
    }

    setLoading('appointments', true);
    try {
      // In a real app, this would create the appointment
      console.log('Creating appointment:', {
        provider: formData.provider,
        type: formData.appointmentType,
        date: formData.date,
        time: formData.time,
        method: formData.method,
        notes: formData.notes
      });
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      addNotification({
        type: 'success',
        title: 'Appointment Scheduled',
        message: 'Your appointment has been successfully scheduled.'
      });
      
      navigate('/appointments');
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      addNotification({
        type: 'error',
        title: 'Booking Failed',
        message: 'Failed to schedule appointment. Please try again.'
      });
    } finally {
      setLoading('appointments', false);
    }
  };

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId);
    updateField('provider', providerId);
    addNotification({
      type: 'info',
      title: 'Provider Selected',
      message: 'Provider has been selected. Choose appointment type and time.'
    });
  };

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
    updateField('appointmentType', typeId);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    updateField('time', time);
  };

  const handleMethodChange = (method: 'in_person' | 'telehealth') => {
    setAppointmentMethod(method);
    updateField('method', method);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Calendar className="h-6 w-6 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900">Schedule Appointment</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Provider Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Healthcare Provider
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {providers.map((provider) => (
                <div
                  key={provider.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedProvider === provider.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleProviderSelect(provider.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{provider.name}</p>
                      <p className="text-sm text-gray-500">{provider.specialty}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Appointment Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Appointment Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appointmentTypes.map((type) => (
                <div
                  key={type.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedType === type.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleTypeSelect(type.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{type.name}</p>
                      <p className="text-sm text-gray-500">{type.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{type.duration_minutes} min</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Date Selection */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Date
            </label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                updateField('date', e.target.value);
              }}
              min={new Date().toISOString().split('T')[0]}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date}</p>
            )}
          </div>

          {/* Time Selection */}
          {selectedProvider && selectedType && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Times
              </label>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                {availableSlots.map((slot) => (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => handleTimeSelect(slot.time)}
                    className={`p-2 text-sm rounded-md border transition-colors ${
                      selectedTime === slot.time
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
              {errors.time && (
                <p className="mt-1 text-sm text-red-600">{errors.time}</p>
              )}
            </div>
          )}

          {/* Appointment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Appointment Method
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  appointmentMethod === 'in_person'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleMethodChange('in_person')}
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
                  appointmentMethod === 'telehealth'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleMethodChange('telehealth')}
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

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              rows={3}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Any specific concerns or information for your provider..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/appointments')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedProvider || !selectedType || !selectedTime}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Schedule Appointment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}