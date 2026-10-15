/**
 * Kullanici rolleri ve kimlik dogrulama tipleri.
 */
export type Role = 'ADMIN' | 'DOCTOR' | 'PATIENT';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

export interface JwtResponse {
  token: string;
  type: string;
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  validationErrors?: Record<string, string>;
}
