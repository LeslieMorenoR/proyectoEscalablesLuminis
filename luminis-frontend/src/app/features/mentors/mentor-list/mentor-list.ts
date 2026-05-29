import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MentorCardComponent } from '../mentor-card/mentor-card';
import { MentorService, Mentor } from '../../../core/services/mentor.service';
@Component({
  selector: 'app-mentor-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MentorCardComponent
  ],
  templateUrl: './mentor-list.html',
  styleUrl: './mentor-list.scss'
})

export class MentorList implements OnInit {

  mentoras: Mentor[] = [];

  loading = false;
  error = '';

  constructor(
    private mentorService: MentorService
  ) {}

  ngOnInit(): void {

    this.loadMentors();

  }

  loadMentors(): void {

    this.loading = true;

    this.mentorService.getMentors()
      .subscribe({

        next: (response:any) => {

          console.log('Mentoras obtenidas:', response);

          this.mentoras = response.data;

          this.loading = false;

        },

        error: (error:any) => {

          console.error('Error cargando mentoras:', error);

          this.error = 'No se pudieron cargar las mentoras';

          this.loading = false;

        }

      });

  }

}