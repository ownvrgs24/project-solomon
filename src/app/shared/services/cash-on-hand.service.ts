import { inject, Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class CashOnHandService {

  readonly http = inject(HttpService);

  retrieveCashOnHand() {
    return this.http.getRequest(`reports/cash-on-hand`);
  }

  addCashOnHand(data: any) {
    return this.http.postRequest(`reports/cash-on-hand`, data);
  }

  updateCashOnHand(data: any) {
    return this.http.putRequest(`reports/cash-on-hand`, data);
  }
}
