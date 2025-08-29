import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { useAuthStore } from './stores/authStore';
import { Layout } from './components/Layout';
import { AuthLayout } from './components/AuthLayout';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { PatientDashboard } from './components/PatientDashboard';
import { PractitionerDashboard } from './components/PractitionerDashboard';
import { HealthRecords } from './pages/records/HealthRecords';
import { AppointmentSchedule } from './pages/appointments/AppointmentSchedule';
import { PractitionerAppointments } from './pages/appointments/PractitionerAppointments';
import { PatientAppointments } from './pages/appointments/PatientAppointments';
import { Messages } from './pages/messages/Messages';
import { Prescriptions } from './pages/prescriptions/Prescriptions';
import { TelehealthPlatform } from './pages/telehealth/TelehealthPlatform';
import { AnalyticsOverview } from './pages/analytics/AnalyticsOverview';
import { IntegrationHub } from './pages/integrations/IntegrationHub';
import { UserProfile } from './pages/profile/UserProfile';
import { PatientManagement } from './pages/patients/PatientManagement';
import { ClinicalRecords } from './pages/clinical/ClinicalRecords';
import { TasksWorkflow } from './pages/tasks/TasksWorkflow';
import { Administration } from './pages/administration/Administration';
import { BillingPayments } from './pages/billing/BillingPayments';
import { HealthGoals } from './pages/health-goals/HealthGoals';
import { NotFound } from './components/NotFound';

function App() {
  const { user, profile, loading, loadUser } = useAuthStore();

  // For preview purposes, show practitioner portal directly
  const previewMode = true;
  const mockPractitionerProfile = {
    full_name: 'Dr. Sarah Mitchell',
    role: 'provider'
  };

  useEffect(() => {
    if (!previewMode) {
      loadUser();
    }
  }, [loadUser, previewMode]);

  // Don't show loading spinner in preview mode
  if (loading && !previewMode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin">
          <Activity className="h-8 w-8 text-indigo-600" />
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<AuthLayout><LoginForm /></AuthLayout>} />
        <Route path="/register" element={<AuthLayout><RegisterForm /></AuthLayout>} />
        
        {/* Protected Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={
            previewMode ? (
              <PractitionerDashboard />
            ) : (
              user ? (
                profile?.role === 'provider' ? (
                  <PractitionerDashboard />
                ) : (
                  <PatientDashboard />
                )
              ) : (
                <Navigate to="/login" />
              )
            )
          } />
          
          {/* Patient Routes */}
          <Route path="/records" element={<HealthRecords />} />
          <Route path="/records/add" element={<HealthRecords />} />
          <Route path="/records/share" element={<HealthRecords />} />
          
          <Route path="/appointments" element={
            previewMode && mockPractitionerProfile.role === 'provider' ? (
              <PractitionerAppointments />
            ) : (
              <PatientAppointments />
            )
          } />
          <Route path="/appointments/book" element={<AppointmentSchedule />} />
          <Route path="/appointments/schedule" element={<AppointmentSchedule />} />
          <Route path="/appointments/history" element={<PatientAppointments />} />
          <Route path="/appointments/waiting-room" element={<PractitionerAppointments />} />
          
          <Route path="/medications" element={<Prescriptions />} />
          <Route path="/medications/active" element={<Prescriptions />} />
          <Route path="/medications/history" element={<Prescriptions />} />
          <Route path="/medications/request" element={<Prescriptions />} />
          
          <Route path="/health-goals" element={<HealthGoals />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<UserProfile />} />
          
          {/* Provider Routes */}
          <Route path="/patients" element={<PatientManagement />} />
          <Route path="/patients/add" element={<PatientManagement />} />
          <Route path="/patients/search" element={<PatientManagement />} />
          
          <Route path="/clinical-records" element={<ClinicalRecords />} />
          <Route path="/clinical-records/create" element={<ClinicalRecords />} />
          <Route path="/clinical-records/templates" element={<ClinicalRecords />} />
          
          <Route path="/prescriptions/create" element={<Prescriptions />} />
          <Route path="/prescriptions/history" element={<Prescriptions />} />
          
          <Route path="/tasks" element={<TasksWorkflow />} />
          
          <Route path="/analytics" element={<AnalyticsOverview />} />
          <Route path="/analytics/practice" element={<AnalyticsOverview />} />
          <Route path="/analytics/clinical" element={<AnalyticsOverview />} />
          <Route path="/analytics/financial" element={<AnalyticsOverview />} />
          
          <Route path="/admin" element={<Administration />} />
          <Route path="/admin/users" element={<Administration />} />
          <Route path="/admin/system" element={<Administration />} />
          <Route path="/admin/audit" element={<Administration />} />
          
          {/* Shared Routes */}
          <Route path="/telehealth" element={<TelehealthPlatform />} />
          <Route path="/billing" element={<BillingPayments />} />
          <Route path="/integrations" element={<IntegrationHub />} />
          
          {/* Catch all route */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;