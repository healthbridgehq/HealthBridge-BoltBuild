import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useFormValidation } from '../hooks/useFormValidation';
import { FormField } from './FormField';
import { LoadingButton } from './LoadingButton';

export function RegisterForm() {
  const navigate = useNavigate();
  const { signUp } = useAuthStore();
  const [step, setStep] = useState(1);
  
  const {
    data: formData,
    errors,
    updateField,
    validateAll,
    handleSubmit,
    isSubmitting,
    getFieldError
  } = useFormValidation(
    {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      role: 'patient' as 'patient' | 'provider',
      agreeToTerms: false,
      agreeToPrivacy: false
    },
    {
      email: { required: true, email: true },
      password: { required: true, minLength: 8 },
      confirmPassword: { 
        required: true,
        custom: (value) => {
          if (value !== formData.password) {
            return 'Passwords do not match';
          }
          return null;
        }
      },
      fullName: { required: true, minLength: 2 },
      role: { required: true },
      agreeToTerms: { 
        required: true,
        custom: (value) => value ? null : 'You must agree to the terms of service'
      },
      agreeToPrivacy: { 
        required: true,
        custom: (value) => value ? null : 'You must agree to the privacy policy'
      }
    }
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      // Validate step 1 fields
      const step1Valid = ['fullName', 'email', 'role'].every(field => {
        const error = getFieldError(field);
        return !error && formData[field as keyof typeof formData];
      });
      
      if (!step1Valid) {
        return;
      }
      setStep(2);
      return;
    }

    await handleSubmit(
      async (data) => {
        await signUp(data.email, data.password, data.fullName, data.role);
        navigate('/');
      },
      () => {
        console.log('Registration successful');
      },
      (error) => {
        console.error('Registration failed:', error);
      }
    );
  };


  const renderStep1 = () => (
    <div className="space-y-6">
      <FormField
        label="Full Name"
        name="fullName"
        type="text"
        value={formData.fullName}
        onChange={updateField}
        error={getFieldError('fullName')}
        required
        placeholder="Enter your full name"
        icon={<User className="h-5 w-5" />}
        disabled={isSubmitting}
      />

      <FormField
        label="Email Address"
        name="email"
        type="email"
        value={formData.email}
        onChange={updateField}
        error={getFieldError('email')}
        required
        placeholder="Enter your email"
        icon={<Mail className="h-5 w-5" />}
        disabled={isSubmitting}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Account Type
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              formData.role === 'patient'
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-gray-300'
            } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => !isSubmitting && updateField('role', 'patient')}
          >
            <div className="text-center">
              <User className="h-8 w-8 mx-auto mb-2 text-indigo-600" />
              <p className="font-medium text-gray-900">Patient</p>
              <p className="text-sm text-gray-500">Access your health records</p>
            </div>
          </div>
          <div
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              formData.role === 'provider'
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-gray-300'
            } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => !isSubmitting && updateField('role', 'provider')}
          >
            <div className="text-center">
              <Activity className="h-8 w-8 mx-auto mb-2 text-indigo-600" />
              <p className="font-medium text-gray-900">Healthcare Provider</p>
              <p className="text-sm text-gray-500">Manage patient care</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <FormField
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={updateField}
        error={getFieldError('password')}
        required
        placeholder="Create a password"
        icon={<Lock className="h-5 w-5" />}
        showPasswordToggle
        helpText="Password must be at least 8 characters long"
        disabled={isSubmitting}
      />

      <FormField
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={updateField}
        error={getFieldError('confirmPassword')}
        required
        placeholder="Confirm your password"
        icon={<Lock className="h-5 w-5" />}
        showPasswordToggle
        disabled={isSubmitting}
      />

      <div className="space-y-3">
        <div className="flex items-start">
          <input
            id="agreeToTerms"
            type="checkbox"
            checked={formData.agreeToTerms}
            onChange={(e) => updateField('agreeToTerms', e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1"
            disabled={isSubmitting}
          />
          <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-900">
            I agree to the{' '}
            <Link to="/terms" className="text-indigo-600 hover:text-indigo-500">
              Terms of Service
            </Link>
          </label>
        </div>
        {getFieldError('agreeToTerms') && (
          <p className="text-sm text-red-600 ml-6">{getFieldError('agreeToTerms')}</p>
        )}
        
        <div className="flex items-start">
          <input
            id="agreeToPrivacy"
            type="checkbox"
            checked={formData.agreeToPrivacy}
            onChange={(e) => updateField('agreeToPrivacy', e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1"
            disabled={isSubmitting}
          />
          <label htmlFor="agreeToPrivacy" className="ml-2 block text-sm text-gray-900">
            I agree to the{' '}
            <Link to="/privacy" className="text-indigo-600 hover:text-indigo-500">
              Privacy Policy
            </Link>
          </label>
        </div>
        {getFieldError('agreeToPrivacy') && (
          <p className="text-sm text-red-600 ml-6">{getFieldError('agreeToPrivacy')}</p>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Australian Privacy Compliance</h4>
            <p className="text-sm text-blue-700 mt-1">
              Your data is protected under the Privacy Act 1988 and stored securely within Australia.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
        <p className="text-gray-600 mt-2">Join HealthBridge to manage your healthcare</p>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            1
          </div>
          <div className={`w-12 h-0.5 ${step > 1 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            2
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {step === 1 ? renderStep1() : renderStep2()}

        <div className="flex justify-between">
          {step === 2 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
          )}
          
          <LoadingButton
            type="submit"
            loading={isSubmitting}
            className={`py-3 px-6 ${
              step === 1 ? 'w-full' : 'ml-auto'
            }`}
            loadingText={step === 1 ? "Validating..." : "Creating account..."}
          >
            {step === 1 ? 'Continue' : 'Create Account'}
          </LoadingButton>
        </div>

        {step === 1 && (
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        )}
      </form>
    </div>
  );
}