import api from './api';
import { Doctor, DoctorRequest } from '../types/doctor';
import { ApiResponse } from '../types/auth';

/**
 * Doktor API isteklerini yoneten servis.
 */
export const doctorService = {
  getAll: async (): Promise<Doctor[]> => {
    const response = await api.get<Doctor[]>('/api/doctors');
    return response.data;
  },

  getById: async (id: number): Promise<Doctor> => {
    const response = await api.get<Doctor>(`/api/doctors/${id}`);
    return response.data;
  },

  getByDepartment: async (departmentId: number): Promise<Doctor[]> => {
    const response = await api.get<Doctor[]>(`/api/doctors/department/${departmentId}`);
    return response.data;
  },

  create: async (data: DoctorRequest): Promise<Doctor> => {
    const response = await api.post<Doctor>('/api/doctors', data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`/api/doctors/${id}`);
    return response.data;
  },
};
