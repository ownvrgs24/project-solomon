import { AsyncPipe, CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { UpperCaseInputDirective } from '../../../../../../../shared/directives/to-uppercase.directive';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { KeyFilterModule } from 'primeng/keyfilter';
import { BankCheckService } from '../../../../../../../shared/services/collaterals/bank-check.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';

interface BankCheckDetails {
  customer_id: FormControl<string | null>;
  id?: FormControl<string | null>;
  check_date: FormControl<Date | null>;
  issuing_bank: FormControl<string | null>;
  amount: FormControl<string | null>;
  check_number: FormControl<string | null>;
  payee: FormControl<string | null>;
  date_acquired: FormControl<Date | null>;
  remarks: FormControl<string | null>;
}

@Component({
  selector: 'app-bank-check',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DropdownModule,
    TooltipModule,
    InputNumberModule,
    AsyncPipe,
    CommonModule,
    ButtonModule,
    DividerModule,
    InputTextModule,
    FieldsetModule,
    UpperCaseInputDirective,
    FieldsetModule,
    InputNumberModule,
    CalendarModule,
    InputTextareaModule,
    KeyFilterModule,
    UpperCaseInputDirective,
    MessagesModule,
  ],
  templateUrl: './bank-check.component.html',
  styleUrl: './bank-check.component.scss',
})
export class BankCheckComponent implements OnInit, OnChanges {
  @Input({ required: true }) customerId!: string | null;
  @Input({ required: false }) isEditMode: boolean = false;
  @Input({ required: false }) customerData!: any;

  private bankCheckService = inject(BankCheckService);
  private messagesService = inject(MessageService);
  private confirmService = inject(ConfirmationService);

  bankCheckFormGroup: FormGroup<{
    check: FormArray<FormGroup<BankCheckDetails>>;
  }> = new FormGroup({
    check: new FormArray<FormGroup<BankCheckDetails>>([]),
  });

  private buildBankCheckFormGroup(): FormGroup<BankCheckDetails> {
    return new FormGroup<BankCheckDetails>({
      customer_id: new FormControl<string | null>(
        this.customerId || this.customerData.customer_id,
        [Validators.required]
      ),
      payee: new FormControl<string | null>(null, [Validators.required]),
      amount: new FormControl<string | null>(null, [Validators.required]),
      check_date: new FormControl<Date | null>(null),
      issuing_bank: new FormControl<string | null>(null),
      check_number: new FormControl<string | null>(null),
      date_acquired: new FormControl<Date | null>(null),
      remarks: new FormControl<string | null>(null),
    });
  }

  ngOnInit(): void {
    if (this.isEditMode) {
      return;
    }
    this.initializeBankCheckForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.customerData) {
      this.synchronizeBankCheckForm(this.customerData.cl_bank_check);
    }
  }

  synchronizeBankCheckForm(customerData: any) {
    const checks = customerData;

    // Reset the form array to avoid duplicates
    const checkArray = this.bankCheckFormGroup.get('check') as FormArray;
    checkArray.clear();

    checks.forEach((record: any) => {
      (this.bankCheckFormGroup.get('check') as FormArray).push(
        new FormGroup<BankCheckDetails>({
          customer_id: new FormControl<string | null>(
            record.customer_id || this.customerData.customer_id,
            [Validators.required]
          ),
          id: new FormControl<string | null>(record.id),
          payee: new FormControl<string | null>(record.payee, [
            Validators.required,
          ]),
          amount: new FormControl<string | null>(record.amount, [
            Validators.required,
          ]),
          check_date: new FormControl<Date | null>(new Date(record.check_date)),
          issuing_bank: new FormControl<string | null>(record.issuing_bank),
          check_number: new FormControl<string | null>(record.check_number),
          date_acquired: new FormControl<Date | null>(
            new Date(record.date_acquired)
          ),
          remarks: new FormControl<string | null>(record.remarks),
        })
      );
    });
  }

  initializeBankCheckForm() {
    (this.bankCheckFormGroup.get('check') as FormArray).push(
      this.buildBankCheckFormGroup()
    );
  }

  removeBankCheckForm(index: number, id?: string) {
    if (this.isEditMode && id) {
      this.deleteBankCheckRecord(id, index);
      return;
    }

    (this.bankCheckFormGroup.get('check') as FormArray).removeAt(index);
  }

  deleteBankCheckRecord(id: string, index: number) {
    this.confirmService.confirm({
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      header: 'Confirm Delete Address',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      message:
        'Are you sure you want to DELETE this address from the database?',
      accept: () => {
        this.bankCheckService.deleteBankCheck(id).subscribe({
          next: (response: any) => {
            this.messagesService.add({
              severity: 'success',
              summary: 'Success',
              detail: response.message,
            });
            this.removeBankCheckForm(index);
          },
          error: (error) => {
            this.messagesService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message,
            });
          },
        });
      },
    });
  }

  upsertBankCheckRecord() {
    const { check } = this.bankCheckFormGroup.value;
    this.bankCheckService.updateBankCheck(check).subscribe({
      next: (response: any) => {
        this.messagesService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.message,
        });
        this.synchronizeBankCheckForm(response.data);
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

  submitForm() {
    if (this.isEditMode) {
      this.upsertBankCheckRecord();
      return;
    }

    let { check } = this.bankCheckFormGroup.value;
    this.bankCheckService.addBankCheck(check).subscribe({
      next: (response: any) => {
        this.messagesService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.message,
        });
        this.bankCheckFormGroup.disable();
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
