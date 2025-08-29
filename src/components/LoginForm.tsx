import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useFormValidation } from '../hooks/useFormValidation';
import { FormField } from './FormField';
import { LoadingButton } from './LoadingButton';

export function LoginForm() {
  const navigate = useNavigate();
  const { signIn } = useAuthStore();
  
  const {
    data: formData,
    errors,
    updateField,
    validateAll,
    handleSubmit,
    isSubmitting
  } = useFormValidation(
    {
      email: '',
      password: ''
    },
    {
      email: { required: true, email: true },
      password: { required: true, minLength: 6 }
    }
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await handleSubmit(
      async (data) => {
        await signIn(data.email, data.password);
        navigate('/');
      },
      () => {
        // Success callback
        console.log('Login successful');
      },
      (error) => {
        // Error callback
        console.error('Login failed:', error);
      }
    );
  };

  const handleDemoLogin = async (email: string, password: string) => {
    updateField('email', email);
    updateField('password', password);
    
    setTimeout(async () => {
      await signIn(formData.email, formData.password);
      navigate('/');
    }, 100);
  };


  return (
    <div className="bg-white rounded-lg shadow-xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
        <p className="text-gray-600 mt-2">Sign in to your HealthBridge account</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <FormField
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={updateField}
          error={errors.email}
          required
          placeholder="Enter your email"
          icon={<Mail className="h-5 w-5" />}
          disabled={isSubmitting}
        />

        <FormField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={updateField}
          error={errors.password}
          required
          placeholder="Enter your password"
          icon={<Lock className="h-5 w-5" />}
          showPasswordToggle
          disabled={isSubmitting}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>
          <Link
            to="/forgot-password"
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            Forgot password?
          </Link>
        </div>

        <LoadingButton
          type="submit"
          loading={isSubmitting}
          disabled={!formData.email || !formData.password}
          className="w-full py-3"
          loadingText="Signing in..."
        >
          Sign In
        </LoadingButton>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Create account
            </Link>
          </p>
        </div>
      </form>

      {/* Demo credentials */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-500 text-center mb-2">Demo Credentials</p>
        <div className="text-xs text-gray-600 space-y-2">
          <button
            type="button"
            onClick={() => handleDemoLogin('provider@healthbridge.com.au', 'password123')}
            className="block w-full text-left p-2 hover:bg-gray-100 rounded"
            disabled={isSubmitting}
          >
            <strong>Provider:</strong> provider@healthbridge.com.au / password123
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin('patient@healthbridge.com.au', 'password123')}
            className="block w-full text-left p-2 hover:bg-gray-100 rounded"
            disabled={isSubmitting}
          >
            <strong>Patient:</strong> patient@healthbridge.com.au / password123
          </button>
        </div>
      </div>
    </div>
  );
}