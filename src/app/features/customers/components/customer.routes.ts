import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'create',
    async loadComponent() {
      const m = await import('./customer-create/customer-create.component');
      return m.CustomerCreateComponent;
    },
  },
  {
    path: 'update/:id',
    async loadComponent() {
      const m = await import('./customer-update/customer-update.component');
      return m.CustomerUpdateComponent;
    },
  },
  {
    path: 'list',
    async loadComponent() {
      const m = await import('./customer-list/customer-list.component');
      return m.CustomerListComponent;
    },
  },
  {
    path: 'loans-records/:id',
    async loadComponent() {
      const m = await import(
        './customer-loans/loan-records/loan-records.component'
      );
      return m.LoanRecordsComponent;
    },
  },
  {
    path: 'loans-records/:id/:loan_id',
    async loadComponent() {
      const m = await import(
        './customer-loans/amortization-table/amortization-table.component'
      );
      return m.AmortizationTableComponent;
    },
  },

  {
    path: '',
    redirectTo: 'create',
    pathMatch: 'full',
  },
];
