import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface Area {
  _id: string;
  nombre: string;
  icono: string;
  descripcion?: string;
}

interface Student {
  _id: string;
  usuarioId: {
    _id: string;
    nombre: string;
    email: string;
    fotoPerfil: string;
    biografia?: string;
  };
  areasInteres: Area[];
  universidad: string;
  carrera: string;
  semestre: number;
  objetivos?: string;
  mentoriasActivas: number;
  mentoriasCompletadas: number;
  createdAt: string;
}

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {

  student!: Student;
  areas: Area[] = [];

  formData = {
    areasInteres: [] as string[],
    universidad:  '',
    carrera:      '',
    semestre:     1,
    objetivos:    ''
  };

  loading        = true;
  saving         = false;
  successMessage = '';
  errorMessage   = '';
  previewUrl: string | null = null;

  private selectedFile: File | null = null;
  private readonly apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadAreas();
  }

  // ─── Cargar perfil ────────────────────────────────────────

  loadProfile(): void {
    this.loading = true;
    this.errorMessage = '';

    this.http.get<any>(`${this.apiUrl}/students/me`).subscribe({
      next: (response) => {
        this.student = response.data;
        this.formData = {
          areasInteres: this.student.areasInteres.map((a: Area) => a._id),
          universidad:  this.student.universidad  ?? '',
          carrera:      this.student.carrera      ?? '',
          semestre:     this.student.semestre     ?? 1,
          objetivos:    this.student.objetivos    ?? ''
        };
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando perfil:', error);
        this.errorMessage = 'Error al cargar el perfil';
        this.loading = false;
      }
    });
  }

  // ─── Cargar áreas disponibles ─────────────────────────────

  loadAreas(): void {
    this.http.get<any>(`${this.apiUrl}/areas`).subscribe({
      next: (response) => {
        this.areas = response.data || [];
      },
      error: (error) => {
        console.error('Error cargando áreas:', error);
      }
    });
  }

  // ─── Foto de perfil ───────────────────────────────────────

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.selectedFile = input.files[0];

    const reader  = new FileReader();
    reader.onload = () => (this.previewUrl = reader.result as string);
    reader.readAsDataURL(this.selectedFile);
  }

  private uploadPhoto(onDone: () => void): void {
    if (!this.selectedFile) {
      onDone();
      return;
    }

    const form = new FormData();
    form.append('foto', this.selectedFile);

    this.http.post<any>(`${this.apiUrl}/users/upload-photo`, form).subscribe({
      next: () => {
        this.selectedFile = null;
        this.previewUrl   = null;
        onDone();
      },
      error: (error) => {
        console.error('Error subiendo foto:', error);
        // Continuamos aunque falle la foto
        onDone();
      }
    });
  }

  // ─── Guardar cambios ──────────────────────────────────────

  updateProfile(): void {
    this.saving        = true;
    this.errorMessage  = '';
    this.successMessage = '';

    // Primero sube la foto (si hay), luego actualiza el perfil
    this.uploadPhoto(() => {

      this.http
        .put<any>(`${this.apiUrl}/students/${this.student._id}`, this.formData)
        .subscribe({
          next: (response) => {
            this.student = response.data;
            this.successMessage = '¡Perfil actualizado correctamente!';
            this.saving = false;
            setTimeout(() => (this.successMessage = ''), 3000);
          },
          error: (error) => {
            console.error('Error actualizando perfil:', error);
            this.errorMessage = error?.error?.message ?? 'Error al actualizar el perfil';
            this.saving = false;
            setTimeout(() => (this.errorMessage = ''), 3000);
          }
        });

    });
  }
}