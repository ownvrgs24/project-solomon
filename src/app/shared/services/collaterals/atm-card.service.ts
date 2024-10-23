import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root',
})
export class AtmCardService {
  private http = inject(HttpService);

  addAtmCard(data: any) {
    return this.http.postRequest('collateral/atm-card', data);
  }

  updateAtmCard(data: any) {
    return this.http.putRequest('collateral/atm-card', data);
  }

  deleteAtmCard(id: string) {
    return this.http.deleteRequest(`collateral/atm-card/${id}`);
  }
}
