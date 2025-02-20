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

  updateTransaction(data: any) {
    return this.http.putRequest('transactions', data);
  }

  deleteTransaction(transaction_id: string) {
    return this.http.deleteRequest(`transactions/${transaction_id}`);
  }
}
