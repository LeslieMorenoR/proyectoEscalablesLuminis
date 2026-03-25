// Enums
export enum UserRole {
  VISITANTE = 'visitante',
  ESTUDIANTE = 'estudiante',
  MENTORA = 'mentora',
  ADMINISTRADOR = 'administrador'
}

export enum MentorshipStatus {
  PENDIENTE = 'pendiente',
  ACEPTADA = 'aceptada',
  RECHAZADA = 'rechazada',
  COMPLETADA = 'completada'
}

// Interfaces
export interface User {
  _id?: string;
  nombre: string;
  email: string;
  password?: string;
  rol: UserRole;
  fotoPerfil?: string;
  biografia?: string;
  telefono?: string;
  fechaRegistro?: Date;
  activo?: boolean;
}

export interface Area {
  _id?: string;
  nombre: string;
  descripcion: string;
  icono?: string;
  activa?: boolean;
  orden?: number;
}

export interface Mentor {
  _id?: string;
  usuarioId: string | User;
  especialidades: string[] | Area[];
  experiencia: number;
  educacion?: string;
  empresa?: string;
  puesto?: string;
  linkedIn?: string;
  disponibilidad: boolean;
  calificacionPromedio?: number;
  totalMentorias?: number;
  aprobada: boolean;
}

export interface Student {
  _id?: string;
  usuarioId: string | User;
  areasInteres: string[] | Area[];
  universidad?: string;
  carrera?: string;
  semestre?: number;
  objetivos?: string;
}

export interface MentorshipRequest {
  _id?: string;
  estudianteId: string | Student;
  mentoraId: string | Mentor;
  mensaje: string;
  estado: MentorshipStatus;
  fechaSolicitud: Date;
  fechaRespuesta?: Date;
  motivoRechazo?: string;
  notas?: string;
}

export interface Review {
  _id?: string;
  solicitudId: string | MentorshipRequest;
  estudianteId: string | Student;
  mentoraId: string | Mentor;
  calificacion: number; // 1-5
  comentario: string;
  fechaCreacion: Date;
  visible: boolean;
}

// DTOs para Login/Registro
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
  confirmPassword: string;
  rol: UserRole;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresIn?: number;
}

// DTOs para búsqueda de mentoras
export interface MentorSearchFilters {
  especialidad?: string;
  experiencia?: number;
  disponibilidad?: boolean;
  calificacionMinima?: number;
  busqueda?: string;
}

export interface MentorProfile extends Mentor {
  usuario: User;
  reviews: Review[];
}
