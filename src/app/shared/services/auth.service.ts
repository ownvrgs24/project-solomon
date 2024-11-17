import { inject, Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  readonly http = inject(HttpService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  userLogin(data: any) {
    return this.http.postRequest('auth/login', data);
  }

  userLogout() {
    return this.http.postRequest('auth/logout', {}).subscribe({
      next: (res: any) => {
        this.router.navigate(['/login']).then(() => {
          this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: res.message });
        });
      },
      complete: () => {
        this.userService.removeSession();
      },
      error: (error) => {
        if (error.status === 401) {
          this.userService.removeSession();
          this.router.navigate(['/login']).then(() => {
            this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'Session Expired, Your session has expired. Please login again.' });
          });
          return;
        }
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while logging out' });
      }
    });
  }
}
