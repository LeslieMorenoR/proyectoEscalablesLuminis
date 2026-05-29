import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
interface MentorProfile {
  _id: string;
  aprobada: boolean;
}
interface User {
  _id: string;
  nombre: string;
  email: string;
  rol: string;
  activo: boolean;
  fechaRegistro: Date;
  fotoPerfil?: string;
  mentorProfile?: MentorProfile;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class Users implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  loading = true;
  errorMessage = '';
  successMessage = '';
  
  searchTerm = '';
  filterRole = '';
  filterStatus = '';

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.errorMessage = '';

    this.http.get<any>(`${this.apiUrl}/users`).subscribe({
      next: (response) => {
        this.users = response.data || [];
        this.filteredUsers = [...this.users];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando usuarios:', error);
        this.errorMessage = 'Error al cargar los usuarios';
        this.loading = false;
      }
    });
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !this.searchTerm || 
        user.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesRole = !this.filterRole || user.rol === this.filterRole;
      const matchesStatus = !this.filterStatus || user.activo.toString() === this.filterStatus;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.filterRole = '';
    this.filterStatus = '';
    this.filteredUsers = [...this.users];
  }

  viewUser(user: User): void {
    console.log('Ver usuario:', user);
    // Implementar navegación a detalle del usuario
  }

  toggleStatus(user: User): void {
    const action = user.activo ? 'desactivar' : 'activar';
    if (confirm(`¿Deseas ${action} a ${user.nombre}?`)) {
      this.http.put<any>(`${this.apiUrl}/users/${user._id}`, { activo: !user.activo })
        .subscribe({
          next: (response) => {
            user.activo = !user.activo;
            this.successMessage = `Usuario ${action === 'desactivar' ? 'desactivado' : 'activado'} exitosamente`;
            setTimeout(() => this.successMessage = '', 3000);
          },
          error: (error) => {
            console.error('Error actualizando usuario:', error);
            this.errorMessage = `Error al ${action} el usuario`;
            setTimeout(() => this.errorMessage = '', 3000);
          }
        });
    }
  }


approveMentor(user: User): void {

  const mentorId = user.mentorProfile?._id;

  if (!mentorId) {

    Swal.fire({
      icon: 'error',
      title: 'Perfil no encontrado',
      text: 'La mentora no tiene un perfil válido.',

      background: '#1e1b4b',
      color: '#fff',

      confirmButtonColor: '#ef4444'
    });

    return;
  }

  Swal.fire({
    title: `¿Aprobar a ${user.nombre}?`,
    text: 'La mentora podrá recibir solicitudes.',
    icon: 'question',

    background: '#1e1b4b',
    color: '#fff',

    showCancelButton: true,

    confirmButtonText: 'Sí, aprobar',
    cancelButtonText: 'Cancelar',

    confirmButtonColor: '#8b5cf6',
    cancelButtonColor: '#6b7280'

  }).then((result) => {

    if (result.isConfirmed) {

      this.http.put(
        `${this.apiUrl}/mentors/${mentorId}/approve`,
        {}
      ).subscribe({

        next: () => {

          if (user.mentorProfile) {
            user.mentorProfile.aprobada = true;
          }

          Swal.fire({
            icon: 'success',
            title: 'Mentora aprobada ✨',
            text: `${user.nombre} ahora puede recibir solicitudes.`,

            background: '#1e1b4b',
            color: '#fff',

            confirmButtonColor: '#8b5cf6'
          });

        },

        error: (error) => {

          console.error(error);

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo aprobar la mentora.',

            background: '#1e1b4b',
            color: '#fff',

            confirmButtonColor: '#ef4444'
          });

        }

      });

    }

  });

}
  deleteUser(user: User): void {

  Swal.fire({
    title: `¿Eliminar a ${user.nombre}?`,
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',

    background: '#1e1b4b',
    color: '#fff',

    showCancelButton: true,

    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',

    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'

  }).then((result) => {

    if (result.isConfirmed) {

      this.http.delete<any>(`${this.apiUrl}/users/${user._id}`)
        .subscribe({

          next: () => {

            this.users = this.users.filter(u => u._id !== user._id);

            this.filterUsers();

            Swal.fire({
              icon: 'success',
              title: 'Usuario eliminado',
              text: 'El usuario fue eliminado exitosamente ✨',

              background: '#1e1b4b',
              color: '#fff',

              confirmButtonColor: '#8b5cf6'
            });

          },

          error: (error) => {

            console.error('Error eliminando usuario:', error);

            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar el usuario',

              background: '#1e1b4b',
              color: '#fff',

              confirmButtonColor: '#ef4444'
            });

          }

        });

    }

  });

}
}