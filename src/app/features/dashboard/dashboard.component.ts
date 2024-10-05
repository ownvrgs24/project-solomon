import { Component, inject, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { DashboardService } from '../../shared/services/dashboard.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Dashboard {
  overall_collection: number;
  payment_collections: number;
  interest_collection: number;
  disbursed_loan: number;
  customers: number;
  transactions: number;
  delinquent_count: number;
}

interface DashboardItem {
  figure: number;
  label: string;
  icon: string;
  isCurrency?: boolean;
  iconColor: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardModule, IconFieldModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  dashboardItems$: Observable<DashboardItem[]> = new Observable<DashboardItem[]>();
  private readonly dashboardService = inject(DashboardService);

  ngOnInit() {
    this.dashboardItems$ = this.fetchDashboard();
  }

  private fetchDashboard(): Observable<DashboardItem[]> {
    return this.dashboardService.fetchDashboard().pipe(
      map((data: Dashboard) => [
        { figure: data.overall_collection, label: 'Overall Collection', icon: 'pi pi-money-bill', isCurrency: true, iconColor: 'green' },
        { figure: data.payment_collections, label: 'Payment Collection', icon: 'pi pi-money-bill', isCurrency: true, iconColor: 'green' },
        { figure: data.interest_collection, label: 'Interest Collection', icon: 'pi pi-money-bill', isCurrency: true, iconColor: 'green' },
        { figure: data.disbursed_loan, label: 'Disbursed Loan', icon: 'pi pi-money-bill', isCurrency: true, iconColor: 'amber' },
        { figure: data.customers, label: 'Customers', icon: 'pi pi-users', isCurrency: false, iconColor: 'primary' },
        { figure: data.transactions, label: 'Transactions', icon: 'pi pi-file', isCurrency: false, iconColor: 'white' },
        { figure: data.delinquent_count, label: 'Delinquent Count', icon: 'pi pi-exclamation-triangle', isCurrency: false, iconColor: 'red' },
      ])
    );
  }

  get dateNow(): Date {
    return new Date();
  }
}