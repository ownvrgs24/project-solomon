import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FieldsetModule } from 'primeng/fieldset';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { UpperCaseInputDirective } from '../../../../../../../shared/directives/to-uppercase.directive';
import { InputNumberModule } from 'primeng/inputnumber';
import { PensionService } from '../../../../../../../shared/services/source-of-income/pension.service';
import { DropdownModule } from 'primeng/dropdown';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';

interface PensionDetails {
  customer_id: FormControl<string | null>;
  amount: FormControl<string | null>;
  pay_frequency: FormControl<string | null>;
  source: FormControl<string | null>;
  remarks: FormControl<string | null>;
}

@Component({
  selector: 'app-pension',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    DividerModule,
    InputTextModule,
    FieldsetModule,
    UpperCaseInputDirective,
    FieldsetModule,
    InputTextareaModule,
    InputNumberModule,
    DropdownModule,
    MessagesModule,
  ],
  templateUrl: './pension.component.html',
  styleUrl: './pension.component.scss',
})
export class PensionComponent {
  @Input({ required: true }) customerId!: string | null;
  @Input({ required: false }) isEditMode: boolean = false;
  @Input({ required: false }) customerData!: any;

  private pensionService = inject(PensionService);
  private messageService = inject(MessageService);

  payfrequency: { label: string; value: string }[] = [
    { label: 'Monthly', value: 'MONTHLY' },
    { label: 'Bi-Monthly', value: 'BI_MONTHLY' },
    { label: 'Semi-Monthly', value: 'SEMI_MONTHLY' },
    { label: 'Weekly', value: 'WEEKLY' },
    { label: 'Daily', value: 'DAILY' },
    { label: 'Quarterly', value: 'QUARTERLY' },
    { label: 'Annually', value: 'ANNUALLY' },
  ];

  pensionFormGroup: FormGroup<PensionDetails> = new FormGroup({
    customer_id: new FormControl<string | null>(this.customerId),
    source: new FormControl<string | null>(null, [Validators.required]),
    amount: new FormControl<string | null>(null, [Validators.required]),
    pay_frequency: new FormControl<string | null>(null),
    remarks: new FormControl<string | null>(null),
  });

  ngOnInit(): void {
    if (this.isEditMode) {
      this.pensionFormGroup.patchValue({
        ...this.customerData?.soi_pension_fund,
        customer_id: this.customerData?.customer_id,
      });
      return;
    }

    this.pensionFormGroup.controls.customer_id.setValue(
      this.customerId || this.customerData?.customer_id
    );
  }

  updatePensionInfo(): void {
    this.pensionService.updatePension(this.pensionFormGroup.value).subscribe({
      next: (response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Pension Updated',
          detail: response.message,
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
      },
    });
  }

  submitForm(): void {
    if (this.isEditMode) {
      this.updatePensionInfo();
      return;
    }

    this.pensionService.addPension(this.pensionFormGroup.value).subscribe({
      next: (response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Pension Added',
          detail: response.message,
        });
        this.pensionFormGroup.disable();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
      },
    });
  }
}
