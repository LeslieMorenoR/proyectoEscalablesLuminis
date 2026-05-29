import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Student {
  _id: string;
  usuarioId: {
    _id: string;
    nombre: string;
    email: string;
    fotoPerfil: string;
    biografia?: string;
  };
  areasInteres: Array<{
    _id: string;
    nombre: string;
    descripcion: string;
    icono: string;
  }>;
  universidad: string;
  carrera: string;
  semestre: number;
  objetivos?: string;
  mentoriasActivas: number;
  mentoriasCompletadas: number;
  createdAt: string;
  updatedAt: string;
}

export interface StudentFilters {
  universidad?: string;
  carrera?: string;
  areaInteres?: string;
  page?: number;
  limit?: number;
}

export interface StudentResponse {
  success: boolean;
  count: number;
  total: number;
  totalPages: number;
  currentPage: number;
  data: Student[];
}

export interface SingleStudentResponse {
  success: boolean;
  data: Student;
}

export interface CreateStudentData {
  areasInteres: string[];
  universidad: string;
  carrera: string;
  semestre: number;
  objetivos?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = `${environment.apiUrl}/students`;

  constructor(private http: HttpClient) {}

  // Obtener todos los estudiantes (Admin)
  getStudents(filters?: StudentFilters): Observable<StudentResponse> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.universidad) params = params.set('universidad', filters.universidad);
      if (filters.carrera) params = params.set('carrera', filters.carrera);
      if (filters.areaInteres) params = params.set('areaInteres', filters.areaInteres);
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
    }

    return this.http.get<StudentResponse>(this.apiUrl, { params });
  }

  // Obtener estudiante por ID
  getStudentById(id: string): Observable<SingleStudentResponse> {
    return this.http.get<SingleStudentResponse>(`${this.apiUrl}/${id}`);
  }

  // Crear perfil de estudiante
  createStudent(data: CreateStudentData): Observable<SingleStudentResponse> {
    return this.http.post<SingleStudentResponse>(this.apiUrl, data);
  }

  // Actualizar perfil de estudiante
  updateStudent(id: string, data: Partial<CreateStudentData>): Observable<SingleStudentResponse> {
    return this.http.put<SingleStudentResponse>(`${this.apiUrl}/${id}`, data);
  }

  // Eliminar estudiante
  deleteStudent(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }
  getMyProfile(): Observable<SingleStudentResponse> {
  return this.http.get<SingleStudentResponse>(
    `${this.apiUrl}/me`
  );
}
}
