import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Activity, LogOut, User, Calendar, ShieldCheck, Stethoscope } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
            <ShieldCheck className="w-3 h-3" /> Yönetici
          </span>
        );
      case 'DOCTOR':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <Stethoscope className="w-3 h-3" /> Doktor
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <User className="w-3 h-3" /> Hasta
          </span>
        );
    }
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Sol: Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <span className="font-bold text-lg text-slate-900 tracking-tight block leading-tight">
                  MediCare
                </span>
                <span className="text-xs text-slate-500 font-medium">Randevu Sistemi</span>
              </div>
            </Link>
          </div>

          {/* Sag: Kullanici Menusu / Giris Butonlari */}
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <>
                <div className="hidden sm:flex items-center gap-3 pr-3 border-r border-slate-200">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-800 leading-tight">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                  {getRoleBadge(user.role)}
                </div>

                {user.role === 'PATIENT' && (
                  <Link
                    to="/appointments/book"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm transition"
                  >
                    <Calendar className="w-4 h-4" /> Randevu Al
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  title="Güvenli Çıkış"
                  className="inline-flex items-center gap-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 text-sm font-medium px-3 py-2 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Çıkış Yap</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-slate-700 hover:text-blue-600 text-sm font-medium px-3 py-2 rounded-lg transition"
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm transition"
                >
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
