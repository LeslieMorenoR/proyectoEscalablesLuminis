import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MentorCardComponent } from '../mentor-card/mentor-card';

export interface Area {
  nombre: string;
}

export interface Mentora {
  id: string;
  nombre: string;
  puesto: string;
  empresa: string;
  foto: string;
  areas: Area[];
}

@Component({
  selector: 'app-mentor-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MentorCardComponent],
  templateUrl: './mentor-list.html',
  styleUrl: './mentor-list.scss'
})
export class MentorList {

  mentoras: Mentora[] = [
    {
      id: '1',
      nombre: 'Ana Garcia',
      puesto: 'Software Engineer',
      empresa: 'Google',
      foto: 'https://randomuser.me/api/portraits/women/44.jpg',
      areas: [{ nombre: 'Desarrollo Web' }, { nombre: 'Cloud' }]
    },
    {
      id: '2',
      nombre: 'Maria Lopez',
      puesto: 'Data Scientist',
      empresa: 'Microsoft',
      foto: 'https://randomuser.me/api/portraits/women/68.jpg',
      areas: [{ nombre: 'Machine Learning' }, { nombre: 'Python' }]
    },
    {
      id: '3',
      nombre: 'Sofia Torres',
      puesto: 'Product Manager',
      empresa: 'Meta',
      foto: 'https://randomuser.me/api/portraits/women/65.jpg',
      areas: [{ nombre: 'Product' }, { nombre: 'UX' }]
    },
    {
      id: '4',
      nombre: 'Laura Mendez',
      puesto: 'UX Designer',
      empresa: 'Airbnb',
      foto: 'https://randomuser.me/api/portraits/women/90.jpg',
      areas: [{ nombre: 'Diseno' }, { nombre: 'Figma' }]
    },
    {
      id: '5',
      nombre: 'Isabella Ruiz',
      puesto: 'DevOps Engineer',
      empresa: 'Amazon',
      foto: 'https://randomuser.me/api/portraits/women/33.jpg',
      areas: [{ nombre: 'DevOps' }, { nombre: 'AWS' }]
    },
    {
      id: '6',
      nombre: 'Valentina Cruz',
      puesto: 'Backend Developer',
      empresa: 'Spotify',
      foto: 'https://randomuser.me/api/portraits/women/17.jpg',
      areas: [{ nombre: 'Node.js' }, { nombre: 'Bases de Datos' }]
    }
  ];
}