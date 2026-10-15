/**
 * Randevu veri tipleri ve durumlari.
 */
export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export interface Appointment {
  id: number;
  patientId: number;
  patientName: string;
  patientEmail: string;
  doctorId: number;
  doctorName: string;
  departmentName: string;
  appointmentDate: string; // ISO string 'YYYY-MM-DDTHH:mm:ss'
  status: AppointmentStatus;
  version: number;
  createdAt: string;
}

export interface AppointmentRequest {
  doctorId: number;
  appointmentDate: string; // ISO string
}

export interface AppointmentStatusUpdate {
  status: AppointmentStatus;
}
