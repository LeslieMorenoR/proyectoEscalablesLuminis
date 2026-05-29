import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  RequestService,
  MentorshipRequest
} from '../../../core/services/request.service';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './requests.html',
  styleUrl: './requests.scss',
})
export class Requests implements OnInit {

  requests: MentorshipRequest[] = [];

  loading = true;

  currentFilter = 'todos';

  constructor(
    private requestService: RequestService
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {

    this.loading = true;

    const filters: any = {};

    if (this.currentFilter !== 'todos') {
      filters.estado = this.currentFilter;
    }

    this.requestService.getRequests(filters).subscribe({
      next: (response) => {
        this.requests = response.data;
        this.loading = false;
      },

      error: (err: any) => {
        console.error('Error cargando solicitudes', err);
        this.loading = false;
      }
    });
  }

  filterRequests(filter: string): void {
    this.currentFilter = filter;
    this.loadRequests();
  }

  getImageUrl(path?: string): string {

  // Imagen por defecto local de Angular
  if (!path || path === 'default-avatar.png') {
    return 'assets/default-avatar.png';
  }

  // URL completa
  if (path.startsWith('http')) {
    return path;
  }

  // Imagen local de Angular
  if (path.startsWith('assets/')) {
    return path;
  }

  // Imagen del backend
  return `http://localhost:3000/${path}`;

}
  acceptRequest(id: string): void {

    this.requestService.acceptRequest(id).subscribe({
      next: () => {
        this.loadRequests();
      },

      error: (err: any) => {
        console.error('Error aceptando solicitud', err);
      }
    });

  }
  onImageError(event: Event): void {

  const img = event.target as HTMLImageElement;

  img.src = 'assets/default-avatar.png';

}

  rejectRequest(id: string): void {

    const motivo = prompt('Motivo del rechazo');

    if (!motivo) return;

    this.requestService.rejectRequest(id, motivo).subscribe({
      next: () => {
        this.loadRequests();
      },

      error: (err: any) => {
        console.error('Error rechazando solicitud', err);
      }
    });

  }

  completeRequest(id: string): void {

    this.requestService.completeRequest(id).subscribe({
      next: () => {
        this.loadRequests();
      },

      error: (err: any) => {
        console.error('Error completando mentoría', err);
      }
    });

  }

  getEstadoClass(estado: string): string {

    switch (estado) {

      case 'pendiente':
        return 'bg-warning text-dark';

      case 'aceptada':
        return 'bg-primary';

      case 'completada':
        return 'bg-success';

      case 'rechazada':
        return 'bg-danger';

      case 'cancelada':
        return 'bg-secondary';

      default:
        return 'bg-dark';
    }

  }

}