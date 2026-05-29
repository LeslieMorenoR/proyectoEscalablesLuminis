import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  Mentor,
  MentorService,
} from '../../../core/services/mentor.service';

import {
  Area,
  AreaService
} from '../../../core/services/area.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})

export class Profile implements OnInit {

  mentor: Mentor | null = null;

  areas: Area[] = [];

  loading = true;
  saving = false;

  errorMessage = '';
  successMessage = '';

  mentorId = '';

  formData = {

    especialidades: [] as string[],

    experiencia: 0,

    educacion: '',

    empresa: '',

    puesto: '',

    linkedIn: '',

    disponibilidad: true,
    horariosDisponibles: [] as string[],


  };

  constructor(
    private mentorService: MentorService,
    private areaService: AreaService
  ) {}

  ngOnInit(): void {

    this.loadAreas();

    this.loadProfile();

  }

  loadAreas(): void {

    this.areaService.getAreas().subscribe({

      next: (res) => {

        this.areas = res.data;

      },

      error: (err) => {

        console.error(
          'Error cargando áreas:',
          err
        );

      }

    });

  }

  loadProfile(): void {

    this.loading = true;

    this.errorMessage = '';

    this.mentorService.getMyProfile().subscribe({

      next: (res: any) => {

        console.log('Perfil mentor:', res);

        if (!res?.data) {

          this.errorMessage =
            'No se encontró el perfil de mentora';

          this.loading = false;

          return;

        }

        this.mentor = res.data;

        this.mentorId = res.data._id || '';

        this.formData = {

          especialidades:
            res.data.especialidades?.map(
              (area: any) => area._id
            ) || [],

          experiencia:
            res.data.experiencia || 0,

          educacion:
            res.data.educacion || '',

          empresa:
            res.data.empresa || '',

          puesto:
            res.data.puesto || '',

          linkedIn:
            res.data.linkedIn || '',

          disponibilidad:
            res.data.disponibilidad ?? true,
            horariosDisponibles:
  res.data.horariosDisponibles?.map(
    (h: any) => h.fecha
  ) || [],

        };

        this.loading = false;

      },

      error: (err: any) => {

        console.error(
          'Error cargando perfil:',
          err
        );

        this.errorMessage =
          err?.error?.message ||
          'Error cargando perfil';

        this.loading = false;

      },

    });

  }
  previewImage: string | ArrayBuffer | null = null;
addFecha(fecha: string): void {

  if (!fecha) return;

  this.formData.horariosDisponibles.push(fecha);

}

removeFecha(index: number): void {

  this.formData.horariosDisponibles.splice(index, 1);

}
onImageSelected(event: Event): void {

  const input = event.target as HTMLInputElement;

  if (!input.files || input.files.length === 0) {
    return;
  }

  const file = input.files[0];

  const reader = new FileReader();

  reader.onload = () => {

    this.previewImage = reader.result;

  };

  reader.readAsDataURL(file);

}

  updateProfile(): void {

    if (!this.mentorId) {

      this.errorMessage =
        'No se encontró el ID del perfil';

      return;

    }

    this.saving = true;

    this.errorMessage = '';

    this.successMessage = '';

    this.mentorService
      .updateMentor(this.mentorId, this.formData)
      .subscribe({

        next: (res: any) => {

          this.mentor = res.data;

          this.successMessage =
            'Perfil actualizado correctamente ✨';

          this.saving = false;

          setTimeout(() => {

            this.successMessage = '';

          }, 3000);

        },

        error: (err: any) => {

          console.error(
            'Error actualizando perfil:',
            err
          );

          this.errorMessage =
            err?.error?.message ||
            'Error actualizando perfil';

          this.saving = false;

        },

      });

  }

  getStarsArray(
    calificacion: number = 0
  ): number[] {

    return Array(
      Math.round(calificacion)
    ).fill(0);

  }

}