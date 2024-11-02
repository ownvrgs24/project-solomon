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

  createAccount(data: any) {
    return this.http.postRequest('accounts', data);
  }

  fetchUserAccount(id: string) {
    return this.http.getRequest(`accounts/${id}`);
  }

  updateAccount(data: any) {
    return this.http.putRequest(`accounts`, data);
  }

  deleteAccount(id: string) {
    return this.http.deleteRequest(`accounts/${id}`);
  }

  changePassword(data: any) {
    return this.http.putRequest(`accounts/change-password`, data);
  }
}
