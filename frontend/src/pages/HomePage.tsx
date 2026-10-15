import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Calendar, Shield, Clock, Users, ArrowRight } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between">
      {/* Hero Alani */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-6">
            <Clock className="w-3.5 h-3.5" /> 7/24 Kesintisiz Randevu Hizmeti
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            Sağlığınız İçin <span className="text-blue-600">Doğru Doktor</span>, Hızlı Randevu
          </h1>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            Hastanemizdeki tüm uzman doktorları inceleyin, anlık müsaitlik durumlarına göre
            çakışmasız ve güvenli şekilde randevunuzu saniyeler içinde planlayın.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link
                to={user?.role === 'PATIENT' ? '/appointments/book' : '/dashboard'}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition duration-200"
              >
                <Calendar className="w-5 h-5" />
                {user?.role === 'PATIENT' ? 'Hemen Randevu Al' : 'Panoya Git'}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition duration-200"
                >
                  Hemen Kayıt Ol
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-6 py-3.5 rounded-xl border border-slate-300 shadow-sm transition duration-200"
                >
                  Giriş Yap
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Ozellik Kartlari */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Canlı Takvim & Çakışmasız Slotlar</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Dolu saatler dinamik olarak kilitlenir; eşzamanlı rezervasyon koruması ile randevu çakışması yaşanmaz.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Uzman Doktor Kadrosu</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Tüm departmanlardaki uzman ve hekim kadromuzu listeleyin, branşlarına göre filtreleyip randevu oluşturun.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Rol Tabanlı Güvenli Erişim</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              JWT ve RBAC korumasıyla hasta, doktor ve yönetici panelleri tamamen izole ve güvenli tutulur.
            </p>
          </div>
        </div>
      </div>

      {/* Alt Bilgi (Footer) */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        <p>© 2026 Hastane Randevu Yönetim Sistemi. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
};
