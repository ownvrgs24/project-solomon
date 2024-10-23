import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessOwnerService {

  readonly http = inject(HttpService);

  addBusinessOwner(data: any) {
    return this.http.postRequest('income/business-owner', data);
  }

  updateBusinessOwner(data: any) {
    return this.http.putRequest('income/business-owner', data);
  }

}
