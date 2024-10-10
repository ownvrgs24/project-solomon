import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private http = inject(HttpService);

  addVehicle(data: any) {
    return this.http.postRequest('collateral/vehicle', data);
  }
}
