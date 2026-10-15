import api from './api';
import { Department, DepartmentRequest } from '../types/department';
import { ApiResponse } from '../types/auth';

/**
 * Departman API isteklerini yoneten servis.
 */
export const departmentService = {
  getAll: async (): Promise<Department[]> => {
    const response = await api.get<Department[]>('/api/departments');
    return response.data;
  },

  getById: async (id: number): Promise<Department> => {
    const response = await api.get<Department>(`/api/departments/${id}`);
    return response.data;
  },

  create: async (data: DepartmentRequest): Promise<Department> => {
    const response = await api.post<Department>('/api/departments', data);
    return response.data;
  },

  update: async (id: number, data: DepartmentRequest): Promise<Department> => {
    const response = await api.put<Department>(`/api/departments/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`/api/departments/${id}`);
    return response.data;
  },
};
