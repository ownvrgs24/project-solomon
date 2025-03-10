import { CommonModule } from '@angular/common';
import { Component, inject, } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DividerModule } from 'primeng/divider';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { KeyFilterModule } from 'primeng/keyfilter';
import { UpperCaseInputDirective } from '../../../../../../../shared/directives/to-uppercase.directive';
import { ToastModule } from 'primeng/toast';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TRANSACTION_STATUS } from '../../services/loan-computation.service';

interface Capital {
  transaction_date: FormControl<Date | null>;
  capital: FormControl<number | null>;
  transaction_remarks: FormControl<string | null>;
}

@Component({
  selector: 'app-capital',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    KeyFilterModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    FieldsetModule,
    InputNumberModule,
    DividerModule,
    InputTextareaModule,
    UpperCaseInputDirective,
    ToastModule,
    ConfirmDialogModule,
  ],
  templateUrl: './capital.component.html',
  styleUrl: './capital.component.scss',
})
export class CapitalComponent {

  private ref = inject(DynamicDialogRef);
  public readonly dialogConfig = inject(DynamicDialogConfig);
  private readonly confirmationService = inject(ConfirmationService);

  maxDate: Date = new Date();

  capitalEntryForm: FormGroup<Capital> = new FormGroup<Capital>({
    transaction_date: new FormControl<Date | null>(null, [Validators.required]),
    capital: new FormControl<number | null>(null, [Validators.required]),
    transaction_remarks: new FormControl<string | null>(''),
  })

  submitCapitalEntry() {
    if (this.capitalEntryForm.invalid) { return; }

    const newBalance = this.dialogConfig.data.transactions[this.dialogConfig.data.transactions.length - 1].balance + this.capitalEntryForm.value.capital;

    this.confirmationService.confirm({
      header: 'Confirmation',
      message: 'Are you sure you want to submit this capital entry?',
      accept: () => {
        this.ref.close({
          ...this.capitalEntryForm.value,
          balance: newBalance,
          transaction_status: TRANSACTION_STATUS.APPROVED,
        });
      }
    });
  }

}
