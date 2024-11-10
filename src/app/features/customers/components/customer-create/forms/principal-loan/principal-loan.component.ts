import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { LoanService } from '../../../../../../shared/services/loan.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { DividerModule } from 'primeng/divider';
import { InputTextareaModule } from 'primeng/inputtextarea';

interface PrincipalLoan {
  customer_id: FormControl<string | null>;
  loan_amount: FormControl<string | null>;
  loan_interest_rate: FormControl<number | null>;
  loan_mode_of_payment: FormControl<string | null>;
  loan_opening_date: FormControl<Date | null>;
  loan_remarks: FormControl<string | null>;
}

enum MODE_OF_PAYMENT {
  BI_MONTHLY = 'BI_MONTHLY',
  MONTHLY = 'MONTHLY',
}

@Component({
  selector: 'app-principal-loan',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DropdownModule,
    InputNumberModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    MessagesModule,
    ConfirmDialogModule,
    FieldsetModule,
    DividerModule,
    InputTextareaModule
  ],
  templateUrl: './principal-loan.component.html',
  styleUrl: './principal-loan.component.scss',
  providers: [MessageService, ConfirmationService],
})
export class PrincipalLoanComponent implements OnInit {
  readonly loanService = inject(LoanService);
  readonly messagesService = inject(MessageService);
  readonly confirmationService = inject(ConfirmationService);

  @Input({ required: true }) customerId!: string | null;

  paymentModes: typeof MODE_OF_PAYMENT = MODE_OF_PAYMENT;

  paymentScheduleOptions: { value: string; label: string }[] = [
    { value: MODE_OF_PAYMENT.BI_MONTHLY, label: 'BI MONTHLY' },
    { value: MODE_OF_PAYMENT.MONTHLY, label: 'MONTHLY' },
  ];

  principalLoanFormGroup!: FormGroup<PrincipalLoan>;

  ngOnInit(): void {
    this.principalLoanFormGroup = new FormGroup({
      customer_id: new FormControl<string | null>(this.customerId, [
        Validators.required,
      ]),
      loan_amount: new FormControl<string | null>(null, [Validators.required]),
      loan_interest_rate: new FormControl<number | null>(null, [
        Validators.required,
      ]),
      loan_mode_of_payment: new FormControl<string | null>(null, [
        Validators.required,
      ]),
      loan_opening_date: new FormControl<Date | null>(null, [
        Validators.required,
      ]),
      loan_remarks: new FormControl<string | null>(null),
    });
  }

  submitForm() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to submit this loan application?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-text p-button-danger',
      accept: () => {
        this.sendLoanApplication();
        this.principalLoanFormGroup.disable();
      },
    });
  }

  sendLoanApplication() {
    const { value } = this.principalLoanFormGroup;
    this.loanService.sendPrincipalLoanApplication(value).subscribe({
      next: (response: any) => {
        this.messagesService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.message,
        });
      },
      error: (err) => {
        this.messagesService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.message,
        });
      },
    });
  }
}
