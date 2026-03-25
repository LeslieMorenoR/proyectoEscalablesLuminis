import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../../models';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const expectedRoles = route.data['roles'] as UserRole[];
  const currentUser = authService.currentUserValue;

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  if (currentUser && expectedRoles.includes(currentUser.rol)) {
    return true;
  }

  // Redirigir a home si no tiene el rol adecuado
  router.navigate(['/']);
  return false;
};
