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

interface UserProfileData {
  personal: {
    title: string;
    firstName: string;
    lastName: string;
    preferredName: string;
    dateOfBirth: string;
    gender: string;
    aboriginalTorresStrait: boolean;
    culturalBackground: string;
    preferredLanguage: string;
    interpreterRequired: boolean;
  };
  contact: {
    email: string;
    mobilePhone: string;
    homePhone: string;
    workPhone: string;
    residentialAddress: {
      street: string;
      suburb: string;
      state: string;
      postcode: string;
    };
    postalAddress: {
      street: string;
      suburb: string;
      state: string;
      postcode: string;
    };
    postalSameAsResidential: boolean;
  };
  healthcare: {
    medicareNumber: string;
    medicareExpiry: string;
    medicarePosition: string;
    dvaHasCard: boolean;
    dvaCardType: string;
    dvaNumber: string;
    privateHealthHasInsurance: boolean;
    privateHealthProvider: string;
    privateHealthNumber: string;
    privateHealthLevel: string;
    pensionCardHasCard: boolean;
    pensionCardType: string;
    pensionCardNumber: string;
  };
  medical: {
    allergies: string[];
    currentMedications: string[];
    medicalConditions: string[];
    bloodType: string;
    organDonor: boolean;
    advanceDirective: boolean;
    advanceDirectiveLocation: string;
    additionalNotes: string;
  };
  emergencyContacts: Array<{
    id: string;
    name: string;
    relationship: string;
    phone: string;
    email: string;
    isPrimary: boolean;
  }>;
  preferences: {
    communication: {
      email: boolean;
      sms: boolean;
      phone: boolean;
      post: boolean;
    };
    notifications: {
      appointments: boolean;
      results: boolean;
      reminders: boolean;
      marketing: boolean;
    };
    privacy: {
      shareWithMHR: boolean;
      shareWithSpecialists: boolean;
      shareWithPharmacy: boolean;
      allowResearch: boolean;
    };
    accessibility: {
      largeText: boolean;
      highContrast: boolean;
      screenReader: boolean;
      audioAlerts: boolean;
    };
  };
}

