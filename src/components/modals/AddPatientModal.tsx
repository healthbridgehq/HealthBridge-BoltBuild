import React, { useState } from 'react';
import { Users, Save, User, Phone, Mail, MapPin } from 'lucide-react';
import { Modal } from '../Modal';
import { FormField } from '../FormField';
import { LoadingButton } from '../LoadingButton';
import { useFormValidation } from '../../hooks/useFormValidation';
import { useModalStore } from '../../stores/modalStore';
import { useAppStore } from '../../stores/appStore';

export function AddPatientModal() {
  const { modals, closeModal } = useModalStore();
  const { addNotification } = useAppStore();
  const [currentStep, setCurrentStep] = useState(1);
  
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
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      email: '',
      mobilePhone: '',
      street: '',
      suburb: '',
      state: '',
      postcode: '',
      medicareNumber: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelationship: ''
    },
    {
      firstName: { required: true, minLength: 2, maxLength: 50 },
      lastName: { required: true, minLength: 2, maxLength: 50 },
      dateOfBirth: { required: true, date: true },
      email: { required: true, email: true },
      mobilePhone: { required: true, phone: true },
      street: { required: true, minLength: 5, maxLength: 100 },
      suburb: { required: true, minLength: 2, maxLength: 50 },
      state: { required: true },
      postcode: { required: true, pattern: /^\d{4}$/ },
      emergencyContactName: { required: true, minLength: 2, maxLength: 50 },
      emergencyContactPhone: { required: true, phone: true },
      emergencyContactRelationship: { required: true }
    }
  );

  const steps = [
    { id: 1, title: 'Personal Details' },
    { id: 2, title: 'Contact Information' },
    { id: 3, title: 'Emergency Contact' }
  ];

  const handleClose = () => {
    reset();
    setCurrentStep(1);
    closeModal('addPatient');
  };

  const handleNext = () => {
    if (isStepValid(currentStep)) {
      setCurrentStep(currentStep + 1);
    } else {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill in all required fields correctly.'
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.firstName && formData.lastName && formData.dateOfBirth && formData.gender;
      case 2:
        return formData.email && formData.mobilePhone && formData.street && 
               formData.suburb && formData.state && formData.postcode;
      case 3:
        return formData.emergencyContactName && formData.emergencyContactPhone && 
               formData.emergencyContactRelationship;
      default:
        return false;
    }
  };

  const onSubmit = async () => {
    await handleSubmit(
      async (data) => {
        console.log('Creating patient:', data);
        await new Promise(resolve => setTimeout(resolve, 2000));
      },
      () => {
        addNotification({
          type: 'success',
          title: 'Patient Created',
          message: 'New patient has been successfully added.'
        });
        handleClose();
      },
      (error) => {
        addNotification({
          type: 'error',
          title: 'Creation Failed',
          message: 'Failed to create patient. Please try again.'
        });
      }
    );
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="First Name"
          name="firstName"
          type="text"
          value={formData.firstName}
          onChange={updateField}
          error={getFieldError('firstName')}
          required
          disabled={isSubmitting}
        />
        
        <FormField
          label="Last Name"
          name="lastName"
          type="text"
          value={formData.lastName}
          onChange={updateField}
          error={getFieldError('lastName')}
          required
          disabled={isSubmitting}
        />
        
        <FormField
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={updateField}
          error={getFieldError('dateOfBirth')}
          required
          max={new Date().toISOString().split('T')[0]}
          disabled={isSubmitting}
        />
        
        <FormField
          label="Gender"
          name="gender"
          type="select"
          value={formData.gender}
          onChange={updateField}
          required
          options={[
            { value: 'Male', label: 'Male' },
            { value: 'Female', label: 'Female' },
            { value: 'Non-binary', label: 'Non-binary' },
            { value: 'Other', label: 'Other' },
            { value: 'Prefer not to say', label: 'Prefer not to say' }
          ]}
          disabled={isSubmitting}
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={updateField}
          error={getFieldError('email')}
          required
          icon={<Mail className="h-4 w-4" />}
          disabled={isSubmitting}
        />
        
        <FormField
          label="Mobile Phone"
          name="mobilePhone"
          type="tel"
          value={formData.mobilePhone}
          onChange={updateField}
          error={getFieldError('mobilePhone')}
          required
          icon={<Phone className="h-4 w-4" />}
          placeholder="0412 345 678"
          disabled={isSubmitting}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <FormField
            label="Street Address"
            name="street"
            type="text"
            value={formData.street}
            onChange={updateField}
            error={getFieldError('street')}
            required
            icon={<MapPin className="h-4 w-4" />}
            disabled={isSubmitting}
          />
        </div>
        
        <FormField
          label="Suburb"
          name="suburb"
          type="text"
          value={formData.suburb}
          onChange={updateField}
          error={getFieldError('suburb')}
          required
          disabled={isSubmitting}
        />
        
        <FormField
          label="State"
          name="state"
          type="select"
          value={formData.state}
          onChange={updateField}
          error={getFieldError('state')}
          required
          options={[
            { value: 'NSW', label: 'NSW' },
            { value: 'VIC', label: 'VIC' },
            { value: 'QLD', label: 'QLD' },
            { value: 'SA', label: 'SA' },
            { value: 'WA', label: 'WA' },
            { value: 'TAS', label: 'TAS' },
            { value: 'NT', label: 'NT' },
            { value: 'ACT', label: 'ACT' }
          ]}
          disabled={isSubmitting}
        />
        
        <FormField
          label="Postcode"
          name="postcode"
          type="text"
          value={formData.postcode}
          onChange={updateField}
          error={getFieldError('postcode')}
          required
          placeholder="3000"
          disabled={isSubmitting}
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Contact Name"
          name="emergencyContactName"
          type="text"
          value={formData.emergencyContactName}
          onChange={updateField}
          error={getFieldError('emergencyContactName')}
          required
          disabled={isSubmitting}
        />
        
        <FormField
          label="Relationship"
          name="emergencyContactRelationship"
          type="select"
          value={formData.emergencyContactRelationship}
          onChange={updateField}
          error={getFieldError('emergencyContactRelationship')}
          required
          options={[
            { value: 'Spouse', label: 'Spouse' },
            { value: 'Partner', label: 'Partner' },
            { value: 'Parent', label: 'Parent' },
            { value: 'Child', label: 'Child' },
            { value: 'Sibling', label: 'Sibling' },
            { value: 'Friend', label: 'Friend' },
            { value: 'Other', label: 'Other' }
          ]}
          disabled={isSubmitting}
        />
        
        <FormField
          label="Phone Number"
          name="emergencyContactPhone"
          type="tel"
          value={formData.emergencyContactPhone}
          onChange={updateField}
          error={getFieldError('emergencyContactPhone')}
          required
          icon={<Phone className="h-4 w-4" />}
          placeholder="0412 345 678"
          disabled={isSubmitting}
        />
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={modals.addPatient}
      onClose={handleClose}
      title={`Add New Patient - Step ${currentStep} of ${steps.length}`}
      size="lg"
      closeOnOverlayClick={!isSubmitting}
    >
      <div className="space-y-6">
        {/* Progress indicator */}
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.id 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.id}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 ${
                    currentStep > step.id ? 'bg-indigo-600' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step content */}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        {/* Navigation buttons */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1 || isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            Previous
          </button>
          
          {currentStep < steps.length ? (
            <button
              onClick={handleNext}
              type="button"
              disabled={!isStepValid(currentStep) || isSubmitting}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          ) : (
            <LoadingButton
              onClick={onSubmit}
              loading={isSubmitting}
              disabled={!isStepValid(currentStep)}
              variant="success"
              icon={<Save className="h-4 w-4" />}
              loadingText="Creating Patient..."
            >
              Create Patient
            </LoadingButton>
          )}
        </div>
      </div>
    </Modal>
  );
}