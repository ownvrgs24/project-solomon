import { inject, Injectable } from '@angular/core';
import { HttpService } from '../../../../shared/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class MonthlyReportService {
  readonly http = inject(HttpService);

  getMonthlyReport(data: any) {
    return this.http.postRequest('reports/monthly', data);
  }
}
