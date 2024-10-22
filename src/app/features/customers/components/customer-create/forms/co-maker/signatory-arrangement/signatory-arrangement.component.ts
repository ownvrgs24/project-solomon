import { Component, inject, Input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FieldsetModule } from 'primeng/fieldset';
import { MessagesModule } from 'primeng/messages';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CustomersService } from '../../../../../../../shared/services/customers.service';

interface Signatory {
  customer_id: FormControl<string | null>;
  signatory_arrangement: FormControl<string | null>;
}

@Component({
  selector: 'app-signatory-arrangement',
  standalone: true,
  imports: [
    RadioButtonModule,
    ReactiveFormsModule,
    ButtonModule,
    FieldsetModule,
    DividerModule,
    MessagesModule,
  ],
  templateUrl: './signatory-arrangement.component.html',
  styleUrl: './signatory-arrangement.component.scss',
})
export class SignatoryArrangementComponent {
  @Input({ required: true }) customerId!: string | null;

  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private customersService = inject(CustomersService);

  signatoryForm: FormGroup<Signatory> = new FormGroup<Signatory>({
    customer_id: new FormControl<string | null>(null, [Validators.required]),
    signatory_arrangement: new FormControl<string | null>(null, [
      Validators.required,
    ]),
  });

  ngOnInit(): void {
    this.signatoryForm.get('customer_id')?.setValue(this.customerId as string);
  }

  signatoryOptions: { label: string; value: string }[] = [
    {
      label: 'Signatory by Mrs. Dolly Escobar',
      value: 'DOLLY_ESCOBAR',
    },
    {
      label: 'Signatory by Dr. Claire Escobar',
      value: 'CLAIRE_ESCOBAR',
    },
  ];

  submitSignatoryArrangement(): void {
    this.confirmationService.confirm({
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      message: 'Are you sure you want to submit this signatory arrangement?',
      accept: () => {
        this.customersService
          .updateCustomerSignatoryArrangement(this.signatoryForm.value)
          .subscribe({
            next: (response: any) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: response.message,
              });
              this.signatoryForm.disable();
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error.message,
              });
            },
          });
      },
    });
  }
}
