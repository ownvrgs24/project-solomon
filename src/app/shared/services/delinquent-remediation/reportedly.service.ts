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

}
