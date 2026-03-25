import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Mentora } from '../mentor-list/mentor-list';

@Component({
  selector: 'app-mentor-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mentor-card.html',
  styleUrl: './mentor-card.scss'
})
export class MentorCardComponent {
  @Input() mentora!: Mentora;
}