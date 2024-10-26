import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class DemandNoticeService {

  readonly http = inject(HttpService);

  deleteDemandNotice(id: string) {
    return this.http.deleteRequest(`remediation/demand-notice/${id}`);
  }

  addDemandNotice(data: any) {
    return this.http.postRequest(`remediation/demand-notice`, data);
  }

  updateDemandNotice(data: any) {
    return this.http.putRequest(`remediation/demand-notice`, data);
  }

}
