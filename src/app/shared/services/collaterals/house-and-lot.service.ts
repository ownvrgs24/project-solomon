import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class HouseAndLotService {

  private http = inject(HttpService);

  addHouseAndLot(data: any) {
    return this.http.postRequest('collateral/house-and-lot', data);
  }
}
