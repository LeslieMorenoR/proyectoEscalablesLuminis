import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface MentorshipRequest {
  _id: string;
  estudianteId: {
    _id: string;
    usuarioId: {
      nombre: string;
      email: string;
      fotoPerfil: string;
    };
    universidad: string;
    carrera: string;
  };
  mentoraId: {
    _id: string;
    usuarioId: {
      nombre: string;
      email: string;
      fotoPerfil: string;
      puesto: string;
    };
    especialidades: Array<{ nombre: string }>;
  };
  mensaje: string;
  estado: 'pendiente' | 'aceptada' | 'rechazada' | 'completada' | 'cancelada';
  fechaSolicitud: string;
  fechaRespuesta?: string;
  fechaCompletada?: string;
  motivoRechazo?: string;
  notas?: string;
  fechaMentoria?: string;
  sesionesRealizadas: number;
}

export interface RequestFilters {
  estado?: string;
  page?: number;
  limit?: number;
}

export interface RequestResponse {
  success: boolean;
  count: number;
  total: number;
  totalPages: number;
  currentPage: number;
  data: MentorshipRequest[];
}

export interface SingleRequestResponse {
  success: boolean;
  data: MentorshipRequest;
}

export interface CreateRequestData {
  mentoraId: string;
  mensaje: string;
  fechaMentoria?: string;
}


@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private apiUrl = `${environment.apiUrl}/requests`;

  constructor(private http: HttpClient) {}

  // Obtener todas las solicitudes (filtradas por rol en backend)
  getRequests(filters?: RequestFilters): Observable<RequestResponse> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.estado) params = params.set('estado', filters.estado);
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
    }

    return this.http.get<RequestResponse>(this.apiUrl, { params });
  }

  // Obtener solicitud por ID
  getRequestById(id: string): Observable<SingleRequestResponse> {
    return this.http.get<SingleRequestResponse>(`${this.apiUrl}/${id}`);
  }

  // Crear solicitud de mentoría (Estudiante)
  createRequest(data: CreateRequestData): Observable<SingleRequestResponse> {
    return this.http.post<SingleRequestResponse>(this.apiUrl, data);
  }

  // Aceptar solicitud (Mentora)
  acceptRequest(id: string): Observable<SingleRequestResponse> {
    return this.http.put<SingleRequestResponse>(`${this.apiUrl}/${id}/accept`, {});
  }

  // Rechazar solicitud (Mentora)
  rejectRequest(id: string, motivo: string): Observable<SingleRequestResponse> {
    return this.http.put<SingleRequestResponse>(`${this.apiUrl}/${id}/reject`, { motivo });
  }

  // Completar mentoría
  completeRequest(id: string): Observable<SingleRequestResponse> {
    return this.http.put<SingleRequestResponse>(`${this.apiUrl}/${id}/complete`, {});
  }

  // Cancelar solicitud (Estudiante)
  cancelRequest(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }

  // Obtener solicitudes pendientes
  getPendingRequests(): Observable<RequestResponse> {
    return this.getRequests({ estado: 'pendiente' });
  }

  // Obtener mentorías activas
  getActiveMentorships(): Observable<RequestResponse> {
    return this.getRequests({ estado: 'aceptada' });
  }

  // Obtener mentorías completadas
  getCompletedMentorships(): Observable<RequestResponse> {
    return this.getRequests({ estado: 'completada' });
  }
  
}