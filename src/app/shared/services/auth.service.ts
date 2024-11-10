import { inject, Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  readonly http = inject(HttpService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  userLogin(data: any) {
    return this.http.postRequest('auth/login', data);
  }

  userLogout() {
    this.router.navigate(['/login']).then(() => {
      this.userService.removeSession();
    });
  }
}
