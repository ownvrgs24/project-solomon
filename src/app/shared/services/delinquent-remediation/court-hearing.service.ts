import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class CourtHearingService {

  readonly http = inject(HttpService);

  addCourtHearing(data: any) {
    return this.http.postRequest(`remediation/court-hearing`, data);
  }

  updateCourtHearing(data: any) {
    return this.http.putRequest(`remediation/court-hearing`, data);
  }

  deleteCourtHearing(id: string) {
    return this.http.deleteRequest(`remediation/court-hearing/${id}`);
  }

}
