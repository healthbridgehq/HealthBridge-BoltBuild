import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Save, X, User, Phone, Mail, MapPin, Calendar, Heart, AlertTriangle } from 'lucide-react';

interface PatientFormData {
  personal: {
    title: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    aboriginalTorresStrait: boolean;
    culturalBackground: string;
    preferredLanguage: string;
  };
  contact: {
    email: string;
    mobilePhone: string;
    homePhone: string;
    address: {
      street: string;
      suburb: string;
      state: string;
      postcode: string;
    };
  };
  healthcare: {
    medicareNumber: string;
    medicarePosition: string;
    privateHealthProvider: string;
    privateHealthNumber: string;
  };
  medical: {
    allergies: string[];
    conditions: string[];
    medications: string[];
    bloodType: string;
    notes: string;
  };
  emergency: {
    name: string;
    relationship: string;
    phone: string;
    email: string;
  };
}

export function AddPatient() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PatientFormData>({
    personal: {
      title: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      aboriginalTorresStrait: false,
      culturalBackground: '',
      preferredLanguage: 'English'
    },
    contact: {
      email: '',
      mobilePhone: '',
      homePhone: '',
      address: {
        street: '',
        suburb: '',
        state: '',
        postcode: ''
      }
    },
    healthcare: {
      medicareNumber: '',
      medicarePosition: '',
      privateHealthProvider: '',
      privateHealthNumber: ''
    },
    medical: {
      allergies: [],
      conditions: [],
      medications: [],
      bloodType: '',
      notes: ''
    },
    emergency: {
      name: '',
      relationship: '',
      phone: '',
      email: ''
    }
  });

  const steps = [
    { id: 1, title: 'Personal Details', icon: <User className="h-4 w-4" /> },
    { id: 2, title: 'Contact Information', icon: <Phone className="h-4 w-4" /> },
    { id: 3, title: 'Healthcare Cards', icon: <Heart className="h-4 w-4" /> },
    { id: 4, title: 'Medical Information', icon: <AlertTriangle className="h-4 w-4" /> },
    { id: 5, title: 'Emergency Contact', icon: <Users className="h-4 w-4" /> }
  ];

  const updateFormData = (section: keyof PatientFormData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // In production, this would save to Supabase
      console.log('Creating patient:', formData);
      await new Promise(resolve => setTimeout(resolve, 2000));
      navigate('/patients');
    } catch (error) {
      console.error('Error creating patient:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderPersonalStep = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <select
            value={formData.personal.title}
            onChange={(e) => updateFormData('personal', 'title', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select title</option>
            <option value="Mr">Mr</option>
            <option value="Ms">Ms</option>
            <option value="Mrs">Mrs</option>
            <option value="Dr">Dr</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
          <input
            type="text"
            value={formData.personal.firstName}
            onChange={(e) => updateFormData('personal', 'firstName', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
          <input
            type="text"
            value={formData.personal.lastName}
            onChange={(e) => updateFormData('personal', 'lastName', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
          <input
            type="date"
            value={formData.personal.dateOfBirth}
            onChange={(e) => updateFormData('personal', 'dateOfBirth', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          <select
            value={formData.personal.gender}
            onChange={(e) => updateFormData('personal', 'gender', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Non-binary">Non-binary</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Language</label>
          <select
            value={formData.personal.preferredLanguage}
            onChange={(e) => updateFormData('personal', 'preferredLanguage', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="English">English</option>
            <option value="Mandarin">Mandarin</option>
            <option value="Arabic">Arabic</option>
            <option value="Vietnamese">Vietnamese</option>
            <option value="Italian">Italian</option>
            <option value="Greek">Greek</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="aboriginal"
          checked={formData.personal.aboriginalTorresStrait}
          onChange={(e) => updateFormData('personal', 'aboriginalTorresStrait', e.target.checked)}
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
          <input
            type="email"
            value={formData.contact.email}
            onChange={(e) => updateFormData('contact', 'email', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Phone *</label>
          <input
            type="tel"
            value={formData.contact.mobilePhone}
            onChange={(e) => updateFormData('contact', 'mobilePhone', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Home Phone</label>
          <input
            type="tel"
            value={formData.contact.homePhone}
            onChange={(e) => updateFormData('contact', 'homePhone', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
      
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">Address</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
            <input
              type="text"
              value={formData.contact.address.street}
              onChange={(e) => updateFormData('contact', 'address', {
                ...formData.contact.address,
                street: e.target.value
              })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Suburb *</label>
            <input
              type="text"
              value={formData.contact.address.suburb}
              onChange={(e) => updateFormData('contact', 'address', {
                ...formData.contact.address,
                suburb: e.target.value
              })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
            <select
              value={formData.contact.address.state}
              onChange={(e) => updateFormData('contact', 'address', {
                ...formData.contact.address,
                state: e.target.value
              })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Select state</option>
              <option value="NSW">NSW</option>
              <option value="VIC">VIC</option>
              <option value="QLD">QLD</option>
              <option value="SA">SA</option>
              <option value="WA">WA</option>
              <option value="TAS">TAS</option>
              <option value="NT">NT</option>
              <option value="ACT">ACT</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Postcode *</label>
            <input
              type="text"
              value={formData.contact.address.postcode}
              onChange={(e) => updateFormData('contact', 'address', {
                ...formData.contact.address,
                postcode: e.target.value
              })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.personal.firstName && formData.personal.lastName && formData.personal.dateOfBirth;
      case 2:
        return formData.contact.email && formData.contact.mobilePhone && 
               formData.contact.address.street && formData.contact.address.suburb &&
               formData.contact.address.state && formData.contact.address.postcode;
      case 3:
        return true; // Healthcare cards are optional
      case 4:
        return true; // Medical information is optional
      case 5:
        return formData.emergency.name && formData.emergency.relationship && formData.emergency.phone;
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name *</label>
                  <input
                    type="text"
                    value={formData.emergency.name}
                    onChange={(e) => updateFormData('emergency', 'name', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Relationship *</label>
                  <select
                    value={formData.emergency.relationship}
                    onChange={(e) => updateFormData('emergency', 'relationship', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Select relationship</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Partner">Partner</option>
                    <option value="Parent">Parent</option>
                    <option value="Child">Child</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Friend">Friend</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.emergency.phone}
                    onChange={(e) => updateFormData('emergency', 'phone', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.emergency.email}
                    onChange={(e) => updateFormData('emergency', 'email', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
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
          >
            Previous
          </button>
          
          {currentStep < steps.length ? (
            <button
              onClick={handleNext}
              disabled={!isStepValid(currentStep)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading || !isStepValid(currentStep)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Creating Patient...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Create Patient</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}