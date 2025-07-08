import React, { useState, useEffect } from 'react';
import { 
  User, 
  Edit, 
  Save, 
  X, 
  Shield, 
  Bell, 
  CreditCard, 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Heart, 
  AlertTriangle, 
  Eye, 
  EyeOff,
  Download,
  Upload,
  Key,
  Settings,
  Lock,
  Globe,
  Smartphone,
  Clock,
  Plus,
  Trash2,
  Check,
  Camera
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

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
    profilePhotoUrl?: string;
  };
  contact: {
    email: string;
    mobilePhone: string;
    homePhone: string;
    workPhone: string;
    address: {
      street: string;
      suburb: string;
      state: string;
      postcode: string;
      country: string;
    };
    postalAddress: {
      same: boolean;
      street: string;
      suburb: string;
      state: string;
      postcode: string;
      country: string;
    };
  };
  healthcare: {
    medicareNumber: string;
    medicareExpiry: string;
    medicarePosition: string;
    dva: {
      hasCard: boolean;
      cardType: string;
      number: string;
    };
    privateHealth: {
      hasInsurance: boolean;
      provider: string;
      membershipNumber: string;
      level: string;
    };
    pensionCard: {
      hasCard: boolean;
      type: string;
      number: string;
    };
  };
  emergency: {
    contacts: Array<{
      id: string;
      name: string;
      relationship: string;
      phone: string;
      email: string;
      isPrimary: boolean;
      contactOrder: number;
    }>;
  };
  medical: {
    allergies: string[];
    medications: string[];
    conditions: string[];
    bloodType: string;
    organDonor: boolean;
    advanceDirective: boolean;
    advanceDirectiveLocation?: string;
    additionalNotes?: string;
  };
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
  const { user, profile } = useAuthStore();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [newAllergy, setNewAllergy] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [newCondition, setNewCondition] = useState('');

  // Mock profile data - in real app, this would come from Supabase
  useEffect(() => {
    setProfileData({
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
        interpreterRequired: false,
        profilePhotoUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      },
      contact: {
        email: 'sarah.johnson@email.com',
        mobilePhone: '0412 345 678',
        homePhone: '02 9876 5432',
        workPhone: '',
        address: {
          street: '123 Collins Street',
          suburb: 'Melbourne',
          state: 'VIC',
          postcode: '3000',
          country: 'Australia'
        },
        postalAddress: {
          same: true,
          street: '',
          suburb: '',
          state: '',
          postcode: '',
          country: ''
        }
      },
      healthcare: {
        medicareNumber: '1234567890',
        medicareExpiry: '2025-12-31',
        medicarePosition: '1',
        dva: {
          hasCard: false,
          cardType: '',
          number: ''
        },
        privateHealth: {
          hasInsurance: true,
          provider: 'Medibank Private',
          membershipNumber: 'MP123456789',
          level: 'Hospital & Extras'
        },
        pensionCard: {
          hasCard: false,
          type: '',
          number: ''
        }
      },
      emergency: {
        contacts: [
          {
            id: '1',
            name: 'John Johnson',
            relationship: 'Spouse',
            phone: '0423 456 789',
            email: 'john.johnson@email.com',
            isPrimary: true,
            contactOrder: 1
          },
          {
            id: '2',
            name: 'Mary Johnson',
            relationship: 'Mother',
            phone: '0434 567 890',
            email: 'mary.johnson@email.com',
            isPrimary: false,
            contactOrder: 2
          }
        ]
      },
      medical: {
        allergies: ['Penicillin', 'Shellfish'],
        medications: ['Paracetamol 500mg'],
        conditions: ['Hypertension'],
        bloodType: 'O+',
        organDonor: true,
        advanceDirective: false,
        additionalNotes: 'No additional medical notes at this time.'
      },
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
  }, []);

  const tabs = [
    { id: 'personal', label: 'Personal Details', icon: <User className="h-4 w-4" /> },
    { id: 'contact', label: 'Contact Information', icon: <Phone className="h-4 w-4" /> },
    { id: 'healthcare', label: 'Healthcare Cards', icon: <CreditCard className="h-4 w-4" /> },
    { id: 'emergency', label: 'Emergency Contacts', icon: <Users className="h-4 w-4" /> },
    { id: 'medical', label: 'Medical Information', icon: <Heart className="h-4 w-4" /> },
    { id: 'preferences', label: 'Preferences & Privacy', icon: <Settings className="h-4 w-4" /> },
    { id: 'security', label: 'Security & Access', icon: <Shield className="h-4 w-4" /> }
  ];

  const handleSave = async () => {
    setLoading(true);
    try {
      // In real app, save to Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfileData = (section: keyof UserProfileData, field: string, value: any) => {
    if (!profileData) return;
    
    setProfileData(prev => ({
      ...prev!,
      [section]: {
        ...prev![section],
        [field]: value
      }
    }));
  };

  const addEmergencyContact = () => {
    if (!profileData) return;
    
    const newContact = {
      id: Date.now().toString(),
      name: '',
      relationship: '',
      phone: '',
      email: '',
      isPrimary: false,
      contactOrder: profileData.emergency.contacts.length + 1
    };
    
    setProfileData(prev => ({
      ...prev!,
      emergency: {
        contacts: [...prev!.emergency.contacts, newContact]
      }
    }));
  };

  const removeEmergencyContact = (contactId: string) => {
    if (!profileData) return;
    
    setProfileData(prev => ({
      ...prev!,
      emergency: {
        contacts: prev!.emergency.contacts.filter(c => c.id !== contactId)
      }
    }));
  };

  const addMedicalItem = (type: 'allergies' | 'medications' | 'conditions', value: string) => {
    if (!profileData || !value.trim()) return;
    
    setProfileData(prev => ({
      ...prev!,
      medical: {
        ...prev!.medical,
        [type]: [...prev!.medical[type], value.trim()]
      }
    }));
    
    // Clear the input
    if (type === 'allergies') setNewAllergy('');
    if (type === 'medications') setNewMedication('');
    if (type === 'conditions') setNewCondition('');
  };

  const removeMedicalItem = (type: 'allergies' | 'medications' | 'conditions', index: number) => {
    if (!profileData) return;
    
    setProfileData(prev => ({
      ...prev!,
      medical: {
        ...prev!.medical,
        [type]: prev!.medical[type].filter((_, i) => i !== index)
      }
    }));
  };

  const renderPersonalTab = () => (
    <div className="space-y-6">
      {/* Profile Photo */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          {profileData?.personal.profilePhotoUrl ? (
            <img
              src={profileData.personal.profilePhotoUrl}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
              <span className="text-2xl font-bold text-indigo-600">
                {profileData?.personal.firstName[0]}{profileData?.personal.lastName[0]}
              </span>
            </div>
          )}
          {isEditing && (
            <button className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700">
              <Camera className="h-4 w-4" />
            </button>
          )}
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">Profile Photo</h3>
          <p className="text-sm text-gray-500">Upload a photo to help providers identify you</p>
          {isEditing && (
            <div className="mt-2 space-x-2">
              <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                Upload Photo
              </button>
              <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                Remove
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <select 
            value={profileData?.personal.title || ''}
            onChange={(e) => updateProfileData('personal', 'title', e.target.value)}
            disabled={!isEditing}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
          >
            <option value="">Select title</option>
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
            value={profileData?.personal.firstName || ''}
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
            value={profileData?.personal.lastName || ''}
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
            value={profileData?.personal.preferredName || ''}
            onChange={(e) => updateProfileData('personal', 'preferredName', e.target.value)}
            disabled={!isEditing}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
          <input
            type="date"
            value={profileData?.personal.dateOfBirth || ''}
            onChange={(e) => updateProfileData('personal', 'dateOfBirth', e.target.value)}
            disabled={!isEditing}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          <select 
            value={profileData?.personal.gender || ''}
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
      
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Cultural Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={profileData?.personal.aboriginalTorresStrait || false}
                onChange={(e) => updateProfileData('personal', 'aboriginalTorresStrait', e.target.checked)}
                disabled={!isEditing}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Aboriginal or Torres Strait Islander</span>
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cultural Background</label>
            <input
              type="text"
              value={profileData?.personal.culturalBackground || ''}
              onChange={(e) => updateProfileData('personal', 'culturalBackground', e.target.value)}
              disabled={!isEditing}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Language</label>
            <select 
              value={profileData?.personal.preferredLanguage || ''}
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
          
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={profileData?.personal.interpreterRequired || false}
                onChange={(e) => updateProfileData('personal', 'interpreterRequired', e.target.checked)}
                disabled={!isEditing}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Interpreter Required</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContactTab = () => (
    <div className="space-y-6">
      {/* Contact Information */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">Contact Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
            <input
              type="email"
              value={profileData?.contact.email || ''}
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
              value={profileData?.contact.mobilePhone || ''}
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
              value={profileData?.contact.homePhone || ''}
              onChange={(e) => updateProfileData('contact', 'homePhone', e.target.value)}
              disabled={!isEditing}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Work Phone</label>
            <input
              type="tel"
              value={profileData?.contact.workPhone || ''}
              onChange={(e) => updateProfileData('contact', 'workPhone', e.target.value)}
              disabled={!isEditing}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Residential Address */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Residential Address</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
            <input
              type="text"
              value={profileData?.contact.address.street || ''}
              onChange={(e) => updateProfileData('contact', 'address', { ...profileData?.contact.address, street: e.target.value })}
              disabled={!isEditing}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Suburb *</label>
            <input
              type="text"
              value={profileData?.contact.address.suburb || ''}
              onChange={(e) => updateProfileData('contact', 'address', { ...profileData?.contact.address, suburb: e.target.value })}
              disabled={!isEditing}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
            <select 
              value={profileData?.contact.address.state || ''}
              onChange={(e) => updateProfileData('contact', 'address', { ...profileData?.contact.address, state: e.target.value })}
              disabled={!isEditing}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
              required
            >
              <option value="">Select state</option>
              <option value="NSW">New South Wales</option>
              <option value="VIC">Victoria</option>
              <option value="QLD">Queensland</option>
              <option value="WA">Western Australia</option>
              <option value="SA">South Australia</option>
              <option value="TAS">Tasmania</option>
              <option value="ACT">Australian Capital Territory</option>
              <option value="NT">Northern Territory</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Postcode *</label>
            <input
              type="text"
              value={profileData?.contact.address.postcode || ''}
              onChange={(e) => updateProfileData('contact', 'address', { ...profileData?.contact.address, postcode: e.target.value })}
              disabled={!isEditing}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
            <input
              type="text"
              value={profileData?.contact.address.country || 'Australia'}
              onChange={(e) => updateProfileData('contact', 'address', { ...profileData?.contact.address, country: e.target.value })}
              disabled={!isEditing}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Postal Address */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium text-gray-900">Postal Address</h4>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={profileData?.contact.postalAddress.same || false}
              onChange={(e) => updateProfileData('contact', 'postalAddress', { ...profileData?.contact.postalAddress, same: e.target.checked })}
              disabled={!isEditing}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Same as residential address</span>
          </label>
        </div>
        
        {!profileData?.contact.postalAddress.same && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
              <input
                type="text"
                value={profileData?.contact.postalAddress.street || ''}
                onChange={(e) => updateProfileData('contact', 'postalAddress', { ...profileData?.contact.postalAddress, street: e.target.value })}
                disabled={!isEditing}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Suburb</label>
              <input
                type="text"
                value={profileData?.contact.postalAddress.suburb || ''}
                onChange={(e) => updateProfileData('contact', 'postalAddress', { ...profileData?.contact.postalAddress, suburb: e.target.value })}
                disabled={!isEditing}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <select 
                value={profileData?.contact.postalAddress.state || ''}
                onChange={(e) => updateProfileData('contact', 'postalAddress', { ...profileData?.contact.postalAddress, state: e.target.value })}
                disabled={!isEditing}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
              >
                <option value="">Select state</option>
                <option value="NSW">New South Wales</option>
                <option value="VIC">Victoria</option>
                <option value="QLD">Queensland</option>
                <option value="WA">Western Australia</option>
                <option value="SA">South Australia</option>
                <option value="TAS">Tasmania</option>
                <option value="ACT">Australian Capital Territory</option>
                <option value="NT">Northern Territory</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Postcode</label>
              <input
                type="text"
                value={profileData?.contact.postalAddress.postcode || ''}
                onChange={(e) => updateProfileData('contact', 'postalAddress', { ...profileData?.contact.postalAddress, postcode: e.target.value })}
                disabled={!isEditing}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderHealthcareTab = () => (
    <div className="space-y-6">
      {/* Medicare */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <CreditCard className="h-5 w-5 text-green-600" />
          <h4 className="text-lg font-medium text-gray-900">Medicare Card</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Medicare Number *</label>
            <div className="relative">
              <input
                type={showSensitiveData ? "text" : "password"}
                value={profileData?.healthcare.medicareNumber || ''}
                onChange={(e) => updateProfileData('healthcare', 'medicareNumber', e.target.value)}
                disabled={!isEditing}
                className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
                required
              />
              <button
                type="button"
                onClick={() => setShowSensitiveData(!showSensitiveData)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showSensitiveData ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
            <input
              type="date"
              value={profileData?.healthcare.medicareExpiry || ''}
              onChange={(e) => updateProfileData('healthcare', 'medicareExpiry', e.target.value)}
              disabled={!isEditing}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Position on Card</label>
            <select 
              value={profileData?.healthcare.medicarePosition || ''}
              onChange={(e) => updateProfileData('healthcare', 'medicarePosition', e.target.value)}
              disabled={!isEditing}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
        </div>
      </div>

      {/* Private Health Insurance */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="h-5 w-5 text-blue-600" />
          <h4 className="text-lg font-medium text-gray-900">Private Health Insurance</h4>
        </div>
        <div className="space-y-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={profileData?.healthcare.privateHealth.hasInsurance || false}
              onChange={(e) => updateProfileData('healthcare', 'privateHealth', { ...profileData?.healthcare.privateHealth, hasInsurance: e.target.checked })}
              disabled={!isEditing}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">I have private health insurance</span>
          </label>
          
          {profileData?.healthcare.privateHealth.hasInsurance && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
                <input
                  type="text"
                  value={profileData?.healthcare.privateHealth.provider || ''}
                  onChange={(e) => updateProfileData('healthcare', 'privateHealth', { ...profileData?.healthcare.privateHealth, provider: e.target.value })}
                  disabled={!isEditing}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Membership Number</label>
                <input
                  type={showSensitiveData ? "text" : "password"}
                  value={profileData?.healthcare.privateHealth.membershipNumber || ''}
                  onChange={(e) => updateProfileData('healthcare', 'privateHealth', { ...profileData?.healthcare.privateHealth, membershipNumber: e.target.value })}
                  disabled={!isEditing}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Coverage Level</label>
                <select 
                  value={profileData?.healthcare.privateHealth.level || ''}
                  onChange={(e) => updateProfileData('healthcare', 'privateHealth', { ...profileData?.healthcare.privateHealth, level: e.target.value })}
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

      {/* DVA Card */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="h-5 w-5 text-orange-600" />
          <h4 className="text-lg font-medium text-gray-900">DVA Card</h4>
        </div>
        <div className="space-y-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={profileData?.healthcare.dva.hasCard || false}
              onChange={(e) => updateProfileData('healthcare', 'dva', { ...profileData?.healthcare.dva, hasCard: e.target.checked })}
              disabled={!isEditing}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">I have a DVA card</span>
          </label>
          
          {profileData?.healthcare.dva.hasCard && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Type</label>
                <select 
                  value={profileData?.healthcare.dva.cardType || ''}
                  onChange={(e) => updateProfileData('healthcare', 'dva', { ...profileData?.healthcare.dva, cardType: e.target.value })}
                  disabled={!isEditing}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
                >
                  <option value="">Select type</option>
                  <option value="Gold">Gold Card</option>
                  <option value="White">White Card</option>
                  <option value="Orange">Orange Card</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">DVA Number</label>
                <input
                  type={showSensitiveData ? "text" : "password"}
                  value={profileData?.healthcare.dva.number || ''}
                  onChange={(e) => updateProfileData('healthcare', 'dva', { ...profileData?.healthcare.dva, number: e.target.value })}
                  disabled={!isEditing}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pension Card */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <CreditCard className="h-5 w-5 text-purple-600" />
          <h4 className="text-lg font-medium text-gray-900">Pension/Concession Card</h4>
        </div>
        <div className="space-y-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={profileData?.healthcare.pensionCard.hasCard || false}
              onChange={(e) => updateProfileData('healthcare', 'pensionCard', { ...profileData?.healthcare.pensionCard, hasCard: e.target.checked })}
              disabled={!isEditing}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">I have a pension or concession card</span>
          </label>
          
          {profileData?.healthcare.pensionCard.hasCard && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Type</label>
                <select 
                  value={profileData?.healthcare.pensionCard.type || ''}
                  onChange={(e) => updateProfileData('healthcare', 'pensionCard', { ...profileData?.healthcare.pensionCard, type: e.target.value })}
                  disabled={!isEditing}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
                >
                  <option value="">Select type</option>
                  <option value="Pensioner Concession Card">Pensioner Concession Card</option>
                  <option value="Health Care Card">Health Care Card</option>
                  <option value="Commonwealth Seniors Health Card">Commonwealth Seniors Health Card</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                <input
                  type={showSensitiveData ? "text" : "password"}
                  value={profileData?.healthcare.pensionCard.number || ''}
                  onChange={(e) => updateProfileData('healthcare', 'pensionCard', { ...profileData?.healthcare.pensionCard, number: e.target.value })}
                  disabled={!isEditing}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderEmergencyTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-medium text-gray-900">Emergency Contacts</h4>
        {isEditing && (
          <button
            onClick={addEmergencyContact}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Contact</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {profileData?.emergency.contacts.map((contact, index) => (
          <div key={contact.id} className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">Contact {index + 1}</span>
                {contact.isPrimary && (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                    Primary
                  </span>
                )}
              </div>
              {isEditing && (
                <button
                  onClick={() => removeEmergencyContact(contact.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={contact.name}
                  onChange={(e) => {
                    const updatedContacts = profileData?.emergency.contacts.map(c => 
                      c.id === contact.id ? { ...c, name: e.target.value } : c
                    );
                    setProfileData(prev => ({
                      ...prev!,
                      emergency: { contacts: updatedContacts || [] }
                    }));
                  }}
                  disabled={!isEditing}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Relationship *</label>
                <select
                  value={contact.relationship}
                  onChange={(e) => {
                    const updatedContacts = profileData?.emergency.contacts.map(c => 
                      c.id === contact.id ? { ...c, relationship: e.target.value } : c
                    );
                    setProfileData(prev => ({
                      ...prev!,
                      emergency: { contacts: updatedContacts || [] }
                    }));
                  }}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={contact.phone}
                  onChange={(e) => {
                    const updatedContacts = profileData?.emergency.contacts.map(c => 
                      c.id === contact.id ? { ...c, phone: e.target.value } : c
                    );
                    setProfileData(prev => ({
                      ...prev!,
                      emergency: { contacts: updatedContacts || [] }
                    }));
                  }}
                  disabled={!isEditing}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={contact.email}
                  onChange={(e) => {
                    const updatedContacts = profileData?.emergency.contacts.map(c => 
                      c.id === contact.id ? { ...c, email: e.target.value } : c
                    );
                    setProfileData(prev => ({
                      ...prev!,
                      emergency: { contacts: updatedContacts || [] }
                    }));
                  }}
                  disabled={!isEditing}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={contact.isPrimary}
                    onChange={(e) => {
                      const updatedContacts = profileData?.emergency.contacts.map(c => 
                        c.id === contact.id ? { ...c, isPrimary: e.target.checked } : { ...c, isPrimary: false }
                      );
                      setProfileData(prev => ({
                        ...prev!,
                        emergency: { contacts: updatedContacts || [] }
                      }));
                    }}
                    disabled={!isEditing}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">Primary emergency contact</span>
                </label>
              </div>
            </div>
          </div>
        ))}

        {profileData?.emergency.contacts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>No emergency contacts added yet</p>
            {isEditing && (
              <button
                onClick={addEmergencyContact}
                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Add Emergency Contact
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderMedicalTab = () => (
    <div className="space-y-6">
      {/* Allergies */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium text-gray-900">Allergies</h4>
          <AlertTriangle className="h-5 w-5 text-red-600" />
        </div>
        
        <div className="space-y-3">
          {profileData?.medical.allergies.map((allergy, index) => (
            <div key={index} className="flex items-center justify-between bg-white p-3 rounded-md">
              <span className="text-gray-900">{allergy}</span>
              {isEditing && (
                <button
                  onClick={() => removeMedicalItem('allergies', index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          
          {isEditing && (
            <div className="flex space-x-2">
              <input
                type="text"
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                placeholder="Add new allergy..."
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                onClick={() => addMedicalItem('allergies', newAllergy)}
                disabled={!newAllergy.trim()}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                Add
              </button>
            </div>
          )}
          
          {profileData?.medical.allergies.length === 0 && (
            <p className="text-gray-500 text-center py-4">No known allergies</p>
          )}
        </div>
      </div>

      {/* Current Medications */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium text-gray-900">Current Medications</h4>
          <Heart className="h-5 w-5 text-blue-600" />
        </div>
        
        <div className="space-y-3">
          {profileData?.medical.medications.map((medication, index) => (
            <div key={index} className="flex items-center justify-between bg-white p-3 rounded-md">
              <span className="text-gray-900">{medication}</span>
              {isEditing && (
                <button
                  onClick={() => removeMedicalItem('medications', index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          
          {isEditing && (
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMedication}
                onChange={(e) => setNewMedication(e.target.value)}
                placeholder="Add current medication..."
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                onClick={() => addMedicalItem('medications', newMedication)}
                disabled={!newMedication.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Add
              </button>
            </div>
          )}
          
          {profileData?.medical.medications.length === 0 && (
            <p className="text-gray-500 text-center py-4">No current medications</p>
          )}
        </div>
      </div>

      {/* Medical Conditions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium text-gray-900">Medical Conditions</h4>
          <Heart className="h-5 w-5 text-yellow-600" />
        </div>
        
        <div className="space-y-3">
          {profileData?.medical.conditions.map((condition, index) => (
            <div key={index} className="flex items-center justify-between bg-white p-3 rounded-md">
              <span className="text-gray-900">{condition}</span>
              {isEditing && (
                <button
                  onClick={() => removeMedicalItem('conditions', index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          
          {isEditing && (
            <div className="flex space-x-2">
              <input
                type="text"
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                placeholder="Add medical condition..."
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                onClick={() => addMedicalItem('conditions', newCondition)}
                disabled={!newCondition.trim()}
                className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 disabled:opacity-50"
              >
                Add
              </button>
            </div>
          )}
          
          {profileData?.medical.conditions.length === 0 && (
            <p className="text-gray-500 text-center py-4">No known medical conditions</p>
          )}
        </div>
      </div>

      {/* Additional Medical Information */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Additional Medical Information</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Blood Type</label>
            <select
              value={profileData?.medical.bloodType || ''}
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

          <div className="space-y-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={profileData?.medical.organDonor || false}
                onChange={(e) => updateProfileData('medical', 'organDonor', e.target.checked)}
                disabled={!isEditing}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Organ donor</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={profileData?.medical.advanceDirective || false}
                onChange={(e) => updateProfileData('medical', 'advanceDirective', e.target.checked)}
                disabled={!isEditing}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Advance directive in place</span>
            </label>
          </div>
        </div>

        {profileData?.medical.advanceDirective && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Advance Directive Location</label>
            <input
              type="text"
              value={profileData?.medical.advanceDirectiveLocation || ''}
              onChange={(e) => updateProfileData('medical', 'advanceDirectiveLocation', e.target.value)}
              disabled={!isEditing}
              placeholder="Where is your advance directive stored?"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
            />
          </div>
        )}

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
          <textarea
            value={profileData?.medical.additionalNotes || ''}
            onChange={(e) => updateProfileData('medical', 'additionalNotes', e.target.value)}
            disabled={!isEditing}
            rows={3}
            placeholder="Any additional medical information..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
          />
        </div>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      {/* Communication Preferences */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Mail className="h-5 w-5 text-indigo-600" />
          <h4 className="text-lg font-medium text-gray-900">Communication Preferences</h4>
        </div>
        <p className="text-sm text-gray-500 mb-4">Choose how you'd like to receive communications from healthcare providers</p>
        <div className="space-y-3">
          {Object.entries(profileData?.preferences.communication || {}).map(([key, value]) => (
            <label key={key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => updateProfileData('preferences', 'communication', { ...profileData?.preferences.communication, [key]: e.target.checked })}
                disabled={!isEditing}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700 capitalize">
                {key === 'sms' ? 'SMS/Text Messages' : key.replace(/([A-Z])/g, ' $1')}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Bell className="h-5 w-5 text-indigo-600" />
          <h4 className="text-lg font-medium text-gray-900">Notification Settings</h4>
        </div>
        <p className="text-sm text-gray-500 mb-4">Manage what notifications you receive</p>
        <div className="space-y-3">
          {Object.entries(profileData?.preferences.notifications || {}).map(([key, value]) => (
            <label key={key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => updateProfileData('preferences', 'notifications', { ...profileData?.preferences.notifications, [key]: e.target.checked })}
                disabled={!isEditing}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Lock className="h-5 w-5 text-yellow-600" />
          <h4 className="text-lg font-medium text-gray-900">Privacy & Data Sharing</h4>
        </div>
        <p className="text-sm text-gray-500 mb-4">Control how your health information is shared</p>
        <div className="space-y-3">
          {Object.entries(profileData?.preferences.privacy || {}).map(([key, value]) => (
            <label key={key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => updateProfileData('preferences', 'privacy', { ...profileData?.preferences.privacy, [key]: e.target.checked })}
                disabled={!isEditing}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">
                {key === 'shareWithMHR' && 'Share with My Health Record'}
                {key === 'shareWithSpecialists' && 'Share with referred specialists'}
                {key === 'shareWithPharmacy' && 'Share with pharmacy'}
                {key === 'allowResearch' && 'Allow use of de-identified data for research'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Accessibility Settings */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Eye className="h-5 w-5 text-purple-600" />
          <h4 className="text-lg font-medium text-gray-900">Accessibility Options</h4>
        </div>
        <p className="text-sm text-gray-500 mb-4">Customize the interface to meet your accessibility needs</p>
        <div className="space-y-3">
          {Object.entries(profileData?.preferences.accessibility || {}).map(([key, value]) => (
            <label key={key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => updateProfileData('preferences', 'accessibility', { ...profileData?.preferences.accessibility, [key]: e.target.checked })}
                disabled={!isEditing}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      {/* Account Security */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Account Security</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Key className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Password</p>
                <p className="text-sm text-gray-500">Last changed 30 days ago</p>
              </div>
            </div>
            <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              Change Password
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Smartphone className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">Not enabled</p>
              </div>
            </div>
            <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              Enable 2FA
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Encryption Keys</p>
                <p className="text-sm text-gray-500">Your data is encrypted with your personal keys</p>
              </div>
            </div>
            <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              Manage Keys
            </button>
          </div>
        </div>
      </div>

      {/* Login Activity */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Recent Login Activity</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Globe className="h-4 w-4 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Chrome on Windows</p>
                <p className="text-xs text-gray-500">Melbourne, VIC • Current session</p>
              </div>
            </div>
            <span className="text-xs text-green-600 flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Active</span>
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Smartphone className="h-4 w-4 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Mobile App</p>
                <p className="text-xs text-gray-500">Melbourne, VIC • 2 hours ago</p>
              </div>
            </div>
            <span className="text-xs text-gray-500">Ended</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Globe className="h-4 w-4 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Safari on macOS</p>
                <p className="text-xs text-gray-500">Sydney, NSW • Yesterday</p>
              </div>
            </div>
            <span className="text-xs text-gray-500">Ended</span>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Data Management</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Export Your Data</p>
              <p className="text-sm text-gray-500">Download a copy of all your health data</p>
            </div>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Backup Data</p>
              <p className="text-sm text-gray-500">Create an encrypted backup of your profile</p>
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Backup</span>
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Delete Account</p>
              <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
            </div>
            <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Audit Log */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Recent Account Activity</h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Clock className="h-4 w-4 text-gray-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Profile updated</p>
              <p className="text-xs text-gray-500">Contact information changed • 2 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Shield className="h-4 w-4 text-gray-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Privacy settings updated</p>
              <p className="text-xs text-gray-500">Data sharing preferences changed • Yesterday</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Key className="h-4 w-4 text-gray-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Password changed</p>
              <p className="text-xs text-gray-500">Account password updated • 30 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!profileData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <User className="h-8 w-8 text-indigo-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              {profileData.personal.profilePhotoUrl ? (
                <img
                  src={profileData.personal.profilePhotoUrl}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="text-xl font-bold text-indigo-600">
                    {profileData.personal.firstName[0]}{profileData.personal.lastName[0]}
                  </span>
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                <Check className="h-3 w-3 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {profileData.personal.title} {profileData.personal.firstName} {profileData.personal.lastName}
              </h1>
              <p className="text-gray-500">Patient Profile • Verified</p>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-sm text-gray-500">
                  Age: {new Date().getFullYear() - new Date(profileData.personal.dateOfBirth).getFullYear()}
                </span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">
                  Medicare: ****{profileData.healthcare.medicareNumber.slice(-4)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 flex items-center space-x-2"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
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

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'personal' && renderPersonalTab()}
          {activeTab === 'contact' && renderContactTab()}
          {activeTab === 'healthcare' && renderHealthcareTab()}
          {activeTab === 'emergency' && renderEmergencyTab()}
          {activeTab === 'medical' && renderMedicalTab()}
          {activeTab === 'preferences' && renderPreferencesTab()}
          {activeTab === 'security' && renderSecurityTab()}
        </div>
      </div>
    </div>
  );
}