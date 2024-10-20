import { inject, Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  readonly http = inject(HttpService);

  submitTransaction(data: any) {
    return this.http.postRequest('transactions', data);
  }
}
