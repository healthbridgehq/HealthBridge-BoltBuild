import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Save, X, User, Phone, Mail, MapPin, Calendar, Heart, AlertTriangle } from 'lucide-react';
import { useFormValidation } from '../../hooks/useFormValidation';
import { FormField } from '../../components/FormField';
import { LoadingButton } from '../../components/LoadingButton';
import { useAppStore } from '../../stores/appStore';

export function AddPatient() {
  const navigate = useNavigate();
  const { addNotification } = useAppStore();
  const [currentStep, setCurrentStep] = useState(1);
  
  const {
    data: formData,
    errors,
    updateField,
    updateNestedField,
    validateAll,
    handleSubmit,
    isSubmitting,
    getFieldError
  } = useFormValidation(
    {
      title: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      aboriginalTorresStrait: false,
      culturalBackground: '',
      preferredLanguage: 'English',
      email: '',
      mobilePhone: '',
      homePhone: '',
      street: '',
      suburb: '',
      state: '',
      postcode: '',
      medicareNumber: '',
      medicarePosition: '',
      privateHealthProvider: '',
      privateHealthNumber: '',
      bloodType: '',
      medicalNotes: '',
      name: '',
      relationship: '',
      emergencyPhone: '',
      emergencyEmail: ''
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
      medicareNumber: { medicare: true },
      name: { required: true, minLength: 2, maxLength: 50 },
      relationship: { required: true },
      emergencyPhone: { required: true, phone: true }
    }
  );

  const steps = [
    { id: 1, title: 'Personal Details', icon: <User className="h-4 w-4" /> },
    { id: 2, title: 'Contact Information', icon: <Phone className="h-4 w-4" /> },
    { id: 3, title: 'Healthcare Cards', icon: <Heart className="h-4 w-4" /> },
    { id: 4, title: 'Medical Information', icon: <AlertTriangle className="h-4 w-4" /> },
    { id: 5, title: 'Emergency Contact', icon: <Users className="h-4 w-4" /> }
  ];


  const handleNext = () => {
    // Validate current step before proceeding
    const stepValid = isStepValid(currentStep);
    if (!stepValid) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill in all required fields correctly before continuing.'
      });
      return;
    }
    
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      addNotification({
        type: 'info',
        title: 'Step Progress',
        message: `Proceeding to step ${currentStep + 1} of ${steps.length}.`
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async () => {
    await handleSubmit(
      async (data) => {
        // In production, this would save to Supabase
        console.log('Creating patient:', data);
        await new Promise(resolve => setTimeout(resolve, 2000));
      },
      () => {
        addNotification({
          type: 'success',
          title: 'Patient Created',
          message: 'New patient has been successfully added to the system.'
        });
        navigate('/patients');
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

  const renderPersonalStep = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Title"
          name="title"
          type="select"
          value={formData.title}
          onChange={updateField}
          options={[
            { value: 'Mr', label: 'Mr' },
            { value: 'Ms', label: 'Ms' },
            { value: 'Mrs', label: 'Mrs' },
            { value: 'Dr', label: 'Dr' }
          ]}
          disabled={isSubmitting}
        />
        
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
          options={[
            { value: 'Male', label: 'Male' },
            { value: 'Female', label: 'Female' },
            { value: 'Non-binary', label: 'Non-binary' },
            { value: 'Other', label: 'Other' },
            { value: 'Prefer not to say', label: 'Prefer not to say' }
          ]}
          disabled={isSubmitting}
        />
        
        <FormField
          label="Preferred Language"
          name="preferredLanguage"
          type="select"
          value={formData.preferredLanguage}
          onChange={updateField}
          options={[
            { value: 'English', label: 'English' },
            { value: 'Mandarin', label: 'Mandarin' },
            { value: 'Arabic', label: 'Arabic' },
            { value: 'Vietnamese', label: 'Vietnamese' },
            { value: 'Italian', label: 'Italian' },
            { value: 'Greek', label: 'Greek' },
            { value: 'Other', label: 'Other' }
          ]}
          disabled={isSubmitting}
        />
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="aboriginal"
          checked={formData.aboriginalTorresStrait}
          onChange={(e) => updateField('aboriginalTorresStrait', e.target.checked)}
          disabled={isSubmitting}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="aboriginal" className="ml-2 text-sm text-gray-900">
          Aboriginal and/or Torres Strait Islander
        </label>
      </div>
    </div>
  );

  const renderContactStep = () => (
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
        
        <FormField
          label="Home Phone"
          name="homePhone"
          type="tel"
          value={formData.homePhone}
          onChange={updateField}
          icon={<Phone className="h-4 w-4" />}
          placeholder="03 9123 4567"
          disabled={isSubmitting}
        />
      </div>
      
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">Address</h4>
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
          
          <div>
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
          </div>
          
          <div>
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
          </div>
          
          <div>
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
      </div>
    </div>
  );

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.firstName && formData.lastName && formData.dateOfBirth;
      case 2:
        return formData.email && formData.mobilePhone && 
               formData.street && formData.suburb &&
               formData.state && formData.postcode;
      case 3:
        return true; // Healthcare cards are optional
      case 4:
        return true; // Medical information is optional
      case 5:
        return formData.name && formData.relationship && formData.emergencyPhone;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Users className="h-6 w-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Add New Patient</h1>
          </div>
          <button
            onClick={() => navigate('/patients')}
            className="text-gray-600 hover:text-gray-800 flex items-center space-x-1"
          >
            <X className="h-4 w-4" />
            <span>Cancel</span>
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className={`flex items-center space-x-2 ${
                  currentStep >= step.id ? 'text-indigo-600' : 'text-gray-400'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step.id 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step.id}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{step.title}</span>
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

        {/* Step Content */}
        <div className="min-h-[400px]">
          {currentStep === 1 && renderPersonalStep()}
          {currentStep === 2 && renderContactStep()}
          {currentStep === 3 && (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Healthcare Cards</h3>
              <p className="text-gray-500">Healthcare card information can be added later in the patient profile.</p>
            </div>
          )}
          {currentStep === 4 && (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Medical Information</h3>
              <p className="text-gray-500">Medical history, allergies, and conditions can be added during the first consultation.</p>
            </div>
          )}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Contact Name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={updateField}
                  error={getFieldError('name')}
                  required
                  disabled={isSubmitting}
                />
                
                <FormField
                  label="Relationship"
                  name="relationship"
                  type="select"
                  value={formData.relationship}
                  onChange={updateField}
                  error={getFieldError('relationship')}
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
                  name="emergencyPhone"
                  type="tel"
                  value={formData.emergencyPhone}
                  onChange={updateField}
                  error={getFieldError('emergencyPhone')}
                  required
                  icon={<Phone className="h-4 w-4" />}
                  placeholder="0412 345 678"
                  disabled={isSubmitting}
                />
                
                <FormField
                  label="Email"
                  name="emergencyEmail"
                  type="email"
                  value={formData.emergencyEmail}
                  onChange={updateField}
                  icon={<Mail className="h-4 w-4" />}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            Previous
          </button>
          
          {currentStep < steps.length ? (
            <button
              onClick={handleNext}
              type="button"
              disabled={!isStepValid(currentStep)}
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
    </div>
  );
}