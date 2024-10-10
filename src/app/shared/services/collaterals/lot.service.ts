import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class LotService {


  private http = inject(HttpService);

  addLot(data: any) {
    return this.http.postRequest('collateral/lot', data);
  }
}
