import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MentorService } from '../../core/services/mentor.service';
import {  MentorProfile } from '../../models';
import { AreaService, Area } from '../../core/services/area.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  featuredMentors: MentorProfile[] = [];
  loading = false;

  areas : Area[] = [ ];

  testimonials = [
    {
      nombre: 'María García',
      foto: 'https://randomuser.me/api/portraits/women/1.jpg',
      testimonio: 'Gracias a LUMINIS encontré una mentora increíble que me ayudó a conseguir mi primer trabajo en tech.',
      puesto: 'Estudiante de Ingeniería'
    },
    {
      nombre: 'Ana Martínez',
      foto: 'https://randomuser.me/api/portraits/women/2.jpg',
      testimonio: 'Como mentora, he tenido la oportunidad de guiar a jóvenes talentosas. Es una experiencia gratificante.',
      puesto: 'Senior Developer'
    },
    {
      nombre: 'Laura Sánchez',
      foto: 'https://randomuser.me/api/portraits/women/3.jpg',
      testimonio: 'La plataforma es intuitiva y me conectó con personas que realmente entienden mis objetivos profesionales.',
      puesto: 'Product Manager'
    }
  ];

 constructor(
  private mentorService: MentorService,
  private areaService: AreaService
) {}

  ngOnInit(): void {
    this.loadFeaturedMentors();
    this.loadAreas();
  }
  loadAreas(): void {
  this.areaService.getAreas().subscribe({
    next: (response) => {
      this.areas = response.data;
      console.log('Áreas cargadas:', this.areas);
    },
    error: (error) => {
      console.error('Error cargando áreas:', error);
    }
  });
}
  
  loadFeaturedMentors(): void {
    this.loading = true;
    // Simulación de datos mientras no hay backend
    setTimeout(() => {
      this.featuredMentors = [
        {
          _id: '1',
          usuarioId: {
            _id: '1',
            nombre: 'Dra. Carmen López',
            email: 'carmen@example.com',
            rol: 'mentora' as any,
            fotoPerfil: 'https://randomuser.me/api/portraits/women/4.jpg',
            biografia: 'Investigadora senior en IA y Machine Learning'
          },
          especialidades: [],
          experiencia: 15,
          empresa: 'Google',
          puesto: 'Senior Research Scientist',
          disponibilidad: true,
          calificacionPromedio: 4.9,
          totalMentorias: 23,
          aprobada: true,
          usuario: {} as any,
          reviews: []
        }
      ];
      this.loading = false;
    }, 500);
  }
}
