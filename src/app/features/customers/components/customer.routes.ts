import { Routes } from '@angular/router';
import { accessControlGuard } from '../../../shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'add-loan/:id',
    async loadComponent() {
      const m = await import('./customer-add-loan/customer-add-loan.component');
      return m.CustomerAddLoanComponent;
    },
  },
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
    path: 'edit-amortization-table/:id/:loan_id',
    async loadComponent() {
      const m = await import('./customer-loans/edit-amortization-table/edit-amortization-table.component');
      return m.EditAmortizationTableComponent;
    },
    canActivate: [accessControlGuard],
    data: {
      allowedRoles: ["ADMINISTRATOR"]
    },
  },
  {
    path: '',
    redirectTo: 'create',
    pathMatch: 'full',
  },
];
