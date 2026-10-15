import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { departmentService } from '../services/departmentService';
import { doctorService } from '../services/doctorService';
import { appointmentService } from '../services/appointmentService';
import { Department } from '../types/department';
import { Doctor } from '../types/doctor';
import { getErrorMessage } from '../services/api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  Calendar as CalendarIcon,
  Clock,
  Building,
  User,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const AppointmentBookingPage: React.FC = () => {
  const navigate = useNavigate();

  // 1. Departman ve Doktor Durumlari
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | ''>('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | ''>('');

  // 2. Tarih ve Saat Slot Durumlari
  // Gecmis tarihler secilemez (Bugun minimum tarihtir)
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // 3. UI Yukleme ve Hata Durumlari
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isConflictError, setIsConflictError] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /**
   * 09:00 - 17:00 arasinda 30'ar dakikalik randevu slotlari uretici
   */
  const availableSlots = useMemo(() => {
    const slots: string[] = [];
    const startHour = 9;
    const endHour = 17; // 17:00 son seans baslangici
    for (let h = startHour; h < endHour; h++) {
      const hh = h < 10 ? `0${h}` : `${h}`;
      slots.push(`${hh}:00`);
      slots.push(`${hh}:30`);
    }
    return slots;
  }, []);

  // Ilk yuklemede departmanlari getir
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        setIsLoadingDepartments(true);
        const data = await departmentService.getAll();
        setDepartments(data);
      } catch (err) {
        setErrorMessage(getErrorMessage(err));
      } finally {
        setIsLoadingDepartments(false);
      }
    };
    loadDepartments();
  }, []);

  // Departman secildiginde bagli doktorlari getir
  useEffect(() => {
    if (!selectedDepartmentId) {
      setDoctors([]);
      setSelectedDoctorId('');
      return;
    }

    const loadDoctors = async () => {
      try {
        setIsLoadingDoctors(true);
        setSelectedDoctorId('');
        setSelectedSlot(null);
        const data = await doctorService.getByDepartment(Number(selectedDepartmentId));
        setDoctors(data);
      } catch (err) {
        setErrorMessage(getErrorMessage(err));
      } finally {
        setIsLoadingDoctors(false);
      }
    };
    loadDoctors();
  }, [selectedDepartmentId]);

  /**
   * Belirtilen doktorun rezerve edilmis (dolu) saatlerini backend'den ceken fonksiyon
   */
  const fetchBookedSlots = useCallback(async (docId: number) => {
    try {
      setIsLoadingSlots(true);
      const data = await appointmentService.getBookedSlots(docId);
      setBookedSlots(data);
    } catch (err) {
      console.error('Dolu slotlar alinirken hata olustu:', err);
    } finally {
      setIsLoadingSlots(false);
    }
  }, []);

  // Doktor veya Tarih degistiginde dolu saatleri guncelle
  useEffect(() => {
    if (selectedDoctorId) {
      fetchBookedSlots(Number(selectedDoctorId));
      setSelectedSlot(null);
    } else {
      setBookedSlots([]);
      setSelectedSlot(null);
    }
  }, [selectedDoctorId, selectedDate, fetchBookedSlots]);

  /**
   * Belirli bir saatin rezerve edilmis veya gecmis saat olup olmadigini denetler
   */
  const checkSlotStatus = (slotTime: string): { isBooked: boolean; isPast: boolean } => {
    // 1. Backend'den gelen dolu saatlerle eslesme kontrolu
    const targetPrefix = `${selectedDate}T${slotTime}`;
    const isBooked = bookedSlots.some((s) => s.startsWith(targetPrefix));

    // 2. Gecmis zaman kontrolu (Eger bugun secildiyse ve saat gecmisse)
    let isPast = false;
    if (selectedDate === todayStr) {
      const now = new Date();
      const [slotHours, slotMinutes] = slotTime.split(':').map(Number);
      const slotDate = new Date();
      slotDate.setHours(slotHours, slotMinutes, 0, 0);
      isPast = slotDate <= now;
    }

    return { isBooked, isPast };
  };

  /**
   * Randevu Kaydetme ve Eşzamanlılık Çarpışması (Optimistic Lock) Yönetimi
   */
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctorId || !selectedDate || !selectedSlot) {
      setErrorMessage('Lütfen doktor, tarih ve saat seçimini eksiksiz yapınız.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setIsConflictError(false);

    try {
      const appointmentDate = `${selectedDate}T${selectedSlot}:00`;

      await appointmentService.create({
        doctorId: Number(selectedDoctorId),
        appointmentDate,
      });

      setSuccessMessage('Randevunuz başarıyla oluşturuldu! Randevularım sayfasına yönlendiriliyorsunuz...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1800);
    } catch (err: unknown) {
      // Axios hata nesnesinden 409 Conflict durumunu kontrol et
      const is409 = (err as { response?: { status?: number } })?.response?.status === 409;
      const parsedError = getErrorMessage(err);

      if (is409) {
        setIsConflictError(true);
        setErrorMessage(
          'Bu randevu saati az önce başka bir hasta tarafından rezerve edildi! Takvim slotları güncellendi, lütfen başka bir saat seçiniz.'
        );
        // CRITICAL: Slot listesini aninda arkadan tekrar cek ve cakisan saati ekrandan kaldir!
        await fetchBookedSlots(Number(selectedDoctorId));
        setSelectedSlot(null);
      } else {
        setErrorMessage(parsedError);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedDoctorObj = doctors.find((d) => d.id === Number(selectedDoctorId));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Sayfa Basligi */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <CalendarIcon className="w-8 h-8 text-blue-600" />
          Randevu Oluştur
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Bölüm, doktor ve uygun zaman dilimini seçerek randevunuzu kolayca planlayabilirsiniz.
        </p>
      </div>

      {/* Basari Mesaji Toast / Banner */}
      {successMessage && (
        <div className="mb-6 flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl shadow-sm">
          <CheckCircle2 className="w-6 h-6 flex-shrink-0 text-emerald-600" />
          <div className="font-semibold text-sm">{successMessage}</div>
        </div>
      )}

      {/* Optimistic Lock / Cakisik Randevu Uyari Karti */}
      {isConflictError && errorMessage && (
        <div className="mb-6 flex items-start gap-3 p-4 bg-amber-50 border border-amber-300 text-amber-900 rounded-2xl shadow-sm animate-pulse">
          <ShieldAlert className="w-6 h-6 flex-shrink-0 text-amber-600 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Çakışma Tespit Edildi (Eşzamanlı Rezervasyon)</h4>
            <p className="text-xs sm:text-sm mt-0.5 font-medium">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Genel Hata Karti (Eger 409 degilse) */}
      {!isConflictError && errorMessage && (
        <div className="mb-6 flex items-start gap-2.5 p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl shadow-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
          <div className="text-sm font-medium">{errorMessage}</div>
        </div>
      )}

      <form onSubmit={handleBookingSubmit} className="space-y-8">
        {/* ADIM 1 & 2: Departman ve Doktor Secimi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
          {/* Departman */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-600" /> 1. Tıbbi Bölüm (Departman)
            </label>
            {isLoadingDepartments ? (
              <LoadingSpinner size="sm" text="Bölümler yükleniyor..." />
            ) : (
              <select
                value={selectedDepartmentId}
                onChange={(e) => setSelectedDepartmentId(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
              >
                <option value="">-- Lütfen Bölüm Seçiniz --</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name} ({dept.doctorCount} Doktor)
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Doktor */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" /> 2. Uzman Doktor
            </label>
            {isLoadingDoctors ? (
              <LoadingSpinner size="sm" text="Doktorlar getiriliyor..." />
            ) : (
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value ? Number(e.target.value) : '')}
                disabled={!selectedDepartmentId || doctors.length === 0}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {!selectedDepartmentId
                    ? '-- Önce Departman Seçiniz --'
                    : doctors.length === 0
                    ? 'Bu bölümde henüz doktor bulunmuyor'
                    : '-- Lütfen Doktor Seçiniz --'}
                </option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} ({doc.email})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* ADIM 3: Tarih Secimi */}
        {selectedDoctorId && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-blue-600" /> 3. Randevu Tarihi
                </label>
                <p className="text-xs text-slate-400 mt-0.5">Geçmiş tarihler randevuya kapalıdır.</p>
              </div>

              <input
                type="date"
                min={todayStr}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
              />
            </div>
          </div>
        )}

        {/* ADIM 4: Dinamik Saat Slot Secici (Time Slot Picker) */}
        {selectedDoctorId && selectedDate && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" /> 4. Randevu Saati Seçimi
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Gri ve üzeri çizili butonlar başka hastalarca doldurulmuş seansları temsil eder.
                </p>
              </div>

              {/* Slot Renk Lejanti */}
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-3 h-3 rounded bg-white border border-slate-300 inline-block"></span> Müsait
                </span>
                <span className="flex items-center gap-1.5 text-blue-600 font-semibold">
                  <span className="w-3 h-3 rounded bg-blue-600 inline-block"></span> Seçili
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-3 h-3 rounded bg-slate-100 border border-slate-200 inline-block"></span> Dolu / Kapalı
                </span>
              </div>
            </div>

            {isLoadingSlots ? (
              <div className="py-8">
                <LoadingSpinner size="md" text="Doktorun rezerve saatleri taranıyor..." />
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {availableSlots.map((slot) => {
                  const { isBooked, isPast } = checkSlotStatus(slot);
                  const isDisabled = isBooked || isPast;
                  const isSelected = selectedSlot === slot;

                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => setSelectedSlot(slot)}
                      title={
                        isBooked
                          ? 'Bu saat dilimi rezerve edilmiştir'
                          : isPast
                          ? 'Geçmiş saat dilimi seçilemez'
                          : `${slot} randevusunu seç`
                      }
                      className={`py-3 px-2 rounded-xl text-sm font-semibold transition flex flex-col items-center justify-center relative ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-600 ring-offset-2'
                          : isDisabled
                          ? 'bg-slate-100 text-slate-400 border border-slate-200 line-through cursor-not-allowed opacity-60'
                          : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 hover:text-blue-700 active:scale-95'
                      }`}
                    >
                      <span>{slot}</span>
                      {isBooked && (
                        <span className="text-[10px] text-red-500 font-normal no-underline mt-0.5">Dolu</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Randevu Ozeti ve Onay Butonu */}
        {selectedDoctorId && selectedSlot && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div>
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Randevu Özeti</p>
              <h4 className="text-lg font-bold text-slate-900 mt-0.5">
                {selectedDoctorObj?.name} - {selectedDoctorObj?.departmentName}
              </h4>
              <p className="text-sm text-slate-600 flex items-center gap-3 mt-1">
                <span className="inline-flex items-center gap-1 font-medium text-slate-800">
                  <CalendarIcon className="w-4 h-4 text-blue-600" />
                  {new Date(selectedDate).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    weekday: 'long',
                  })}
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-blue-900">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Saat: {selectedSlot}
                </span>
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" />
                  Randevu Onaylanıyor...
                </>
              ) : (
                <>
                  Randevuyu Onayla <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
