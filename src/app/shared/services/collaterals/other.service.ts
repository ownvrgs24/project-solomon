import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class OtherService {


  private http = inject(HttpService);

  addOtherCollateral(data: any) {
    return this.http.postRequest('collateral/other', data);
  }
}
