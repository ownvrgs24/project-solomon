import { inject, Injectable } from '@angular/core';
import { HttpService } from '../../../../shared/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class DelinquentReportService {

  readonly http = inject(HttpService);

  getDelinquentReport(data: any) {
    return this.http.postRequest('reports/delinquent', data);
  }
}
