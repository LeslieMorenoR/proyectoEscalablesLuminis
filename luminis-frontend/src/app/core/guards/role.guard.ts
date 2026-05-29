import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const currentUser = authService.currentUserValue;

  if (!currentUser) {
    router.navigate(['/login']);
    return false;
  }

  // Obtener roles permitidos desde la configuración de la ruta
  const expectedRoles = route.data['roles'] as string[];

  if (expectedRoles && !expectedRoles.includes(currentUser.rol)) {
    // Usuario no tiene el rol requerido
    console.warn(`⚠️ Acceso denegado. Rol requerido: ${expectedRoles}, Rol actual: ${currentUser.rol}`);
    router.navigate(['/']);
    return false;
  }

  return true;
};