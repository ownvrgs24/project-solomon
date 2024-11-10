import { inject, Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  readonly http = inject(HttpService);

  userLogin(data: any) {
    return this.http.postRequest('auth/login', data);
  }

  userLogout() {
    return this.http.postRequest('auth/logout', {});
  }
}
