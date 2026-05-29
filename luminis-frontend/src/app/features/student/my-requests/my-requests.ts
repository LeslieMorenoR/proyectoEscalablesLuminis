import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {
  RequestService,
  MentorshipRequest
} from '../../../core/services/request.service';

@Component({
  selector: 'app-my-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-requests.html',
  styleUrls: ['./my-requests.scss']
})
export class MyRequestsComponent implements OnInit {

  loading = true;

  requests: MentorshipRequest[] = [];

  constructor(
    private requestService: RequestService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  private toPromise<T>(obs: import('rxjs').Observable<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      obs.subscribe({
        next: resolve,
        error: reject
      });
    });
  }

  async loadRequests(): Promise<void> {

    this.loading = true;

    try {

      const response = await this.toPromise(
        this.requestService.getRequests()
      );

      this.requests = response.data ?? [];

    } catch (error) {

      console.error('Error cargando solicitudes:', error);
      this.requests = [];

    } finally {

      this.loading = false;

    }
  }

  getStatusClass(status: string): string {

    switch (status) {

      case 'aceptada':
        return 'accepted';

      case 'rechazada':
        return 'rejected';

      case 'completada':
        return 'completed';

      default:
        return 'pending';
    }
  }

  viewRequest(requestId: string): void {
    this.router.navigate(['/requests', requestId]);
  }

}