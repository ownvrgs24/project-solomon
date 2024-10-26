import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class ReportedlyService {

  readonly http = inject(HttpService);

  addReportedly(data: any) {
    return this.http.postRequest(`remediation/reported`, data);
  }

  updateReportedly(data: any) {
    return this.http.putRequest(`remediation/reported`, data);
  }

  deleteReportedly(id: string) {
    return this.http.deleteRequest(`remediation/reported/${id}`);
  }

}
