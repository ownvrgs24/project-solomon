import { inject, Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  readonly http = inject(HttpService);

  sendPrincipalLoanApplication(data: any) {
    return this.http.postRequest('loans/principal', data);
  }

  loadCustomerLoans(data: any) {
    return this.http.postRequest(`loans/records`, data);
  }

  loadAmortizationTable(data: any) {
    return this.http.postRequest(`loans/amortization`, data);
  }

  getLoansForReview() {
    return this.http.getRequest(`loans/on-review`);
  }

  approveLoan(data: any) {
    return this.http.putRequest(`loans/approve`, data);
  }

  updateLoan(data: any) {
    return this.http.putRequest(`loans/update`, data);
  }

  updateLoanStatusToDelinquent(data: any) {
    return this.http.putRequest(`loans/mark-as-delinquent`, data);
  }

  updateLoanStatusToPaid(data: any) {
    return this.http.putRequest(`loans/mark-as-paid`, data);
  }
}
