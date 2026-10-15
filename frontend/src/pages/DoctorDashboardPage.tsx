import React, { useEffect, useState } from 'react';
import { appointmentService } from '../services/appointmentService';
import { Appointment } from '../types/appointment';
import { useAuthStore } from '../store/authStore';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { getErrorMessage } from '../services/api';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, Stethoscope } from 'lucide-react';

export const DoctorDashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchDoctorAppointments = async () => {
    try {
      setIsLoading(true);
      const data = await appointmentService.getMyDoctorAppointments();
      setAppointments(data);
    } catch (err) {
      setMessage({ type: 'error', text: getErrorMessage(err) });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorAppointments();
  }, []);

  const handleStatusUpdate = async (appointmentId: number, newStatus: 'CONFIRMED' | 'CANCELLED') => {
    try {
      setActionLoading(appointmentId);
      setMessage(null);
      await appointmentService.updateStatus(appointmentId, { status: newStatus });
      setMessage({
        type: 'success',
        text: `Randevu başarıyla ${newStatus === 'CONFIRMED' ? 'onaylandı' : 'iptal edildi'}.`,
      });
      await fetchDoctorAppointments();
    } catch (err) {
      setMessage({ type: 'error', text: getErrorMessage(err) });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 mb-2">
            <Stethoscope className="w-3.5 h-3.5" /> Doktor Portali
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Hoş Geldiniz, {user?.name}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Size randevu almış hastalarınızı görüntüleyebilir, randevuları onaylayabilir veya iptal edebilirsiniz.
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2 p-4 rounded-xl text-sm mb-6 ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {isLoading ? (
        <LoadingSpinner size="lg" text="Randevular yükleniyor..." />
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-800">Henüz randevu bulunmuyor</h3>
          <p className="text-sm text-slate-500 mt-1">Hastalar randevu aldığında burada listelenecektir.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <th className="py-4 px-6">Hasta Bilgileri</th>
                  <th className="py-4 px-6">Tarih & Saat</th>
                  <th className="py-4 px-6">Durum</th>
                  <th className="py-4 px-6 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-900">{apt.patientName}</div>
                      <div className="text-xs text-slate-500">{apt.patientEmail}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        {new Date(apt.appointmentDate).toLocaleDateString('tr-TR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(apt.appointmentDate).toLocaleTimeString('tr-TR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {apt.status === 'CONFIRMED' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                          Onaylandı
                        </span>
                      )}
                      {apt.status === 'PENDING' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                          Beklemede
                        </span>
                      )}
                      {apt.status === 'CANCELLED' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                          İptal Edildi
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      {apt.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(apt.id, 'CONFIRMED')}
                            disabled={actionLoading === apt.id}
                            className="inline-flex items-center gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Onayla
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(apt.id, 'CANCELLED')}
                            disabled={actionLoading === apt.id}
                            className="inline-flex items-center gap-1 text-xs bg-red-50 hover:bg-red-100 text-red-700 font-medium px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reddet
                          </button>
                        </>
                      )}
                      {apt.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleStatusUpdate(apt.id, 'CANCELLED')}
                          disabled={actionLoading === apt.id}
                          className="inline-flex items-center gap-1 text-xs text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition disabled:opacity-50"
                        >
                          İptal Et
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
