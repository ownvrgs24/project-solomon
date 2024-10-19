import { inject, Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  readonly http = inject(HttpService);

  fetchAccounts() {
    return this.http.getRequest('accounts');
  }
}
