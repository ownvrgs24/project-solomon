import { inject, Injectable } from '@angular/core';
import { HttpService } from '../../../../shared/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class AnnualReportService {
  readonly http = inject(HttpService);

  getAnnualReport(data: any) {
    return this.http.postRequest('reports/annual', data);
  }

}
