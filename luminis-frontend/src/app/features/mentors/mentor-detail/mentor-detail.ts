import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ActivatedRoute,
  RouterModule
} from '@angular/router';

import { FormsModule } from '@angular/forms';

import {
  MentorService,
  Mentor
} from '../../../core/services/mentor.service';

import {
  RequestService
} from '../../../core/services/request.service';

import {
  AuthService
} from '../../../core/services/auth.service';

@Component({
  selector: 'app-mentor-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './mentor-detail.html',
  styleUrl: './mentor-detail.scss',
})

export class MentorDetail implements OnInit {

  mentor: Mentor | null = null;

  loading = true;

  error = '';

  mensaje = '';

  fechaMentoria = '';

  sendingRequest = false;

  isStudent = false;
  horariosDisponibles: {
  fecha: string;
  disponible: boolean;
}[] = [];

  /* ALERT */

  alertMessage = '';

  alertType: 'success' | 'error' = 'success';

  /* HORARIOS */

 /* HORARIOS */



  constructor(
    private route: ActivatedRoute,
    private mentorService: MentorService,
    private requestService: RequestService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {

    this.isStudent =
      this.authService.isStudent();

    const id =
      this.route.snapshot.paramMap.get('id');

    if (id) {

      this.loadMentor(id);

    } else {

      this.error =
        'Mentora no encontrada';

      this.loading = false;

    }

  }

  loadMentor(id: string): void {

    this.loading = true;

    this.mentorService
      .getMentorById(id)
      .subscribe({

        next: (response) => {

          this.mentor = response.data;

          this.horariosDisponibles =
            response.data.horariosDisponibles || [];

          this.loading = false;

        },

        error: (err) => {

          console.error(err);

          this.error =
            'No se pudo cargar la mentora';

          this.loading = false;

        }

      });

  }

  selectHorario(horario: string): void {

    this.fechaMentoria = horario;

  }

  sendRequest(): void {

    if (!this.mentor) {
      return;
    }

    if (!this.fechaMentoria) {

      this.showAlert(
        'Selecciona un horario disponible',
        'error'
      );

      return;

    }

    if (!this.mensaje.trim()) {

      this.showAlert(
        'Escribe un mensaje para la mentora',
        'error'
      );

      return;

    }

    this.sendingRequest = true;

    this.requestService
      .createRequest({

        mentoraId: this.mentor._id,

        mensaje: this.mensaje,

        fechaMentoria: this.fechaMentoria

      })

      .subscribe({

        next: () => {

          this.sendingRequest = false;

          this.showAlert(
            'Solicitud enviada exitosamente ✨',
            'success'
          );

          this.mensaje = '';

          this.fechaMentoria = '';

        },

        error: (error) => {

          console.error(error);

          this.sendingRequest = false;

          this.showAlert(

            error.error?.message ||
            'Error enviando solicitud',

            'error'

          );

        }

      });

  }

  showAlert(
    message: string,
    type: 'success' | 'error'
  ): void {

    this.alertMessage = message;

    this.alertType = type;

    setTimeout(() => {

      this.alertMessage = '';

    }, 4000);

  }

  formatHorario(fecha: string): string {

    return new Date(fecha)
      .toLocaleString(

        'es-MX',

        {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        }

      );

  }

}