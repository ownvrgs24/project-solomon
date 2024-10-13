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

}
