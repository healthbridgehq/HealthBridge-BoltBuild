import React, { useState, useEffect } from 'react';
import { 
  User, 
  Edit, 
  Save, 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Shield,
  Bell,
  Globe,
  Heart,
  CreditCard,
  Users,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Camera,
  Upload
} from 'lucide-react';
import { useFormValidation } from '../../hooks/useFormValidation';
import { FormField } from '../../components/FormField';
import { LoadingButton } from '../../components/LoadingButton';
import { useAppStore } from '../../stores/appStore';

export function UserProfile() {
  const { addNotification } = useAppStore();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  
  const {
    data: profileData,
    errors,
    updateField,
    updateNestedField,
    validateAll,
    handleSubmit,
    isSubmitting,
    getFieldError,
    reset
  } = useFormValidation(
    {
      title: 'Ms',
      firstName: 'Sarah',
      lastName: 'Johnson',
      preferredName: 'Sarah',
      dateOfBirth: '1990-05-15',
      gender: 'Female',
      aboriginalTorresStrait: false,
      culturalBackground: 'Australian',
      preferredLanguage: 'English',
      interpreterRequired: false,
      email: 'sarah.johnson@email.com',
      mobilePhone: '0412 345 678',
      homePhone: '',
      workPhone: '',
      residentialStreet: '123 Collins Street',
      residentialSuburb: 'Melbourne',
      residentialState: 'VIC',
      residentialPostcode: '3000',
      postalStreet: '',
      postalSuburb: '',
      postalState: '',
      postalPostcode: '',
      postalSameAsResidential: true,
      medicareNumber: '1234567890',
      medicareExpiry: '2026-12-31',
      medicarePosition: '1',
      dvaHasCard: false,
      dvaCardType: '',
      dvaNumber: '',
      privateHealthHasInsurance: true,
      privateHealthProvider: 'Medibank',
      privateHealthNumber: 'MB123456789',
      privateHealthLevel: 'Hospital & Extras',
      pensionCardHasCard: false,
      pensionCardType: '',
      pensionCardNumber: '',
      allergies: ['Penicillin', 'Shellfish'],
      currentMedications: ['Paracetamol 500mg as needed'],
      medicalConditions: ['Hypertension'],
      bloodType: 'O+',
      organDonor: true,
      advanceDirective: false,
      advanceDirectiveLocation: '',
      additionalNotes: 'No additional medical notes',
      emergencyContact1Name: 'John Johnson',
      emergencyContact1Relationship: 'Spouse',
      emergencyContact1Phone: '0423 456 789',
      emergencyContact1Email: 'john.johnson@email.com',
      emergencyContact1Primary: true,
      emergencyContact2Name: 'Mary Johnson',
      emergencyContact2Relationship: 'Mother',
      emergencyContact2Phone: '0434 567 890',
      emergencyContact2Email: 'mary.johnson@email.com',
      emergencyContact2Primary: false,
      commEmail: true,
      commSms: true,
      commPhone: false,
      commPost: false,
      notifAppointments: true,
      notifResults: true,
      notifReminders: true,
      notifMarketing: false,
      privacyMHR: true,
      privacySpecialists: true,
      privacyPharmacy: true,
      privacyResearch: false,
      accessLargeText: false,
      accessHighContrast: false,
      accessScreenReader: false,
      accessAudioAlerts: false
    },
    {
      firstName: { required: true, minLength: 2, maxLength: 50 },
      lastName: { required: true, minLength: 2, maxLength: 50 },
      dateOfBirth: { required: true, date: true },
      email: { required: true, email: true },
      mobilePhone: { required: true, phone: true },
      residentialStreet: { required: true, minLength: 5, maxLength: 100 },
      residentialSuburb: { required: true, minLength: 2, maxLength: 50 },
      residentialState: { required: true },
      residentialPostcode: { required: true, pattern: /^\d{4}$/ },
      medicareNumber: { medicare: true },
      emergencyContact1Name: { required: true, minLength: 2, maxLength: 50 },
      emergencyContact1Relationship: { required: true },
      emergencyContact1Phone: { required: true, phone: true }
    }
  );

  const onSave = async () => {
    await handleSubmit(
      async (data) => {
        // In production, this would save to Supabase
        console.log('Saving profile data:', data);
        await new Promise(resolve => setTimeout(resolve, 1500));
      },
      () => {
        setIsEditing(false);
        addNotification({
          type: 'success',
          title: 'Profile Updated',
          message: 'Your profile has been updated successfully.'
        });
      },
      (error) => {
        addNotification({
          type: 'error',
          title: 'Update Failed',
          message: 'Failed to update profile. Please try again.'
        });
      }
    );
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
    addNotification({
      type: 'info',
      title: 'Changes Cancelled',
      message: 'Profile changes have been cancelled.'
    });
  };

  const tabs = [
    { id: 'personal', label: 'Personal Details', icon: <User className="h-4 w-4" /> },
    { id: 'contact', label: 'Contact Information', icon: <Phone className="h-4 w-4" /> },
    { id: 'healthcare', label: 'Healthcare Cards', icon: <CreditCard className="h-4 w-4" /> },
    { id: 'medical', label: 'Medical Information', icon: <Heart className="h-4 w-4" /> },
    { id: 'emergency', label: 'Emergency Contacts', icon: <Users className="h-4 w-4" /> },
    { id: 'preferences', label: 'Preferences', icon: <Bell className="h-4 w-4" /> }
  ];

  const renderPersonalTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Title"
          name="title"
          type="select"
          value={profileData.title}
          onChange={updateField}
          options={[
            { value: 'Mr', label: 'Mr' },
            { value: 'Ms', label: 'Ms' },
            { value: 'Mrs', label: 'Mrs' },
            { value: 'Dr', label: 'Dr' },
            { value: 'Prof', label: 'Prof' }
          ]}
          disabled={!isEditing}
        />
        
        <FormField
          label="First Name"
          name="firstName"
          type="text"
          value={profileData.firstName}
          onChange={updateField}
          error={getFieldError('firstName')}
          required
          disabled={!isEditing}
        />
        
        <FormField
          label="Last Name"
          name="lastName"
          type="text"
          value={profileData.lastName}
          onChange={updateField}
          error={getFieldError('lastName')}
          required
          disabled={!isEditing}
        />
        
        <FormField
          label="Preferred Name"
          name="preferredName"
          type="text"
          value={profileData.preferredName}
          onChange={updateField}
          disabled={!isEditing}
        />
        
        <FormField
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          value={profileData.dateOfBirth}
          onChange={updateField}
          error={getFieldError('dateOfBirth')}
          required
          disabled={!isEditing}
          max={new Date().toISOString().split('T')[0]}
        />
        
        <FormField
          label="Gender"
          name="gender"
          type="select"
          value={profileData.gender}
          onChange={updateField}
          options={[
            { value: 'Male', label: 'Male' },
            { value: 'Female', label: 'Female' },
            { value: 'Non-binary', label: 'Non-binary' },
            { value: 'Other', label: 'Other' },
            { value: 'Prefer not to say', label: 'Prefer not to say' }
          ]}
          disabled={!isEditing}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Cultural Background"
          name="culturalBackground"
          type="text"
          value={profileData.culturalBackground}
          onChange={updateField}
          disabled={!isEditing}
        />
        
        <FormField
          label="Preferred Language"
          name="preferredLanguage"
          type="select"
          value={profileData.preferredLanguage}
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
          disabled={!isEditing}
        />
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="aboriginal"
            checked={profileData.aboriginalTorresStrait}
            onChange={(e) => updateField('aboriginalTorresStrait', e.target.checked)}
            disabled={!isEditing}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-50"
          />
          <label htmlFor="aboriginal" className="ml-2 block text-sm text-gray-900">
            Aboriginal and/or Torres Strait Islander
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="interpreter"
            checked={profileData.interpreterRequired}
            onChange={(e) => updateField('interpreterRequired', e.target.checked)}
            disabled={!isEditing}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-50"
          />
          <label htmlFor="interpreter" className="ml-2 block text-sm text-gray-900">
            Interpreter services required
          </label>
        </div>
      </div>
    </div>
  );

  const renderContactTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Email Address"
          name="email"
          type="email"
          value={profileData.email}
          onChange={updateField}
          error={getFieldError('email')}
          required
          icon={<Mail className="h-4 w-4" />}
          disabled={!isEditing}
        />
        
        <FormField
          label="Mobile Phone"
          name="mobilePhone"
          type="tel"
          value={profileData.mobilePhone}
          onChange={updateField}
          error={getFieldError('mobilePhone')}
          required
          icon={<Phone className="h-4 w-4" />}
          disabled={!isEditing}
        />
        
        <FormField
          label="Home Phone"
          name="homePhone"
          type="tel"
          value={profileData.homePhone}
          onChange={updateField}
          icon={<Phone className="h-4 w-4" />}
          disabled={!isEditing}
        />
        
        <FormField
          label="Work Phone"
          name="workPhone"
          type="tel"
          value={profileData.workPhone}
          onChange={updateField}
          icon={<Phone className="h-4 w-4" />}
          disabled={!isEditing}
        />
      </div>
      
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">Residential Address</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <FormField
              label="Street Address"
              name="residentialStreet"
              type="text"
              value={profileData.residentialStreet}
              onChange={updateField}
              error={getFieldError('residentialStreet')}
              required
              icon={<MapPin className="h-4 w-4" />}
              disabled={!isEditing}
            />
          </div>
          
          <div>
            <FormField
              label="Suburb"
              name="residentialSuburb"
              type="text"
              value={profileData.residentialSuburb}
              onChange={updateField}
              error={getFieldError('residentialSuburb')}
              required
              disabled={!isEditing}
            />
          </div>
          
          <div>
            <FormField
              label="State"
              name="residentialState"
              type="select"
              value={profileData.residentialState}
              onChange={updateField}
              error={getFieldError('residentialState')}
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
              disabled={!isEditing}
            />
          </div>
          
          <div>
            <FormField
              label="Postcode"
              name="residentialPostcode"
              type="text"
              value={profileData.residentialPostcode}
              onChange={updateField}
              error={getFieldError('residentialPostcode')}
              required
              placeholder="3000"
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderHealthcareTab = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Secure Information</h4>
            <p className="text-sm text-blue-700 mt-1">
              Your healthcare card information is encrypted and stored securely according to Australian privacy laws.
            </p>
          </div>
        </div>
      </div>

      {/* Medicare Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
          <CreditCard className="h-5 w-5 text-green-600" />
          <span>Medicare Card</span>
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Medicare Number</label>
            <div className="relative">
              <input
                type={showSensitiveData ? 'text' : 'password'}
                value={profileData.medicareNumber}
                onChange={(e) => updateField('medicareNumber', e.target.value)}
                disabled={!isEditing}
                className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
              />
              <button
                type="button"
                onClick={() => setShowSensitiveData(!showSensitiveData)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showSensitiveData ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
            <input
              type="text"
              value={profileData.medicarePosition}
              onChange={(e) => updateField('medicarePosition', e.target.value)}
              disabled={!isEditing}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
            <input
              type="date"
              value={profileData.medicareExpiry}
              onChange={(e) => updateField('medicareExpiry', e.target.value)}
              disabled={!isEditing}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Private Health Insurance */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
            <CreditCard className="h-5 w-5 text-purple-600" />
            <span>Private Health Insurance</span>
          </h4>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="hasPrivateHealth"
              checked={profileData.privateHealthHasInsurance}
              onChange={(e) => updateField('privateHealthHasInsurance', e.target.checked)}
              disabled={!isEditing}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-50"
            />
            <label htmlFor="hasPrivateHealth" className="ml-2 text-sm text-gray-900">
              I have private health insurance
            </label>
          </div>
        </div>
        
        {profileData.privateHealthHasInsurance && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
              <input
                type="text"
                value={profileData.privateHealthProvider}
                onChange={(e) => updateField('privateHealthProvider', e.target.value)}
                disabled={!isEditing}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Member Number</label>
              <input
                type={showSensitiveData ? 'text' : 'password'}
                value={profileData.privateHealthNumber}
                onChange={(e) => updateField('privateHealthNumber', e.target.value)}
                disabled={!isEditing}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Coverage Level</label>
              <select
                value={profileData.privateHealthLevel}
                onChange={(e) => updateField('privateHealthLevel', e.target.value)}
                disabled={!isEditing}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
              >
                <option value="">Select level</option>
                <option value="Hospital Only">Hospital Only</option>
                <option value="Extras Only">Extras Only</option>
                <option value="Hospital & Extras">Hospital & Extras</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderMedicalTab = () => (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-red-900">Important Medical Information</h4>
            <p className="text-sm text-red-700 mt-1">
              Keep this information up to date for your safety. It will be shared with healthcare providers when necessary.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FormField
            label="Blood Type"
            name="bloodType"
            type="select"
            value={profileData.bloodType}
            onChange={updateField}
            options={[
              { value: '', label: 'Unknown' },
              { value: 'A+', label: 'A+' },
              { value: 'A-', label: 'A-' },
              { value: 'B+', label: 'B+' },
              { value: 'B-', label: 'B-' },
              { value: 'AB+', label: 'AB+' },
              { value: 'AB-', label: 'AB-' },
              { value: 'O+', label: 'O+' },
              { value: 'O-', label: 'O-' }
            ]}
            disabled={!isEditing}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="organDonor"
            checked={profileData.organDonor}
            onChange={(e) => updateField('organDonor', e.target.checked)}
            disabled={!isEditing}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-50"
          />
          <label htmlFor="organDonor" className="ml-2 block text-sm text-gray-900">
            Registered organ donor
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="advanceDirective"
            checked={profileData.advanceDirective}
            onChange={(e) => updateField('advanceDirective', e.target.checked)}
            disabled={!isEditing}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-50"
          />
          <label htmlFor="advanceDirective" className="ml-2 block text-sm text-gray-900">
            Have advance directive
          </label>
        </div>
      </div>

      <div>
        <FormField
          label="Additional Medical Notes"
          name="additionalNotes"
          type="textarea"
          value={profileData.additionalNotes}
          onChange={updateField}
          rows={4}
          placeholder="Any additional medical information you'd like your healthcare providers to know..."
          disabled={!isEditing}
        />
      </div>
    </div>
  );

  const renderEmergencyTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Emergency Contacts</h3>

      {/* Primary Emergency Contact */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-sm font-medium text-gray-900">Primary Contact</span>
          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            Primary
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Name"
            name="emergencyContact1Name"
            type="text"
            value={profileData.emergencyContact1Name}
            onChange={updateField}
            error={getFieldError('emergencyContact1Name')}
            required
            disabled={!isEditing}
          />
          
          <FormField
            label="Relationship"
            name="emergencyContact1Relationship"
            type="select"
            value={profileData.emergencyContact1Relationship}
            onChange={updateField}
            error={getFieldError('emergencyContact1Relationship')}
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
            disabled={!isEditing}
          />
          
          <FormField
            label="Phone"
            name="emergencyContact1Phone"
            type="tel"
            value={profileData.emergencyContact1Phone}
            onChange={updateField}
            error={getFieldError('emergencyContact1Phone')}
            required
            icon={<Phone className="h-4 w-4" />}
            disabled={!isEditing}
          />
          
          <FormField
            label="Email"
            name="emergencyContact1Email"
            type="email"
            value={profileData.emergencyContact1Email}
            onChange={updateField}
            icon={<Mail className="h-4 w-4" />}
            disabled={!isEditing}
          />
        </div>
      </div>

      {/* Secondary Emergency Contact */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-sm font-medium text-gray-900">Secondary Contact</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Name"
            name="emergencyContact2Name"
            type="text"
            value={profileData.emergencyContact2Name}
            onChange={updateField}
            disabled={!isEditing}
          />
          
          <FormField
            label="Relationship"
            name="emergencyContact2Relationship"
            type="select"
            value={profileData.emergencyContact2Relationship}
            onChange={updateField}
            options={[
              { value: 'Spouse', label: 'Spouse' },
              { value: 'Partner', label: 'Partner' },
              { value: 'Parent', label: 'Parent' },
              { value: 'Child', label: 'Child' },
              { value: 'Sibling', label: 'Sibling' },
              { value: 'Friend', label: 'Friend' },
              { value: 'Other', label: 'Other' }
            ]}
            disabled={!isEditing}
          />
          
          <FormField
            label="Phone"
            name="emergencyContact2Phone"
            type="tel"
            value={profileData.emergencyContact2Phone}
            onChange={updateField}
            icon={<Phone className="h-4 w-4" />}
            disabled={!isEditing}
          />
          
          <FormField
            label="Email"
            name="emergencyContact2Email"
            type="email"
            value={profileData.emergencyContact2Email}
            onChange={updateField}
            icon={<Mail className="h-4 w-4" />}
            disabled={!isEditing}
          />
        </div>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      {/* Communication Preferences */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Communication Preferences</h4>
        <div className="space-y-3">
          {[
            { key: 'commEmail', label: 'Email' },
            { key: 'commSms', label: 'SMS' },
            { key: 'commPhone', label: 'Phone' },
            { key: 'commPost', label: 'Post' }
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <label className="text-sm text-gray-700">{label}</label>
              <button
                type="button"
                onClick={() => updateField(key, !profileData[key as keyof typeof profileData])}
                disabled={!isEditing}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  profileData[key as keyof typeof profileData] ? 'bg-indigo-600' : 'bg-gray-200'
                } disabled:opacity-50`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    profileData[key as keyof typeof profileData] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h4>
        <div className="space-y-3">
          {[
            { key: 'notifAppointments', label: 'Appointments' },
            { key: 'notifResults', label: 'Results' },
            { key: 'notifReminders', label: 'Reminders' },
            { key: 'notifMarketing', label: 'Marketing' }
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <label className="text-sm text-gray-700">{label}</label>
              <button
                type="button"
                onClick={() => updateField(key, !profileData[key as keyof typeof profileData])}
                disabled={!isEditing}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  profileData[key as keyof typeof profileData] ? 'bg-indigo-600' : 'bg-gray-200'
                } disabled:opacity-50`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    profileData[key as keyof typeof profileData] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Preferences */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Privacy & Data Sharing</h4>
        <div className="space-y-3">
          {[
            { key: 'privacyMHR', label: 'Share with My Health Record' },
            { key: 'privacySpecialists', label: 'Share with Specialists' },
            { key: 'privacyPharmacy', label: 'Share with Pharmacy' },
            { key: 'privacyResearch', label: 'Allow Research Use' }
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <label className="text-sm text-gray-700">{label}</label>
              <button
                type="button"
                onClick={() => updateField(key, !profileData[key as keyof typeof profileData])}
                disabled={!isEditing}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  profileData[key as keyof typeof profileData] ? 'bg-indigo-600' : 'bg-gray-200'
                } disabled:opacity-50`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    profileData[key as keyof typeof profileData] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const handleStartEditing = () => {
    setIsEditing(true);
    addNotification({
      type: 'info',
      title: 'Edit Mode',
      message: 'You can now edit your profile information.'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <User className="h-6 w-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Profile & Settings</h1>
          </div>
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <LoadingButton
                  onClick={onSave}
                  loading={isSubmitting}
                  icon={<Save className="h-4 w-4" />}
                  loadingText="Saving..."
                >
                  Save Changes
                </LoadingButton>
              </>
            ) : (
              <button
                onClick={handleStartEditing}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {activeTab === 'personal' && renderPersonalTab()}
        {activeTab === 'contact' && renderContactTab()}
        {activeTab === 'healthcare' && renderHealthcareTab()}
        {activeTab === 'medical' && renderMedicalTab()}
        {activeTab === 'emergency' && renderEmergencyTab()}
        {activeTab === 'preferences' && renderPreferencesTab()}
      </div>
    </div>
  );
}