import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MentorService } from '../../core/services/mentor.service';
import { MentorProfile } from '../../models';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  featuredMentors: MentorProfile[] = [];
  loading = false;

  areas = [
    { nombre: 'Tecnología', icono: 'bi-laptop', descripcion: 'Desarrollo, Data Science, DevOps' },
    { nombre: 'Negocios', icono: 'bi-briefcase', descripcion: 'Marketing, Ventas, Emprendimiento' },
    { nombre: 'Diseño', icono: 'bi-palette', descripcion: 'UX/UI, Gráfico, Producto' },
    { nombre: 'Ciencias', icono: 'bi-flask', descripcion: 'Investigación, Medicina, Biología' },
    { nombre: 'Ingeniería', icono: 'bi-gear', descripcion: 'Civil, Industrial, Mecánica' },
    { nombre: 'Educación', icono: 'bi-book', descripcion: 'Docencia, Pedagogía, Academia' }
  ];

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

  constructor(private mentorService: MentorService) {}

  ngOnInit(): void {
    this.loadFeaturedMentors();
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
