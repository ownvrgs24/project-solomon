import { HttpErrorResponse, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { UserService } from '../services/user.service';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // console.log(`Request is on its way to ${req.url}`);
  const userService = inject(UserService);
  const authService = inject(AuthService);
  const confirmationService = inject(ConfirmationService);
  const token = userService.getToken();

  const enableCreate: boolean =
    req.method !== "POST" &&
    req.method !== "GET" &&
    req.method !== "PUT" &&
    req.url.endsWith("/api/accounts");
  if (apiExceptions(req.url) || enableCreate) {
    return next(req);
  }

  if (token) {
    const authHeaderRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next(authHeaderRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && error.error.message === "Token has expired") {
          confirmationService.confirm({
            header: 'Session Expired',
            icon: '',
            acceptButtonStyleClass: 'p-button-success w-full',
            acceptLabel: 'Okay, I understand',
            message: 'Session Expired, Your session has expired. Please login again.',
            closeOnEscape: false,
            rejectVisible: false,
            accept: () => {
              authService.userLogout();
            },
            reject: () => {
              authService.userLogout();
            }
          });
        }
        return throwError(() => error);
      })
    );
  } else {
    const errorMessage = "Token not provided";
    return throwError(() => new HttpErrorResponse({
      error: errorMessage,
      status: 403,
    }));
  }

};


export const apiExceptions = (url: string): boolean => {
  return tokenExceptions.some((exceptions) => url.endsWith(exceptions));
}

export const tokenExceptions: string[] = [
  "/api/auth/login",
  "/api/regions",
  "/provinces",
  "/cities-municipalities",
  "/barangays",
  "/api/logs",
];


