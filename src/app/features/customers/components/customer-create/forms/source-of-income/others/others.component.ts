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
import { OtherService } from '../../../../../../../shared/services/source-of-income/other.service';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';

interface OthersDetails {
  customer_id: FormControl<string | null>;
  remarks: FormControl<string | null>;
}

@Component({
  selector: 'app-others',
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
    MessagesModule,
  ],
  templateUrl: './others.component.html',
  styleUrl: './others.component.scss',
})
export class OthersComponent {
  @Input({ required: true }) customerId!: string | null;
  @Input({ required: false }) isEditMode: boolean = false;
  @Input({ required: false }) customerData!: any;

  private otherIncomeService = inject(OtherService);
  private messageService = inject(MessageService);

  othersFormGroup: FormGroup<OthersDetails> = new FormGroup({
    customer_id: new FormControl<string | null>(null, [Validators.required]),
    remarks: new FormControl<string | null>(null, [Validators.required]),
  });

  ngOnInit(): void {
    if (this.isEditMode) {
      this.othersFormGroup.patchValue({
        ...this.customerData?.soi_other,
        customer_id: this.customerData?.customer_id,
      });
    }

    this.othersFormGroup.controls.customer_id.setValue(
      this.customerId || this.customerData?.customer_id
    );
  }

  updateOtherSourceOfIncome(): void {
    this.otherIncomeService.updateOther(this.othersFormGroup.value).subscribe({
      next: (response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.message,
        });
        this.othersFormGroup.patchValue(response.data);
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
      this.updateOtherSourceOfIncome();
      return;
    }

    this.otherIncomeService.addOther(this.othersFormGroup.value).subscribe({
      next: (response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.message,
        });
        this.othersFormGroup.disable();
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
