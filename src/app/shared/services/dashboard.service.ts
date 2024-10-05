import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

export interface Dashboard {
  overall_collection: number;
  payment_collections: number;
  interest_collection: number;
  disbursed_loan: number;
  customers: number;
  transactions: number;
  delinquent_count: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {


  readonly http = inject(HttpService);

  fetchDashboard(): Observable<Dashboard> {
    return this.http.getRequest('dashboard') as Observable<Dashboard>;
  }
}