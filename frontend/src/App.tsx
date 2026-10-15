import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { PublicOnlyRoute } from './components/common/PublicOnlyRoute';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { PatientDashboardPage } from './pages/PatientDashboardPage';
import { DoctorDashboardPage } from './pages/DoctorDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AppointmentBookingPage } from './pages/AppointmentBookingPage';

export const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col font-['Inter',sans-serif]">
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* Genel Erisime Acik Rotalar */}
            <Route path="/" element={<HomePage />} />
            
            {/* Yalnizca Oturum Acmamis Kullanicilara Acik Rotalar */}
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <LoginPage />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicOnlyRoute>
                  <RegisterPage />
                </PublicOnlyRoute>
              }
            />

            {/* Hasta (PATIENT) Rolune Ozel Korumali Rotalar */}
            <Route element={<ProtectedRoute allowedRoles={['PATIENT']} />}>
              <Route path="/dashboard" element={<PatientDashboardPage />} />
              <Route path="/appointments/book" element={<AppointmentBookingPage />} />
            </Route>

            {/* Doktor (DOCTOR) Rolune Ozel Korumali Rotalar */}
            <Route element={<ProtectedRoute allowedRoles={['DOCTOR']} />}>
              <Route path="/doctor" element={<DoctorDashboardPage />} />
            </Route>

            {/* Yonetici (ADMIN) Rolune Ozel Korumali Rotalar */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
            </Route>

            {/* Tanimlanmamis Rotalar */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
