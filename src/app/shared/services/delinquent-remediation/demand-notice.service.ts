import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class DemandNoticeService {

  readonly http = inject(HttpService);

  addDemandNotice(data: any) {
    return this.http.postRequest(`remediation/demand-notice`, data);
  }
}
