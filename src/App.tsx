import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { useAuthStore } from './stores/authStore';
import { Layout } from './components/Layout';
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
          <Route path="/records/add" element={<div>Add Health Record</div>} />
          <Route path="/records/share" element={<div>Share Health Records</div>} />
          
          <Route path="/appointments" element={
            previewMode && mockPractitionerProfile.role === 'provider' ? (
              <PractitionerAppointments />
            ) : (
              <PatientAppointments />
            )
          } />
          <Route path="/appointments/schedule" element={<AppointmentSchedule />} />
          <Route path="/appointments/upcoming" element={<div>Upcoming Appointments</div>} />
          <Route path="/appointments/history" element={<div>Appointment History</div>} />
          
          <Route path="/medications" element={<Prescriptions />} />
          <Route path="/medications/current" element={<div>Current Medications</div>} />
          <Route path="/medications/history" element={<div>Medication History</div>} />
          <Route path="/medications/requests" element={<div>Prescription Requests</div>} />
          
          <Route path="/health-goals" element={<div>Health Goals</div>} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<UserProfile />} />
          
          {/* Provider Routes */}
          <Route path="/patients" element={<PatientManagement />} />
          <Route path="/patients/add" element={<div>Add Patient</div>} />
          <Route path="/patients/search" element={<div>Search Patients</div>} />
          
          <Route path="/appointments/calendar" element={<div>Appointment Calendar</div>} />
          <Route path="/appointments/today" element={<div>Today's Schedule</div>} />
          <Route path="/appointments/waiting" element={<div>Waiting Room</div>} />
          
          <Route path="/clinical-records" element={<ClinicalRecords />} />
          <Route path="/clinical-records/create" element={<div>Create Clinical Record</div>} />
          <Route path="/clinical-records/review" element={<div>Review Records</div>} />
          <Route path="/clinical-records/templates" element={<div>Clinical Templates</div>} />
          
          <Route path="/prescriptions" element={<div>Prescription Management</div>} />
          <Route path="/prescriptions/create" element={<div>Create Prescription</div>} />
          <Route path="/prescriptions/history" element={<div>Prescription History</div>} />
          <Route path="/prescriptions/interactions" element={<div>Drug Interactions</div>} />
          
          <Route path="/tasks" element={<TasksWorkflow />} />
          
          <Route path="/analytics" element={<AnalyticsOverview />} />
          <Route path="/analytics/practice" element={<div>Practice Analytics</div>} />
          <Route path="/analytics/clinical" element={<div>Clinical Outcomes</div>} />
          <Route path="/analytics/financial" element={<div>Financial Reports</div>} />
          
          <Route path="/admin" element={<Administration />} />
          <Route path="/admin/staff" element={<div>Staff Management</div>} />
          <Route path="/admin/settings" element={<div>Practice Settings</div>} />
          <Route path="/admin/integrations" element={<div>System Integrations</div>} />
          
          {/* Phase 2 Routes - Enhanced Features */}
          <Route path="/telehealth" element={<TelehealthPlatform />} />
          <Route path="/billing" element={<BillingPayments />} />
          <Route path="/integrations" element={<IntegrationHub />} />
        </Route>
        
        {/* Auth Routes */}
        <Route path="/login" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
              <h2 className="text-2xl font-bold text-center mb-6">Login to HealthBridge</h2>
              <p className="text-gray-600 text-center">Authentication system will be implemented here</p>
            </div>
          </div>
        } />
        <Route path="/register" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
              <h2 className="text-2xl font-bold text-center mb-6">Register for HealthBridge</h2>
              <p className="text-gray-600 text-center">Registration system will be implemented here</p>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;