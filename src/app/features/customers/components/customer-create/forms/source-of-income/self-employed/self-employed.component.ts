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
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { UpperCaseInputDirective } from '../../../../../../../shared/directives/to-uppercase.directive';
import { SelfEmployedService } from '../../../../../../../shared/services/source-of-income/self-employed.service';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';
import { GalleriaThumbnails } from 'primeng/galleria';

interface SelfEmployedDetails {
  customer_id: FormControl<string | null>;
  net_income: FormControl<string | null>;
  source: FormControl<string | null>;
  remarks: FormControl<string | null>;
}

@Component({
  selector: 'app-self-employed',
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
    MessagesModule,
  ],
  templateUrl: './self-employed.component.html',
  styleUrl: './self-employed.component.scss',
})
export class SelfEmployedComponent {
  @Input({ required: true }) customerId!: string | null;
  @Input({ required: false }) isEditMode: boolean = false;
  @Input({ required: false }) customerData!: any;

  private selfEmployedService = inject(SelfEmployedService);
  private messagesService = inject(MessageService);

  ngOnInit(): void {
    if (this.isEditMode) {
      this.selfEmployedFormGroup.patchValue({
        ...this.customerData?.soi_self_employed,
        customer_id: this.customerData?.customer_id,
      });
      return;
    }

    this.selfEmployedFormGroup.controls.customer_id.setValue(
      this.customerId || this.customerData?.customer_id
    );
  }

  selfEmployedFormGroup: FormGroup<SelfEmployedDetails> = new FormGroup({
    customer_id: new FormControl<string | null>(this.customerId, [
      Validators.required,
    ]),
    net_income: new FormControl<string | null>(null, [Validators.required]),
    source: new FormControl<string | null>(null, [Validators.required]),
    remarks: new FormControl<string | null>(null),
  });

  updateSelfEmployedInfo(): void {
    this.selfEmployedService
      .updateSelfEmployed(this.selfEmployedFormGroup.value)
      .subscribe({
        next: (response: any) => {
          this.messagesService.add({
            severity: 'success',
            summary: 'Success',
            detail: response.message,
          });
          this.selfEmployedFormGroup.patchValue(response.data);
        },
        error: (error) => {
          this.messagesService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
          });
        },
      });
  }

  submitForm(): void {
    if (this.isEditMode) {
      this.updateSelfEmployedInfo();
      return;
    }

    this.selfEmployedService
      .addSelfEmployed(this.selfEmployedFormGroup.value)
      .subscribe({
        next: (response: any) => {
          this.messagesService.add({
            severity: 'success',
            summary: 'Success',
            detail: response.message,
          });
          this.selfEmployedFormGroup.disable();
        },
        error: (error) => {
          this.messagesService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
          });
        },
      });
  }
}
