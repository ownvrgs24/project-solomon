import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root',
})
export class OtherService {
  private http = inject(HttpService);

  deleteOtherCollateral(id: string) {
    return this.http.deleteRequest(`collateral/other/${id}`);
  }

  addOtherCollateral(data: any) {
    return this.http.postRequest('collateral/other', data);
  }

  updateOtherCollateral(data: any) {
    return this.http.putRequest('collateral/other', data);
  }
}
