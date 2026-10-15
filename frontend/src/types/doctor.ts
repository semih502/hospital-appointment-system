/**
 * Doktor veri tipleri.
 */
export interface Doctor {
  id: number;
  userId: number;
  name: string;
  email: string;
  departmentId: number;
  departmentName: string;
}

export interface DoctorRequest {
  userId?: number;
  name?: string;
  email?: string;
  password?: string;
  departmentId: number;
}
