import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/authStore';
import { ApiError } from '../types/auth';

/**
 * Backend ile iletisimi saglayan ozellestirilmis Axios ornegi.
 * Otomatik Bearer token ekleme ve 401 Unauthorized durumlarinda
 * oturumu sifirlayip login'e yonlendirme mantigini barindirir.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * REQUEST INTERCEPTOR:
 * Zustand store icerisinde token varsa her istege otomatik 'Authorization: Bearer <token>' basligini ekler.
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR:
 * Eger backend 401 (Unauthorized) kodu donerse:
 * 1. Zustand ve localStorage oturumunu sifirla (logout).
 * 2. Kullaniciyi login sayfasina yonlendir.
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<ApiError>) => {
    if (error.response && error.response.status === 401) {
      console.warn('Oturum suresi doldu veya yetkisiz istek (401). Login sayfasina yonlendiriliyor...');

      const logout = useAuthStore.getState().logout;
      logout();

      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

/**
 * API hata yanitlarini standart metne donusturen yardimci fonksiyon.
 */
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiError | undefined;
    if (apiError?.validationErrors) {
      return Object.values(apiError.validationErrors).join(', ');
    }
    return apiError?.message || error.message || 'Bir ag hatasi meydana geldi.';
  }
  return error instanceof Error ? error.message : 'Bilinmeyen bir hata olustu.';
};

export default api;
