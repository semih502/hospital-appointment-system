import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';
import { getErrorMessage } from '../services/api';
import { Mail, Lock, LogIn, AlertCircle, Loader2, Activity, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Basarili kayit sonrasi yonlendirmeden gelen basari mesaji
  const successMessage = (location.state as { message?: string })?.message;

  /**
   * Istemci tarafi (Client-side) form dogrulamasi
   */
  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    // E-posta dogrulamasi
    if (!formData.email.trim()) {
      newErrors.email = 'E-posta adresi zorunludur.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Lütfen geçerli bir e-posta adresi giriniz.';
      }
    }

    // Sifre dogrulamasi
    if (!formData.password) {
      newErrors.password = 'Şifre alanı zorunludur.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalıdır.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Kullanici yazmaya basladiginda o alana ait hatayi temizle
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (serverError) {
      setServerError(null);
    }
  };

  /**
   * Form gonderim ve akilli yonlendirme (Smart Routing) islemi
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.login({
        email: formData.email.trim(),
        password: formData.password,
      });

      // Zustand store'u guncelle
      setAuth(response);

      // Role gore akilli yonlendirme
      switch (response.role) {
        case 'ADMIN':
          navigate('/admin');
          break;
        case 'DOCTOR':
          navigate('/doctor');
          break;
        case 'PATIENT':
        default:
          navigate('/dashboard');
          break;
      }
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setServerError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Gelistirme ve test kolayligi icin hizli doldurma yardimcisi
   */
  const handleQuickFill = (email: string, pass: string) => {
    setFormData({ email, password: pass });
    setErrors({});
    setServerError(null);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-200">
        {/* Baslik & Logo */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 mb-4 shadow-sm">
            <Activity className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Hesabınıza Giriş Yapın
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Hastane Randevu Sistemine erişmek için bilgilerinizi giriniz
          </p>
        </div>

        {/* Kayit sonrasi Basari Bildirimi */}
        {successMessage && (
          <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Sunucu Hatasi Banner'i (Server-side Error Alert) */}
        {serverError && (
          <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 text-red-800 text-sm rounded-xl">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
            <div className="flex-1 font-medium">{serverError}</div>
          </div>
        )}

        {/* Giris Formu */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            {/* E-posta Alani */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                E-posta Adresi
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ornek@hospital.com"
                  className={`block w-full pl-10 pr-3.5 py-2.5 text-slate-900 bg-white border ${
                    errors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-600'
                  } rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition`}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Sifre Alani */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  Şifre
                </label>
              </div>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`block w-full pl-10 pr-3.5 py-2.5 text-slate-900 bg-white border ${
                    errors.password ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-600'
                  } rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition`}
                />
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Giris Butonu */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition duration-150"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Giriş yapılıyor...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Giriş Yap
              </>
            )}
          </button>

          {/* Kayit Ol Linki */}
          <div className="text-center pt-2">
            <p className="text-sm text-slate-600">
              Henüz bir hesabınız yok mu?{' '}
              <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700 transition">
                Hemen Kayıt Olun
              </Link>
            </p>
          </div>
        </form>

        {/* Hizli Test Paneli (Gelistirme & Demo Kolayligi) */}
        <div className="pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-400 font-medium text-center mb-2">Hızlı Test Doldurma:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              type="button"
              onClick={() => handleQuickFill('ahmet.yilmaz@hospital.com', 'Patient123!')}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md transition"
            >
              Hasta
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('mehmet.oz@hospital.com', 'Doctor123!')}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md transition"
            >
              Doktor
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin@hospital.com', 'Admin123!')}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md transition"
            >
              Yönetici
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
