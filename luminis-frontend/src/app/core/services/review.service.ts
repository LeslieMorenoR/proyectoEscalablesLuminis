import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Review {
  _id: string;
  solicitudId: string;
  estudianteId: {
    _id: string;
    usuarioId: {
      nombre: string;
      fotoPerfil: string;
    };
  };
  mentoraId: string;
  calificacion: number;
  comentario: string;
  visible: boolean;
  reportada: boolean;
  motivoReporte?: string;
  fechaCreacion: string;
  createdAt: string;
  updatedAt: string;
  fechaMentoria?: string;
}

export interface ReviewStats {
  promedio: number;
  total: number;
  cinco: number;
  cuatro: number;
  tres: number;
  dos: number;
  uno: number;
}

export interface ReviewResponse {
  success: boolean;
  count: number;
  total: number;
  totalPages: number;
  currentPage: number;
  stats: ReviewStats;
  data: Review[];
}

export interface SingleReviewResponse {
  success: boolean;
  data: Review;
}

export interface CreateReviewData {
  solicitudId: string;
  calificacion: number;
  comentario: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = `${environment.apiUrl}/reviews`;

  constructor(private http: HttpClient) {}

  // Obtener reseñas de una mentora
  getReviewsByMentor(
    mentorId: string, 
    page: number = 1, 
    limit: number = 10,
    visible: boolean = true
  ): Observable<ReviewResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('visible', visible.toString());

    return this.http.get<ReviewResponse>(`${this.apiUrl}/mentor/${mentorId}`, { params });
  }

  // Obtener reseña por ID
  getReviewById(id: string): Observable<SingleReviewResponse> {
    return this.http.get<SingleReviewResponse>(`${this.apiUrl}/${id}`);
  }

  // Crear reseña (Estudiante)
  createReview(data: CreateReviewData): Observable<SingleReviewResponse> {
    return this.http.post<SingleReviewResponse>(this.apiUrl, data);
  }

  // Actualizar reseña (Estudiante)
  updateReview(id: string, data: Partial<CreateReviewData>): Observable<SingleReviewResponse> {
    return this.http.put<SingleReviewResponse>(`${this.apiUrl}/${id}`, data);
  }

  // Cambiar visibilidad de reseña (Admin)
  toggleVisibility(id: string): Observable<SingleReviewResponse> {
    return this.http.put<SingleReviewResponse>(`${this.apiUrl}/${id}/visibility`, {});
  }

  // Eliminar reseña
  deleteReview(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }
}