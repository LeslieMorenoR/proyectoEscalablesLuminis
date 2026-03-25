import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Mentor, MentorProfile, MentorSearchFilters } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class MentorService {
  constructor(private apiService: ApiService) {}

  // Obtener todas las mentoras
  getMentors(filters?: MentorSearchFilters): Observable<MentorProfile[]> {
    return this.apiService.get<MentorProfile[]>('mentors', filters);
  }

  // Obtener una mentora por ID
  getMentorById(id: string): Observable<MentorProfile> {
    return this.apiService.get<MentorProfile>(`mentors/${id}`);
  }

  // Crear perfil de mentora
  createMentor(mentorData: Partial<Mentor>): Observable<Mentor> {
    return this.apiService.post<Mentor>('mentors', mentorData);
  }

  // Actualizar perfil de mentora
  updateMentor(id: string, mentorData: Partial<Mentor>): Observable<Mentor> {
    return this.apiService.put<Mentor>(`mentors/${id}`, mentorData);
  }

  // Eliminar perfil de mentora
  deleteMentor(id: string): Observable<void> {
    return this.apiService.delete<void>(`mentors/${id}`);
  }

  // Actualizar disponibilidad
  updateAvailability(id: string, disponibilidad: boolean): Observable<Mentor> {
    return this.apiService.patch<Mentor>(`mentors/${id}/disponibilidad`, { disponibilidad });
  }

  // Obtener mentoras destacadas
  getFeaturedMentors(): Observable<MentorProfile[]> {
    return this.apiService.get<MentorProfile[]>('mentors/featured');
  }
}
