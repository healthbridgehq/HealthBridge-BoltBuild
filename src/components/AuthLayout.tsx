import React from 'react';
import { Activity, Shield, Heart, Users } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="flex min-h-screen">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 p-12 text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col justify-center">
            <div className="flex items-center space-x-3 mb-8">
              <Activity className="h-12 w-12" />
              <div>
                <h1 className="text-3xl font-bold">HealthBridge</h1>
                <p className="text-indigo-200">Australian Healthcare Portal</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-4xl font-bold leading-tight">
                Connecting Healthcare,<br />
                Empowering Patients
              </h2>
              
              <p className="text-xl text-indigo-100 leading-relaxed">
                Secure, compliant, and comprehensive healthcare management 
                designed for the Australian healthcare system.
              </p>
              
              <div className="space-y-4 mt-8">
                <div className="flex items-center space-x-3">
                  <Shield className="h-6 w-6 text-indigo-300" />
                  <span className="text-indigo-100">Privacy Act 1988 Compliant</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Heart className="h-6 w-6 text-indigo-300" />
                  <span className="text-indigo-100">My Health Record Integration</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-6 w-6 text-indigo-300" />
                  <span className="text-indigo-100">Trusted by Healthcare Providers</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white bg-opacity-10 rounded-full -translate-y-48 translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white bg-opacity-5 rounded-full translate-y-32 -translate-x-32"></div>
        </div>
        
        {/* Right side - Auth form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile branding */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Activity className="h-8 w-8 text-indigo-600" />
                <span className="text-2xl font-bold text-gray-900">HealthBridge</span>
              </div>
              <p className="text-gray-600">Australian Healthcare Portal</p>
            </div>
            
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}