import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root',
})
export class LotService {
  private http = inject(HttpService);

  deleteLot(id: string) {
    return this.http.deleteRequest(`collateral/lot/${id}`);
  }

  addLot(data: any) {
    return this.http.postRequest('collateral/lot', data);
  }

  updateLot(data: any) {
    return this.http.putRequest('collateral/lot', data);
  }
}
