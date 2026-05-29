import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Area,
  AreaService
} from '../../../core/services/area.service';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-areas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './areas.html',
  styleUrl: './areas.scss',
})
export class Areas implements OnInit {

  areas: Area[] = [];

  loading = true;
  error = '';
  successMessage = '';

  isAdmin = false;

  newArea = {
    nombre: '',
    descripcion: '',
    icono: 'bi-stars'
  };

  constructor(
    private areaService: AreaService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {

    this.authService.currentUser$.subscribe(user => {
  this.isAdmin = user?.rol === 'administrador';
});

    

    this.loadAreas();
  }

  loadAreas(): void {

    this.loading = true;

    this.areaService.getAreas().subscribe({

      next: (response) => {

        this.areas = response.data;

        this.loading = false;
      },

      error: (err) => {

        console.error(err);

        this.error = 'No se pudieron cargar las áreas';

        this.loading = false;
      }

    });
  }

  createArea(): void {

    if (
      !this.newArea.nombre.trim() ||
      !this.newArea.descripcion.trim()
    ) {
      return;
    }

    this.areaService.createArea(this.newArea).subscribe({

      next: (res) => {

        this.areas.unshift(res.data);

        this.successMessage = 'Área creada exitosamente ✨';

        this.newArea = {
          nombre: '',
          descripcion: '',
          icono: 'bi-stars'
        };

        setTimeout(() => {
          this.successMessage = '';
        }, 3000);

      },

      error: (err) => {

        console.error(err);

        this.error = 'Error creando área';

        setTimeout(() => {
          this.error = '';
        }, 3000);

      }

    });
  }

  deleteArea(area: Area): void {

    const confirmDelete = confirm(
      `¿Eliminar el área ${area.nombre}?`
    );

    if (!confirmDelete) return;

    this.areaService.deleteArea(area._id).subscribe({

      next: () => {

        this.areas = this.areas.filter(
          a => a._id !== area._id
        );

        this.successMessage = 'Área eliminada';

        setTimeout(() => {
          this.successMessage = '';
        }, 3000);

      },

      error: (err) => {

        console.error(err);

        this.error = 'Error eliminando área';

        setTimeout(() => {
          this.error = '';
        }, 3000);

      }

    });
  }

}