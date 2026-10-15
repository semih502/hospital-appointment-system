import api from './api';
import { Appointment, AppointmentRequest, AppointmentStatusUpdate } from '../types/appointment';
import { ApiResponse } from '../types/auth';

/**
 * Randevu islemleri ve takvim rezerve slot isteklerini yoneten servis.
 */
export const appointmentService = {
  /**
   * Yeni randevu olusturur.
   */
  create: async (data: AppointmentRequest): Promise<Appointment> => {
    const response = await api.post<Appointment>('/api/appointments', data);
    return response.data;
  },

  /**
   * Giris yapan hastanin kendi randevularini getirir.
   */
  getMyPatientAppointments: async (): Promise<Appointment[]> => {
    const response = await api.get<Appointment[]>('/api/appointments/my');
    return response.data;
  },

  /**
   * Giris yapan doktorun kendi randevularini getirir.
   */
  getMyDoctorAppointments: async (): Promise<Appointment[]> => {
    const response = await api.get<Appointment[]>('/api/appointments/doctor/my');
    return response.data;
  },

  /**
   * Admin paneli icin tum randevulari getirir.
   */
  getAll: async (): Promise<Appointment[]> => {
    const response = await api.get<Appointment[]>('/api/appointments');
    return response.data;
  },

  /**
   * Randevu durumunu gunceller (Onayla / Iptal).
   */
  updateStatus: async (id: number, data: AppointmentStatusUpdate): Promise<Appointment> => {
    const response = await api.patch<Appointment>(`/api/appointments/${id}/status`, data);
    return response.data;
  },

  /**
   * Randevuyu iptal eder.
   */
  cancel: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>(`/api/appointments/${id}/cancel`);
    return response.data;
  },

  /**
   * Belirtilen doktorun rezerve edilmis (dolu) saatlerini getirir.
   * Takvim bileseninde unclickable slotlar icin kullanilir.
   */
  getBookedSlots: async (doctorId: number): Promise<string[]> => {
    const response = await api.get<string[]>(`/api/appointments/doctor/${doctorId}/booked-slots`);
    return response.data;
  },
};
