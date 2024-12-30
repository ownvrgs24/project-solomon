import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UpperCaseInputDirective } from '../../../shared/directives/to-uppercase.directive';
import { InputTextModule } from 'primeng/inputtext';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ExpenseService } from '../../../shared/services/expense.service';
import { DividerModule } from 'primeng/divider';
import { CashOnHandService } from '../../../shared/services/cash-on-hand.service';

interface ExpenseForm {
  expense_detail: FormControl<string | null>;
  expense_amount: FormControl<string | null>;
}

interface CashOnHandForm {
  cash_detail: FormControl<string | null>;
  cash_amount: FormControl<number | null>;
}

@Component({
  selector: 'app-daily-reports',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    UpperCaseInputDirective,
    InputTextModule,
    FieldsetModule,
    InputNumberModule,
    ButtonModule,
    TableModule,
    DividerModule
  ],
  templateUrl: './daily-reports.component.html',
  styleUrl: './daily-reports.component.scss'
})
export class DailyReportsComponent {


  private readonly expenseService = inject(ExpenseService);
  private readonly cashOnHandService = inject(CashOnHandService);

  expenseList: {
    expense_id: string
    expense_detail: string
    expense_amount: number
  }[] = [];


  ngOnInit(): void {
    this.getExpenses();
    this.getCashOnHand();
  }

  expenseForm: FormGroup<ExpenseForm> = new FormGroup<ExpenseForm>({
    expense_detail: new FormControl<string | null>(null),
    expense_amount: new FormControl<string | null>(null),
  });

  cashOnHandForm: FormGroup = new FormGroup<CashOnHandForm>({
    cash_detail: new FormControl<string | null>("Cash on Hand"),
    cash_amount: new FormControl<number | null>(null),
  });

  getCashOnHand() {
    this.cashOnHandService.retrieveCashOnHand().subscribe({
      next: (res: any) => {
        this.cashOnHandForm.patchValue(res.data || {});
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  onSubmit() {
    this.expenseService.addExpense(this.expenseForm.value).subscribe({
      next: () => {
        this.getExpenses();
        this.expenseForm.reset();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getExpenses() {
    this.expenseService.retrieveExpenses().subscribe({
      next: (res: any) => {
        this.expenseList = res;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  saveCashOnHand() {
    this.cashOnHandService.addCashOnHand(this.cashOnHandForm.value).subscribe({
      next: () => {
        this.getCashOnHand();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  deleteExpense(id: any) {
    this.expenseService.deleteExpense(id).subscribe({
      next: () => {
        this.getExpenses();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }


} 
