import React, { useEffect, useState } from 'react';
import { appointmentService } from '../services/appointmentService';
import { departmentService } from '../services/departmentService';
import { doctorService } from '../services/doctorService';
import { Appointment } from '../types/appointment';
import { Department } from '../types/department';
import { Doctor } from '../types/doctor';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { getErrorMessage } from '../services/api';
import { ShieldCheck, Calendar, Users, Building, AlertCircle } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdminData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [aptData, deptData, docData] = await Promise.all([
        appointmentService.getAll(),
        departmentService.getAll(),
        doctorService.getAll(),
      ]);
      setAppointments(aptData);
      setDepartments(deptData);
      setDoctors(docData);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 mb-2">
          <ShieldCheck className="w-3.5 h-3.5" /> Yönetici Portali
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Sistem Yönetim Paneli
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Hastanenin tüm operasyonel randevularını, uzman doktorlarını ve departmanlarını buradan denetleyebilirsiniz.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 text-red-800 border border-red-200 rounded-xl text-sm mb-6">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Istatistik Kartlari */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Toplam Randevu</p>
            <p className="text-2xl font-bold text-slate-900">{appointments.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Aktif Doktor Sayısı</p>
            <p className="text-2xl font-bold text-slate-900">{doctors.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Departman Sayısı</p>
            <p className="text-2xl font-bold text-slate-900">{departments.length}</p>
          </div>
        </div>
      </div>

      {/* Randevular Tablosu */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Son Sistem Randevuları</h2>
          <span className="text-xs text-slate-400 font-medium">Toplam {appointments.length} kayıt</span>
        </div>

        {isLoading ? (
          <div className="py-12">
            <LoadingSpinner size="md" text="Veriler yükleniyor..." />
          </div>
        ) : appointments.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">Sistemde henüz randevu kaydı bulunmuyor.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs font-semibold text-slate-600 uppercase border-b border-slate-200">
                  <th className="py-3.5 px-6">ID</th>
                  <th className="py-3.5 px-6">Hasta</th>
                  <th className="py-3.5 px-6">Doktor & Bölüm</th>
                  <th className="py-3.5 px-6">Tarih</th>
                  <th className="py-3.5 px-6">Durum</th>
                  <th className="py-3.5 px-6">Lock Versiyonu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-6 font-mono text-xs text-slate-500">#{apt.id}</td>
                    <td className="py-3.5 px-6">
                      <div className="font-semibold text-slate-900">{apt.patientName}</div>
                      <div className="text-xs text-slate-400">{apt.patientEmail}</div>
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="font-medium text-slate-800">{apt.doctorName}</div>
                      <div className="text-xs text-blue-600">{apt.departmentName}</div>
                    </td>
                    <td className="py-3.5 px-6 text-slate-700">
                      {new Date(apt.appointmentDate).toLocaleString('tr-TR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                          apt.status === 'CONFIRMED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : apt.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 font-mono text-xs text-slate-400">v{apt.version}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
