/**
 * Departman veri tipleri.
 */
export interface Department {
  id: number;
  name: string;
  doctorCount: number;
  createdAt?: string;
}

export interface DepartmentRequest {
  name: string;
}
