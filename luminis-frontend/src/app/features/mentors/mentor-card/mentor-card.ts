import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Mentor } from '../../../core/services/mentor.service';

@Component({
  selector: 'app-mentor-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mentor-card.html',
  styleUrl: './mentor-card.scss'
})
export class MentorCardComponent {
  @Input() mentora!: Mentor;
}