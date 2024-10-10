import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class BankCheckService {

  private http = inject(HttpService);

  addBankCheck(data: any) {
    return this.http.postRequest('collateral/bank-check', data);
  }
}
