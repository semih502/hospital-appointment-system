import api from './api';
import { ApiResponse, JwtResponse, LoginRequest, RegisterRequest } from '../types/auth';

/**
 * Kimlik dogrulama ve kullanici kayit isteklerini yoneten servis.
 */
export const authService = {
  /**
   * Kullanici girisi yapar ve JWT token nesnesi alir.
   */
  login: async (credentials: LoginRequest): Promise<JwtResponse> => {
    const response = await api.post<JwtResponse>('/api/auth/login', credentials);
    return response.data;
  },

  /**
   * Yeni kullanici kaydi olusturur.
   */
  register: async (userData: RegisterRequest): Promise<ApiResponse<JwtResponse>> => {
    const response = await api.post<ApiResponse<JwtResponse>>('/api/auth/register', userData);
    return response.data;
  },
};
