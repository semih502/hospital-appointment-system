import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { getErrorMessage } from '../services/api';
import { Mail, Lock, UserPlus, User, AlertCircle, Loader2, Activity } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Istemci tarafi (Client-side) form dogrulamasi
   */
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    // Ad Soyad dogrulamasi
    if (!formData.name.trim()) {
      newErrors.name = 'Ad ve Soyad alanı zorunludur.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Ad Soyad en az 2 karakter olmalıdır.';
    }

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

    // Sifre tekrari ve eslesme dogrulamasi
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifre tekrarı zorunludur.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifreler birbiriyle eşleşmiyor.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (serverError) {
      setServerError(null);
    }
  };

  /**
   * Kayit formu gonderim islemi
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await authService.register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: 'PATIENT',
      });

      // Basarili kayit sonrasi login sayfasina basari mesajiyla yonlendir
      navigate('/login', {
        state: { message: 'Kaydınız başarıyla oluşturuldu! Lütfen giriş yapınız.' },
      });
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setServerError(errorMessage);
    } finally {
      setIsLoading(false);
    }
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
            Yeni Hasta Hesabı Aç
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Hemen kayıt olarak kolayca randevu alabilir ve takip edebilirsiniz
          </p>
        </div>

        {/* Sunucu Hatasi Banner'i (Server-side Error Alert) */}
        {serverError && (
          <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 text-red-800 text-sm rounded-xl">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
            <div className="flex-1 font-medium">{serverError}</div>
          </div>
        )}

        {/* Kayit Formu */}
        <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
          {/* Ad Soyad */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
              Ad ve Soyad
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ahmet Yılmaz"
                className={`block w-full pl-10 pr-3.5 py-2.5 text-slate-900 bg-white border ${
                  errors.name ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-600'
                } rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition`}
              />
            </div>
            {errors.name && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.name}</p>
            )}
          </div>

          {/* E-posta Adresi */}
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
                placeholder="ahmet.yilmaz@email.com"
                className={`block w-full pl-10 pr-3.5 py-2.5 text-slate-900 bg-white border ${
                  errors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-600'
                } rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition`}
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.email}</p>
            )}
          </div>

          {/* Sifre */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              Şifre
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="En az 6 karakter"
                className={`block w-full pl-10 pr-3.5 py-2.5 text-slate-900 bg-white border ${
                  errors.password ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-600'
                } rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition`}
              />
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.password}</p>
            )}
          </div>

          {/* Sifre Tekrari */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
              Şifre Tekrarı
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Şifrenizi tekrar giriniz"
                className={`block w-full pl-10 pr-3.5 py-2.5 text-slate-900 bg-white border ${
                  errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-600'
                } rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Kayit Ol Butonu */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition duration-150"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Hesap oluşturuluyor...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Kayıt Ol
              </>
            )}
          </button>

          {/* Giris Yap Linki */}
          <div className="text-center pt-2">
            <p className="text-sm text-slate-600">
              Zaten bir hesabınız var mı?{' '}
              <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 transition">
                Giriş Yapın
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
