import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root',
})
export class BankCheckService {
  private http = inject(HttpService);

  addBankCheck(data: any) {
    return this.http.postRequest('collateral/bank-check', data);
  }

  updateBankCheck(data: any) {
    return this.http.putRequest('collateral/bank-check', data);
  }

  deleteBankCheck(id: string) {
    return this.http.deleteRequest(`collateral/bank-check/${id}`);
  }
}
