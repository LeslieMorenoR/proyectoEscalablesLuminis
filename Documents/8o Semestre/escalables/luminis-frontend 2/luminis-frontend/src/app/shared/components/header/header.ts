import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User, UserRole } from '../../../models';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
/* This class named Header implements the OnInit interface in TypeScript. */
 /* The Header class implements the OnInit interface in TypeScript. */
export class Header implements OnInit {
  currentUser: User | null = null;
  isMenuOpen = false;
  UserRole = UserRole;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.isMenuOpen = false;
  }

  navigateToDashboard(): void {
    if (this.currentUser) {
      switch (this.currentUser.rol) {
        case UserRole.ESTUDIANTE:
          this.router.navigate(['/student/dashboard']);
          break;
        case UserRole.MENTORA:
          this.router.navigate(['/mentor/dashboard']);
          break;
        case UserRole.ADMINISTRADOR:
          this.router.navigate(['/admin/dashboard']);
          break;
        default:
          this.router.navigate(['/']);
      }
    }
  }

  // 🆕 MÉTODO NUEVO PARA SIMULAR LOGIN
  simulateLogin(role: UserRole): void {
    const fakeUser: User = {
      _id: '123',
      nombre: role === UserRole.ESTUDIANTE ? 'Ana Estudiante' : 
              role === UserRole.MENTORA ? 'María Mentora' : 
              'Admin Sistema',
      email: 'test@luminis.com',
      rol: role,
      fotoPerfil: 'https://randomuser.me/api/portraits/women/1.jpg',
      activo: true,
      biografia: 'Usuario de prueba para desarrollo',
      fechaRegistro: new Date()
    };
    
    // Guardar en localStorage
    localStorage.setItem('currentUser', JSON.stringify(fakeUser));
    localStorage.setItem('token', 'fake-jwt-token-for-dev-123');
    
    // Recargar página para que se actualice el header
    window.location.reload();
  }
}