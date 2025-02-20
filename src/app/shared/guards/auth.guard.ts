import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { inject } from '@angular/core';
import { ConfirmationService } from 'primeng/api';


export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userService = inject(UserService);
  return userService.isLoggedIn() ? true : router.parseUrl('/login');
};

export const publicGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userService = inject(UserService);
  return userService.isLoggedIn() ? router.parseUrl('/core') : true;
};

export const accessControlGuard: CanActivateFn = (route, state) => {
  route.data = route.data || {};
  const userService = inject(UserService);
  const confirmationService = inject(ConfirmationService);

  if (route.data['allowedRoles']) {
    const userRole = userService.getUserRole();
    if (route.data['allowedRoles'].includes(userRole)) {
      return true;
    }
  }

  confirmationService.confirm({
    header: 'Access Denied',
    acceptButtonStyleClass: 'p-button-secondary w-full',
    acceptLabel: 'Ok',
    message: 'You do not have permission to access this page.',
    closeOnEscape: false,
    rejectVisible: false,
    acceptVisible: true,
  })
  return false;

};
