import { inject, Injectable } from '@angular/core';
import { HttpService } from '../../../../shared/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  readonly http = inject(HttpService);


  getTodayTransactions() {
    return this.http.getRequest('reports/today-transactions');
  }

  getDailyReport() {
    return this.http.getRequest('reports/daily-report');
  }
}
