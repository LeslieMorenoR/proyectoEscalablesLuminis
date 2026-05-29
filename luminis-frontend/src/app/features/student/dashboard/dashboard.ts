import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import {
  StudentService,
  Student,
  SingleStudentResponse
} from '../../../core/services/student.service';

import {
  MentorService,
  Mentor
} from '../../../core/services/mentor.service';

import {
  RequestService,
  MentorshipRequest
} from '../../../core/services/request.service';

interface Stats {
  totalMentorias: number;
  mentoriasActivas: number;
  mentoriasCompletadas: number;
  mentoresConectadas: number;
}

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit {

  loading = true;

  student: Student | null = null;

  mentoriasActivas: MentorshipRequest[] = [];

  mentoresRecomendadas: Mentor[] = [];

  stats: Stats = {
    totalMentorias: 0,
    mentoriasActivas: 0,
    mentoriasCompletadas: 0,
    mentoresConectadas: 0
  };

  constructor(
    private router: Router,
    private studentService: StudentService,
    private mentorService: MentorService,
    private requestService: RequestService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  async loadDashboardData(): Promise<void> {

    this.loading = true;

    try {

      await Promise.all([
        this.loadStudentProfile(),
        this.loadActiveMentorias(),
        this.loadRecommendedMentors()
      ]);

      this.calculateStats();

    } catch (error) {

      console.error('Error general dashboard:', error);

    } finally {

      // ✅ SIEMPRE APAGA EL SPINNER
      this.loading = false;
    }
  }

  async loadStudentProfile(): Promise<void> {

    try {

      const response: SingleStudentResponse =
        await firstValueFrom(
          this.studentService.getMyProfile()
        );

      this.student = response.data;

      console.log('Perfil estudiante:', this.student);

    } catch (error) {

      console.error(
        'Error cargando perfil estudiante:',
        error
      );

      this.student = null;
    }
  }

  async loadActiveMentorias(): Promise<void> {

    try {

      const response: any =
        await firstValueFrom(
          this.requestService.getActiveMentorships()
        );

      this.mentoriasActivas = response.data || [];

    } catch (error) {

      console.error(
        'Error cargando mentorías:',
        error
      );

      this.mentoriasActivas = [];
    }
  }

  async loadRecommendedMentors(): Promise<void> {

    try {

      const response: any =
        await firstValueFrom(
          this.mentorService.getMentors({
            disponibilidad: true,
            limit: 4
          })
        );

      this.mentoresRecomendadas = response.data || [];

    } catch (error) {

      console.error(
        'Error cargando mentoras:',
        error
      );

      this.mentoresRecomendadas = [];
    }
  }

  calculateStats(): void {

    if (!this.student) return;

    this.stats = {

      totalMentorias:
        (this.student.mentoriasActivas || 0) +
        (this.student.mentoriasCompletadas || 0),

      mentoriasActivas:
        this.student.mentoriasActivas || 0,

      mentoriasCompletadas:
        this.student.mentoriasCompletadas || 0,

      mentoresConectadas:
        this.mentoriasActivas.length
    };
  }

  viewMentorProfile(mentorId: string): void {
    this.router.navigate(['/mentors', mentorId]);
  }

  viewMentoriaDetails(mentoriaId: string): void {
    this.router.navigate(['/requests', mentoriaId]);
  }

  requestMentorship(mentorId: string): void {
    this.router.navigate([
      '/mentors',
      mentorId,
      'request'
    ]);
  }

  editProfile(): void {
    this.router.navigate([
      '/student/profile'
    ]);
  }

  findMentors(): void {
    this.router.navigate(['/mentors']);
  }
}