import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface DashboardStats {
  totalUsuarios: number;
  totalEstudiantes: number;
  totalMentoras: number;
  mentorasPendientes: number;
  solicitudesPendientes: number;
  mentoriasActivas: number;
  totalAreas: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  stats: DashboardStats | null = null;
  loading = true;
  errorMessage = '';

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadStats();
  }

// dashboard.ts - actualizar el método loadStats()
loadStats(): void {
  this.loading = true;
  this.errorMessage = '';

  this.http.get<any>(`${this.apiUrl}/users/stats`).subscribe({
    next: (response) => {
      this.stats = response.data;
      this.loading = false;
    },
    error: (error) => {
      console.error('Error cargando estadísticas:', error);
      this.errorMessage = 'Error al cargar las estadísticas del sistema';
      this.loading = false;
    }
  });
}
}