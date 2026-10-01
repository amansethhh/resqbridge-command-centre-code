import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
// Auth pages
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
// Command Centre
import CommandLayout from '@/components/resqbridge/CommandLayout';
import Overview from '@/pages/resqbridge/Overview';
import ActiveEmergencies from '@/pages/resqbridge/ActiveEmergencies';
import EmergencyDetail from '@/pages/resqbridge/EmergencyDetail';
import EmergencyTimeline from '@/pages/resqbridge/EmergencyTimeline';
import LiveMap from '@/pages/resqbridge/LiveMap';
import EmergencyHeatmap from '@/pages/resqbridge/EmergencyHeatmap';
import ResponseTimeIntelligence from '@/pages/resqbridge/ResponseTimeIntelligence';
import GeographicOperations from '@/pages/resqbridge/GeographicOperations';
import Dispatch from '@/pages/resqbridge/Dispatch';
import AmbulanceFleet from '@/pages/resqbridge/AmbulanceFleet';
import AmbulanceDetail from '@/pages/resqbridge/AmbulanceDetail';
import DriverOperations from '@/pages/resqbridge/DriverOperations';
import DriverDetail from '@/pages/resqbridge/DriverDetail';
import Hospitals from '@/pages/resqbridge/Hospitals';
import HospitalDetail from '@/pages/resqbridge/HospitalDetail';
import Alerts from '@/pages/resqbridge/Alerts';
import Notifications from '@/pages/resqbridge/Notifications';
import EscalationCentre from '@/pages/resqbridge/EscalationCentre';
import Analytics from '@/pages/resqbridge/Analytics';
import AuditLogs from '@/pages/resqbridge/AuditLogs';
import SystemHealth from '@/pages/resqbridge/SystemHealth';
import Settings from '@/pages/resqbridge/Settings';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route element={<CommandLayout />}>
          <Route path="/" element={<Overview />} />
          <Route path="/emergencies" element={<ActiveEmergencies />} />
          <Route path="/emergencies/:id" element={<EmergencyDetail />} />
          <Route path="/emergencies/:id/timeline" element={<EmergencyTimeline />} />
          <Route path="/dispatch" element={<Dispatch />} />
          <Route path="/ambulances" element={<AmbulanceFleet />} />
          <Route path="/ambulances/:id" element={<AmbulanceDetail />} />
          <Route path="/drivers" element={<DriverOperations />} />
          <Route path="/drivers/:id" element={<DriverDetail />} />
          <Route path="/hospitals" element={<Hospitals />} />
          <Route path="/hospitals/:id" element={<HospitalDetail />} />
          <Route path="/maps" element={<LiveMap />} />
          <Route path="/maps/heatmap" element={<EmergencyHeatmap />} />
          <Route path="/maps/response-time" element={<ResponseTimeIntelligence />} />
          <Route path="/maps/geo-ops" element={<GeographicOperations />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/escalations" element={<EscalationCentre />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/audit" element={<AuditLogs />} />
          <Route path="/system" element={<SystemHealth />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App