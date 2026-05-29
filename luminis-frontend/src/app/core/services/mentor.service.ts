import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Mentor {
  _id: string;
  usuarioId: {
    _id: string;
    nombre: string;
    email: string;
    fotoPerfil: string;
    biografia?: string;
    telefono?: string;
  };
  especialidades: Array<{
    _id: string;
    nombre: string;
    descripcion: string;
    icono: string;
  }>;
  experiencia: number;
  educacion: string;
  empresa?: string;
  puesto?: string;
  linkedIn?: string;
  disponibilidad: boolean;
  calificacionPromedio: number;
  totalMentorias: number;
  aprobada: boolean;
  createdAt: string;
  horariosDisponibles?: HorarioDisponible[];
}
export interface HorarioDisponible {

  fecha: string;

  disponible: boolean;

}
export interface MentorFilters {
  especialidad?: string;
  experienciaMin?: number;
  disponibilidad?: boolean;
  calificacionMin?: number;
  page?: number;
  limit?: number;
}

export interface MentorResponse {
  success: boolean;
  count: number;
  total: number;
  totalPages: number;
  currentPage: number;
  data: Mentor[];
}

export interface SingleMentorResponse {
  success: boolean;
  data: Mentor;
}

export interface CreateMentorData {
  especialidades: string[];
  experiencia: number;
  educacion: string;
  empresa?: string;
  puesto?: string;
  linkedIn?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MentorService {
  private apiUrl = `${environment.apiUrl}/mentors`;

  constructor(private http: HttpClient) {}

  // Obtener todas las mentoras con filtros
  getMentors(filters?: MentorFilters): Observable<MentorResponse> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.especialidad) params = params.set('especialidad', filters.especialidad);
      if (filters.experienciaMin) params = params.set('experienciaMin', filters.experienciaMin.toString());
      if (filters.disponibilidad !== undefined) params = params.set('disponibilidad', filters.disponibilidad.toString());
      if (filters.calificacionMin) params = params.set('calificacionMin', filters.calificacionMin.toString());
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
    }

    return this.http.get<MentorResponse>(this.apiUrl, { params });
  }

  // Obtener mentora por ID
  getMentorById(id: string): Observable<SingleMentorResponse> {
    return this.http.get<SingleMentorResponse>(`${this.apiUrl}/${id}`);
  }

  // Crear perfil de mentora
  createMentor(data: CreateMentorData): Observable<SingleMentorResponse> {
    return this.http.post<SingleMentorResponse>(this.apiUrl, data);
  }

  // Actualizar perfil de mentora
  updateMentor(id: string, data: Partial<CreateMentorData>): Observable<SingleMentorResponse> {
    return this.http.put<SingleMentorResponse>(`${this.apiUrl}/${id}`, data);
  }

  // Aprobar mentora (Admin)
  approveMentor(id: string): Observable<SingleMentorResponse> {
    return this.http.put<SingleMentorResponse>(`${this.apiUrl}/${id}/approve`, {});
  }

  // Rechazar mentora (Admin)
  rejectMentor(id: string, motivo: string): Observable<SingleMentorResponse> {
    return this.http.put<SingleMentorResponse>(`${this.apiUrl}/${id}/reject`, { motivo });
  }

  // Eliminar mentora
  deleteMentor(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }

  // Obtener mentoras destacadas (top 5 por calificación)
  getFeaturedMentors(): Observable<MentorResponse> {
    return this.getMentors({ 
      calificacionMin: 4,
      limit: 5,
      disponibilidad: true 
    });
  }
  getMyProfile(): Observable<SingleMentorResponse> {
  return this.http.get<SingleMentorResponse>(
    `${this.apiUrl}/profile/me`
  );
}
}