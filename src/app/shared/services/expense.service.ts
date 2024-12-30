import { inject, Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  readonly http = inject(HttpService);

  retrieveExpenses() {
    return this.http.getRequest(`reports/expenses`);
  }

  addExpense(data: any) {
    return this.http.postRequest(`reports/expense`, data);
  }

  deleteExpense(expense_id: string) {
    return this.http.deleteRequest(`reports/expense/${expense_id}`);
  }

}
