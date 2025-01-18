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
import { ConfirmationService, MessageService } from 'primeng/api';

interface ExpenseForm {
  expense_detail: FormControl<string | null>;
  expense_amount: FormControl<string | null>;
}

interface CashOnHandForm {
  cash_id: FormControl<string | null>;
  cash_detail: FormControl<string | null>;
  cash_amount: FormControl<number | null>;
  is_locked: FormControl<boolean | null>;
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

  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
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
    cash_id: new FormControl<string | null>(null),
    cash_detail: new FormControl<string | null>('cash_on_hand'),
    cash_amount: new FormControl<number | null>(null),
    is_locked: new FormControl<boolean | null>(false),
  });

  lockCashOnHand() {
    this.confirmationService.confirm({
      header: 'Lock Cash on Hand',
      message: 'Are you sure you want to lock cash on hand?',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.cashOnHandForm.disable();
        this.cashOnHandService.updateCashOnHand({
          ...this.cashOnHandForm.value,
          is_locked: true
        }).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Cash on hand locked' });
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to lock cash on hand' });
          }
        });
      }
    });
  }

  getCashOnHand() {
    this.cashOnHandService.retrieveCashOnHand().subscribe({
      next: (res: any) => {
        this.cashOnHandForm.patchValue(res.data || {});
        if (res.data?.is_locked) {
          this.cashOnHandForm.disable();
          this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Cash on hand is locked' });
        }
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
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Expense saved' });
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save expense' });
      }
    });
  }

  getExpenses() {
    this.expenseService.retrieveExpenses().subscribe({
      next: (res: any) => {
        this.expenseList = res;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to retrieve expenses' });
      }
    });
  }

  saveCashOnHand() {
    this.cashOnHandService.addCashOnHand(this.cashOnHandForm.value).subscribe({
      next: () => {
        this.getCashOnHand();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Cash on hand saved' });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save cash on hand' });
      },
    });
  }

  deleteExpense(id: any) {
    this.confirmationService.confirm({
      header: 'Delete Expense',
      message: 'Are you sure you want to delete this expense?',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.expenseService.deleteExpense(id).subscribe({
          next: () => {
            this.getExpenses();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Expense deleted' });
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete expense' });
          }
        });
      },
    });
  }
} 
