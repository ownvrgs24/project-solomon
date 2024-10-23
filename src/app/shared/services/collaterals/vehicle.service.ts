import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private http = inject(HttpService);

  deleteVehicle(id: string) {
    return this.http.deleteRequest(`collateral/vehicle/${id}`);
  }

  addVehicle(data: any) {
    return this.http.postRequest('collateral/vehicle', data);
  }

  updateVehicle(data: any) {
    return this.http.putRequest('collateral/vehicle', data);
  }
}
