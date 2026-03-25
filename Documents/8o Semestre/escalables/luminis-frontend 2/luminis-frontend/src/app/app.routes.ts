import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { UserRole } from './models';

export const routes: Routes = [
  // Rutas públicas
  {
    path: '',
    loadComponent: () => import('./features/home/home').then(m => m.Home)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then(m => m.Register)
  },
  {
    path: 'mentors',
    loadComponent: () => import('./features/mentors/mentor-list/mentor-list').then(m => m.MentorList)
  },
  {
    path: 'mentors/:id',
    loadComponent: () => import('./features/mentors/mentor-detail/mentor-detail').then(m => m.MentorDetail)
  },

  // Rutas protegidas - Estudiante
  {
    path: 'student',
    //canActivate: [authGuard, roleGuard],
    //data: { roles: [UserRole.ESTUDIANTE] },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/student/dashboard/dashboard').then(m => m.Dashboard)
      },
      {
        path: 'requests',
        loadComponent: () => import('./features/student/my-requests/my-requests').then(m => m.MyRequests)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/student/profile/profile').then(m => m.Profile)
      }
    ]
  },

  // Rutas protegidas - Mentora
  {
    path: 'mentor',
    //canActivate: [authGuard, roleGuard],
    //data: { roles: [UserRole.MENTORA] },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/mentor-dashboard/dashboard/dashboard').then(m => m.Dashboard)
      },
      {
        path: 'requests',
        loadComponent: () => import('./features/mentor-dashboard/requests/requests').then(m => m.Requests)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/mentor-dashboard/profile/profile').then(m => m.Profile)
      }
    ]
  },

  // Rutas protegidas - Administrador
  {
    path: 'admin',
    //canActivate: [authGuard, roleGuard],
    //data: { roles: [UserRole.ADMINISTRADOR] },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/dashboard/dashboard').then(m => m.Dashboard)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/admin/users/users').then(m => m.Users)
      },
      {
        path: 'areas',
        loadComponent: () => import('./features/admin/areas/areas').then(m => m.Areas)
      }
    ]
  },

  // Ruta 404
  {
    path: '**',
    redirectTo: ''
  }
];
