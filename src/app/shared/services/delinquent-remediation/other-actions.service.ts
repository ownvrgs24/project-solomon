import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class OtherActionsService {

  readonly http = inject(HttpService);

  addOtherAction(data: any) {
    return this.http.postRequest(`remediation/other-actions`, data);
  }

  updateOtherAction(data: any) {
    return this.http.putRequest(`remediation/other-actions`, data);
  }

  deleteOtherAction(id: string) {
    return this.http.deleteRequest(`remediation/other-actions/${id}`);
  }
}
