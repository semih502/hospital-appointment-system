import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { appointmentService } from '../services/appointmentService';
import { Appointment } from '../types/appointment';
import { useAuthStore } from '../store/authStore';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { getErrorMessage } from '../services/api';
import {
  Calendar,
  Clock,
  PlusCircle,
  AlertCircle,
  CheckCircle2,
  User,
  X,
  AlertTriangle,
  Building,
  RotateCcw,
} from 'lucide-react';

export const PatientDashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'CANCELLED'>('ALL');

  // Iptal Modali Durumlari
  const [cancellingAppointment, setCancellingAppointment] = useState<Appointment | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchMyAppointments = async () => {
    try {
      setIsLoading(true);
      const data = await appointmentService.getMyPatientAppointments();
      setAppointments(data);
    } catch (err) {
      setToastMessage({ type: 'error', text: getErrorMessage(err) });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyAppointments();
  }, []);

  /**
   * Randevu Iptal Onay Islem Fonksiyonu
   */
  const handleConfirmCancel = async () => {
    if (!cancellingAppointment) return;

    try {
      setIsCancelling(true);
      setToastMessage(null);
      await appointmentService.cancel(cancellingAppointment.id);
      setToastMessage({
        type: 'success',
        text: 'Randevunuz başarıyla iptal edildi.',
      });
      setCancellingAppointment(null);
      await fetchMyAppointments();
    } catch (err) {
      setToastMessage({ type: 'error', text: getErrorMessage(err) });
    } finally {
      setIsCancelling(false);
    }
  };

  /**
   * Filtrelenmis randevu listesi
   */
  const filteredAppointments = useMemo(() => {
    if (filter === 'ALL') return appointments;
    return appointments.filter((apt) => apt.status === filter);
  }, [appointments, filter]);

  /**
   * Randevu durum rozeti uretici
   */
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Onaylandı
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Onay Bekliyor
          </span>
        );
      case 'CANCELLED':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-800 border border-red-200">
            <X className="w-3.5 h-3.5" /> İptal Edildi
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Baslik ve Randevu Al Butonu */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 mb-2">
            <User className="w-3.5 h-3.5" /> Hasta Portali
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Hoş Geldiniz, {user?.name}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Randevularınızı takip edebilir veya istediğiniz doktordan anında yeni randevu oluşturabilirsiniz.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchMyAppointments}
            title="Yenile"
            className="p-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl shadow-sm transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <Link
            to="/appointments/book"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-3 rounded-xl shadow-sm hover:shadow transition"
          >
            <PlusCircle className="w-4 h-4" /> Yeni Randevu Al
          </Link>
        </div>
      </div>

      {/* Bildirim (Toast / Alert) */}
      {toastMessage && (
        <div
          className={`flex items-center justify-between p-4 rounded-xl text-sm mb-6 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
            )}
            <span className="font-medium">{toastMessage.text}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filtre Tablari */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
            filter === 'ALL'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Tüm Randevular ({appointments.length})
        </button>
        <button
          onClick={() => setFilter('CONFIRMED')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
            filter === 'CONFIRMED'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Onaylananlar ({appointments.filter((a) => a.status === 'CONFIRMED').length})
        </button>
        <button
          onClick={() => setFilter('PENDING')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
            filter === 'PENDING'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Bekleyenler ({appointments.filter((a) => a.status === 'PENDING').length})
        </button>
        <button
          onClick={() => setFilter('CANCELLED')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
            filter === 'CANCELLED'
              ? 'bg-red-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          İptal Edilenler ({appointments.filter((a) => a.status === 'CANCELLED').length})
        </button>
      </div>

      {/* Randevu Listesi */}
      {isLoading ? (
        <LoadingSpinner size="lg" text="Randevularınız getiriliyor..." />
      ) : filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-800">
            {filter === 'ALL'
              ? 'Henüz randevunuz bulunmuyor'
              : 'Bu kategoride randevu kaydı bulunamadı'}
          </h3>
          <p className="text-sm text-slate-500 mt-1 mb-6">
            Dilediğiniz branş ve doktordan kolayca randevu alabilirsiniz.
          </p>
          <Link
            to="/appointments/book"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" /> Randevu Oluştur
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAppointments.map((apt) => {
            const isCancelable = apt.status !== 'CANCELLED';

            return (
              <div
                key={apt.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                      <Building className="w-3 h-3" /> {apt.departmentName}
                    </span>
                    {renderStatusBadge(apt.status)}
                  </div>

                  <h3 className="font-bold text-slate-900 text-lg mb-1">{apt.doctorName}</h3>
                  <p className="text-xs text-slate-400">Randevu No: #{apt.id}</p>

                  <div className="space-y-2 mt-4 pt-4 border-t border-slate-100 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-slate-800">
                        {new Date(apt.appointmentDate).toLocaleDateString('tr-TR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-slate-900">
                        Saat:{' '}
                        {new Date(apt.appointmentDate).toLocaleTimeString('tr-TR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {isCancelable && (
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setCancellingAppointment(apt)}
                      className="w-full text-center text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 py-2.5 rounded-xl border border-red-200 transition"
                    >
                      Randevuyu İptal Et
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Iptal Onay Modali (Confirmation Modal) */}
      {cancellingAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">Randevuyu İptal Et</h3>
              <p className="text-sm text-slate-500 mt-1">
                Bu randevuyu iptal etmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
              </p>
            </div>

            {/* Randevu Bilgi Ozeti */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1.5 text-slate-700">
              <div>
                <span className="font-semibold text-slate-900">Doktor:</span>{' '}
                {cancellingAppointment.doctorName}
              </div>
              <div>
                <span className="font-semibold text-slate-900">Bölüm:</span>{' '}
                {cancellingAppointment.departmentName}
              </div>
              <div>
                <span className="font-semibold text-slate-900">Tarih & Saat:</span>{' '}
                {new Date(cancellingAppointment.appointmentDate).toLocaleString('tr-TR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>

            {/* Aksiyon Butonlari */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancellingAppointment(null)}
                disabled={isCancelling}
                className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={isCancelling}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isCancelling ? (
                  <>
                    <LoadingSpinner size="sm" /> İptal Ediliyor...
                  </>
                ) : (
                  'Evet, İptal Et'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
