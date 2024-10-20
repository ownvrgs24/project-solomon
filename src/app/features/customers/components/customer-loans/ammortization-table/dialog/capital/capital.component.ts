import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DividerModule } from 'primeng/divider';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea, InputTextareaModule } from 'primeng/inputtextarea';
import { KeyFilterModule } from 'primeng/keyfilter';
import { UpperCaseInputDirective } from '../../../../../../../shared/directives/to-uppercase.directive';

interface Capital {
  transaction_date: FormControl<Date | null>;
  capital: FormControl<number | null>;
  remarks: FormControl<string | null>;
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
  ],
  templateUrl: './capital.component.html',
  styleUrl: './capital.component.scss',
})
export class CapitalComponent {
  private ref = inject(DynamicDialogRef);
  private readonly confirmationService = inject(ConfirmationService);
  public readonly dialogConfig = inject(DynamicDialogConfig);

  capitalForm: FormGroup<Capital> = new FormGroup({
    transaction_date: new FormControl<Date | null>(new Date(), [
      Validators.required,
    ]),
    capital: new FormControl<number | null>(null, [Validators.required]),
    remarks: new FormControl<string | null>(null),
  });

  submitCapitalForm() {
    const { data } = this.dialogConfig;

    const currentBalance =
      data.transactions[data.interest.selectedIndex].balance;

    const newBalance = currentBalance + this.capitalForm.value.capital;

    this.confirmationService.confirm({
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      acceptLabel: 'Confirm',
      message: 'Are you sure you want to submit this capital?',
      accept: () => {
        this.ref?.close({
          balance: newBalance,
          ...this.capitalForm.value,
          transaction_status: 'FOR_REVIEW',
        });
      },
      reject: () => {
        console.log('Payment cancelled');
      },
    });
  }
}