export function UserProfile() {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [profileData, setProfileData] = useState<UserProfileData>({
    personal: {
      title: 'Ms',
      firstName: 'Sarah',
      lastName: 'Johnson',
      preferredName: 'Sarah',
      dateOfBirth: '1990-05-15',
      gender: 'Female',
      aboriginalTorresStrait: false,
      culturalBackground: 'Australian',
      preferredLanguage: 'English',
      interpreterRequired: false
    },
    contact: {
      email: 'sarah.johnson@email.com',
      mobilePhone: '0412 345 678',
      homePhone: '',
      workPhone: '',
      residentialAddress: {
        street: '123 Collins Street',
        suburb: 'Melbourne',
        state: 'VIC',
        postcode: '3000'
      },
      postalAddress: {
        street: '',
        suburb: '',
        state: '',
        postcode: ''
      },
      postalSameAsResidential: true
    },
    healthcare: {
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
      pensionCardNumber: ''
    },
    medical: {
      allergies: ['Penicillin', 'Shellfish'],
      currentMedications: ['Paracetamol 500mg as needed'],
      medicalConditions: ['Hypertension'],
      bloodType: 'O+',
      organDonor: true,
      advanceDirective: false,
      advanceDirectiveLocation: '',
      additionalNotes: 'No additional medical notes'
    },
    emergencyContacts: [
      {
        id: '1',
        name: 'John Johnson',
        relationship: 'Spouse',
        phone: '0423 456 789',
        email: 'john.johnson@email.com',
        isPrimary: true
      },
      {
        id: '2',
        name: 'Mary Johnson',
        relationship: 'Mother',
        phone: '0434 567 890',
        email: 'mary.johnson@email.com',
        isPrimary: false
      }
    ],
    preferences: {
      communication: {
        email: true,
        sms: true,
        phone: false,
        post: false
      },
      notifications: {
        appointments: true,
        results: true,
        reminders: true,
        marketing: false
      },
      privacy: {
        shareWithMHR: true,
        shareWithSpecialists: true,
        shareWithPharmacy: true,
        allowResearch: false
      },
      accessibility: {
        largeText: false,
        highContrast: false,
        screenReader: false,
        audioAlerts: false
      }
    }
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      // In production, this would save to Supabase
      console.log('Saving profile data:', profileData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data if needed
  };

  const updateProfileData = (section: keyof UserProfileData, field: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const addEmergencyContact = () => {
    const newContact = {
      id: Date.now().toString(),
      name: '',
      relationship: '',
      phone: '',
      email: '',
      isPrimary: false
    };
    setProfileData(prev => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, newContact]
    }));
  };

  const removeEmergencyContact = (id: string) => {
    setProfileData(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter(contact => contact.id !== id)
    }));
  };

  const updateEmergencyContact = (id: string, field: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.map(contact =>
        contact.id === id ? { ...contact, [field]: value } : contact
      )
    }));
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <select
            value={profileData.personal.title}
            onChange={(e) => updateProfileData('personal', 'title', e.target.value)}
            disabled={!isEditing}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
          >
            <option value="Mr">Mr</option>
            <option value="Ms">Ms</option>
            <option value="Mrs">Mrs</option>
            <option value="Dr">Dr</option>
            <option value="Prof">Prof</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
          <input
            type="text"
            value={profileData.personal.firstName}
            onChange={(e) => updateProfileData('personal', 'firstName', e.target.value)}
            disabled={!isEditing}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
          <input
            type="text"
            value={profileData.personal.lastName}
            onChange={(e) => updateProfileData('personal', 'lastName', e.target.value)}
            disabled={!isEditing}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Name</label>
          <input
            type="text"
            value={profileData.personal.preferredName}
            onChange={(e) => updateProfileData('personal', 'preferredName', e.target.value)}
            disabled={!isEditing}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
          <input
            type="date"
            value={profileData.personal.dateOfBirth}
            onChange={(e) => updateProfileData('personal', 'dateOfBirth', e.target.value)}
            disabled={!isEditing}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          <select
            value={profileData.personal.gender}
            onChange={(e) => updateProfileData('personal', 'gender', e.target.value)}
            disabled={!isEditing}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Non-binary">Non-binary</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cultural Background</label>
          <input
            type="text"
            value={profileData.personal.culturalBackground}
            onChange={(e) => updateProfileData('personal', 'culturalBackground', e.target.value)}
            disabled={!isEditing}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Language</label>
          <select
            value={profileData.personal.preferredLanguage}
            onChange={(e) => updateProfileData('personal', 'preferredLanguage', e.target.value)}
            disabled={!isEditing}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
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
      
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="aboriginal"
            checked={profileData.personal.aboriginalTorresStrait}
            onChange={(e) => updateProfileData('personal', 'aboriginalTorresStrait', e.target.checked)}
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
            checked={profileData.personal.interpreterRequired}
            onChange={(e) => updateProfileData('personal', 'interpreterRequired', e.target.checked)}
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
          <input
            type="email"
            value={profileData.contact.email}
            onChange={(e) => updateProfileData('contact', 'email', e.target.value)}
            disabled={!isEditing}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Phone *</label>
          <input
            type="tel"
            value={profileData.contact.mobilePhone}
            onChange={(e) => updateProfileData('contact', 'mobilePhone', e.target.value)}
            disabled={!isEditing}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Home Phone</label>
          <input
            type="tel"
            value={profileData.contact.homePhone}
            onChange={(e) => updateProfileData('contact', 'homePhone', e.target.value)}
            disabled={!isEditing}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Work Phone</label>
          <input
            type="tel"
            value={profileData.contact.workPhone}
            onChange={(e) => updateProfileData('contact', 'workPhone', e.target.value)}
            disabled={!isEditing}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
          />
        </div>
      </div>
      
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">Residential Address</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
            <input
              type="text"
              value={profileData.contact.residentialAddress.street}
              onChange={(e) => updateProfileData('contact', 'residentialAddress', {
                ...profileData.contact.residentialAddress,
                street: e.target.value
              })}
              disabled={!isEditing}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Suburb *</label>
            <input
              type="text"
              value={profileData.contact.residentialAddress.suburb}
              onChange={(e) => updateProfileData('contact', 'residentialAddress', {
                ...profileData.contact.residentialAddress,
                suburb: e.target.value
              })}
              disabled={!isEditing}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
            <select
              value={profileData.contact.residentialAddress.state}
              onChange={(e) => updateProfileData('contact', 'residentialAddress', {
                ...profileData.contact.residentialAddress,
                state: e.target.value
              })}
              disabled={!isEditing}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
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
              value={profileData.contact.residentialAddress.postcode}
              onChange={(e) => updateProfileData('contact', 'residentialAddress', {
                ...profileData.contact.residentialAddress,
                postcode: e.target.value
              })}
              disabled={!isEditing}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
              required
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
                value={profileData.healthcare.medicareNumber}
                onChange={(e) => updateProfileData('healthcare', 'medicareNumber', e.target.value)}
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
              value={profileData.healthcare.medicarePosition}
              onChange={(e) => updateProfileData('healthcare', 'medicarePosition', e.target.value)}
              disabled={!isEditing}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
            <input
              type="date"
              value={profileData.healthcare.medicareExpiry}
              onChange={(e) => updateProfileData('healthcare', 'medicareExpiry', e.target.value)}
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
              checked={profileData.healthcare.privateHealthHasInsurance}
              onChange={(e) => updateProfileData('healthcare', 'privateHealthHasInsurance', e.target.checked)}
              disabled={!isEditing}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-50"
            />
            <label htmlFor="hasPrivateHealth" className="ml-2 text-sm text-gray-900">
              I have private health insurance
            </label>
          </div>
        </div>
        
        {profileData.healthcare.privateHealthHasInsurance && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
              <input
                type="text"
                value={profileData.healthcare.privateHealthProvider}
                onChange={(e) => updateProfileData('healthcare', 'privateHealthProvider', e.target.value)}
                disabled={!isEditing}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Member Number</label>
              <input
                type={showSensitiveData ? 'text' : 'password'}
                value={profileData.healthcare.privateHealthNumber}
                onChange={(e) => updateProfileData('healthcare', 'privateHealthNumber', e.target.value)}
                disabled={!isEditing}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Coverage Level</label>
              <select
                value={profileData.healthcare.privateHealthLevel}
                onChange={(e) => updateProfileData('healthcare', 'privateHealthLevel', e.target.value)}
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Blood Type</label>
          <select
            value={profileData.medical.bloodType}
            onChange={(e) => updateProfileData('medical', 'bloodType', e.target.value)}
            disabled={!isEditing}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
          >
            <option value="">Unknown</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="organDonor"
            checked={profileData.medical.organDonor}
            onChange={(e) => updateProfileData('medical', 'organDonor', e.target.checked)}
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
            checked={profileData.medical.advanceDirective}
            onChange={(e) => updateProfileData('medical', 'advanceDirective', e.target.checked)}
            disabled={!isEditing}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-50"
          />
          <label htmlFor="advanceDirective" className="ml-2 block text-sm text-gray-900">
            Have advance directive
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Additional Medical Notes</label>
        <textarea
          value={profileData.medical.additionalNotes}
          onChange={(e) => updateProfileData('medical', 'additionalNotes', e.target.value)}
          disabled={!isEditing}
          rows={4}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
          placeholder="Any additional medical information you'd like your healthcare providers to know..."
        />
      </div>
    </div>
  );

  const renderEmergencyTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Emergency Contacts</h3>
        {isEditing && (
          <button
            onClick={addEmergencyContact}
            className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 text-sm flex items-center space-x-1"
          >
            <Plus className="h-4 w-4" />
            <span>Add Contact</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {profileData.emergencyContacts.map((contact, index) => (
          <div key={contact.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">Contact {index + 1}</span>
                {contact.isPrimary && (
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Primary
                  </span>
                )}
              </div>
              {isEditing && (
                <button
                  onClick={() => removeEmergencyContact(contact.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  value={contact.name}
                  onChange={(e) => updateEmergencyContact(contact.id, 'name', e.target.value)}
                  disabled={!isEditing}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Relationship *</label>
                <select
                  value={contact.relationship}
                  onChange={(e) => updateEmergencyContact(contact.id, 'relationship', e.target.value)}
                  disabled={!isEditing}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  value={contact.phone}
                  onChange={(e) => updateEmergencyContact(contact.id, 'phone', e.target.value)}
                  disabled={!isEditing}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={contact.email}
                  onChange={(e) => updateEmergencyContact(contact.id, 'email', e.target.value)}
                  disabled={!isEditing}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
                />
              </div>
            </div>
            
            {isEditing && (
              <div className="mt-4 flex items-center">
                <input
                  type="checkbox"
                  id={`primary-${contact.id}`}
                  checked={contact.isPrimary}
                  onChange={(e) => updateEmergencyContact(contact.id, 'isPrimary', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor={`primary-${contact.id}`} className="ml-2 text-sm text-gray-900">
                  Primary emergency contact
                </label>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      {/* Communication Preferences */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Communication Preferences</h4>
        <div className="space-y-3">
          {Object.entries(profileData.preferences.communication).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <label className="text-sm text-gray-700 capitalize">
                {key === 'sms' ? 'SMS' : key}
              </label>
              <button
                onClick={() => updateProfileData('preferences', 'communication', {
                  ...profileData.preferences.communication,
                  [key]: !value
                })}
                disabled={!isEditing}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-indigo-600' : 'bg-gray-200'
                } disabled:opacity-50`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
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
          {Object.entries(profileData.preferences.notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <label className="text-sm text-gray-700 capitalize">
                {key}
              </label>
              <button
                onClick={() => updateProfileData('preferences', 'notifications', {
                  ...profileData.preferences.notifications,
                  [key]: !value
                })}
                disabled={!isEditing}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-indigo-600' : 'bg-gray-200'
                } disabled:opacity-50`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
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
          {Object.entries(profileData.preferences.privacy).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <label className="text-sm text-gray-700">
                {key === 'shareWithMHR' ? 'Share with My Health Record' :
                 key === 'shareWithSpecialists' ? 'Share with Specialists' :
                 key === 'shareWithPharmacy' ? 'Share with Pharmacy' :
                 key === 'allowResearch' ? 'Allow Research Use' : key}
              </label>
              <button
                onClick={() => updateProfileData('preferences', 'privacy', {
                  ...profileData.preferences.privacy,
                  [key]: !value
                })}
                disabled={!isEditing}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-indigo-600' : 'bg-gray-200'
                } disabled:opacity-50`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

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
                  disabled={loading}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  {loading ? (
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>Save Changes</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
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