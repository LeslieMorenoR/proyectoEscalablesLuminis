import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  Mentor,
  MentorService
} from '../../../core/services/mentor.service';

import {
  MentorshipRequest,
  RequestService
} from '../../../core/services/request.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {

  mentor!: Mentor;

  solicitudes: MentorshipRequest[] = [];

  mentoriasActivas: MentorshipRequest[] = [];

  mentoriasCompletadas: MentorshipRequest[] = [];

  loading = true;

  stats = {
    totalMentorias: 0,
    solicitudesPendientes: 0,
    rating: 0,
    activas: 0
  };

  constructor(
    private mentorService: MentorService,
    private requestService: RequestService
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {

    this.loading = true;

    this.mentorService.getMyProfile()
      .subscribe({

        next: (response) => {

          this.mentor = response.data;

          this.loadRequests();
        },

        error: (err: any) => {

          console.error(err);

          this.loading = false;
        }

      });

  }

  loadRequests(): void {

    this.requestService.getRequests()
      .subscribe({

        next: (response) => {

          const requests = response.data;

          this.solicitudes = requests.filter(
            r => r.estado === 'pendiente'
          );

          this.mentoriasActivas = requests.filter(
            r => r.estado === 'aceptada'
          );

          this.mentoriasCompletadas = requests.filter(
            r => r.estado === 'completada'
          );

          this.stats = {

            totalMentorias:
              this.mentor.totalMentorias,

            solicitudesPendientes:
              this.solicitudes.length,

            rating:
              this.mentor.calificacionPromedio,

            activas:
              this.mentoriasActivas.length

          };

          this.loading = false;
        },

        error: (err: any) => {

          console.error(err);

          this.loading = false;
        }

      });

  }

  acceptRequest(id: string): void {

    this.requestService.acceptRequest(id)
      .subscribe({

        next: () => {

          this.loadRequests();

        },

        error: (err: any) => {

          console.error(err);

        }

      });

  }

  rejectRequest(id: string): void {

    this.requestService.rejectRequest(
      id,
      'No disponible actualmente'
    )
    .subscribe({

      next: () => {

        this.loadRequests();

      },

      error: (err: any) => {

        console.error(err);

      }

    });

  }

}