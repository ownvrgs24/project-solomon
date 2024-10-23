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
import { KeyFilterModule } from 'primeng/keyfilter';
import { AtmCardService } from '../../../../../../../shared/services/collaterals/atm-card.service';
import { MessagesModule } from 'primeng/messages';
import { ConfirmationService, MessageService } from 'primeng/api';

interface CardDetails {
  customer_id: FormControl<string | null>;
  id?: FormControl<string | null>;
  issuing_bank: FormControl<string | null>;
  card_number: FormControl<string | null>;
  account_number: FormControl<string | null>;
  account_name: FormControl<string | null>;
  account_type: FormControl<string | null>;
  pin: FormControl<string | null>;
  username: FormControl<string | null>;
  password: FormControl<string | null>;
  remarks: FormControl<string | null>;
}

interface CardData {
  customer_id: string;
  id: string;
  issuing_bank: string;
  card_number: string;
  account_number: string;
  account_name: string;
  account_type: string;
  pin: string;
  username: string;
  password: string;
  remarks: string;
}

@Component({
  selector: 'app-atm-card',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DropdownModule,
    TooltipModule,
    AsyncPipe,
    CommonModule,
    ButtonModule,
    DividerModule,
    InputTextModule,
    FieldsetModule,
    UpperCaseInputDirective,
    FieldsetModule,
    InputNumberModule,
    KeyFilterModule,
    MessagesModule,
    DropdownModule,
  ],
  templateUrl: './atm-card.component.html',
  styleUrl: './atm-card.component.scss',
})
export class AtmCardComponent implements OnInit, OnChanges {
  @Input({ required: true }) customerId!: string | null;
  @Input({ required: false }) isEditMode: boolean = false;
  @Input({ required: false }) customerData!: any;

  // TODO: Remove the placeholder from the forms
  // TODO: Add function to send the form data to the API

  accountTypes: { value: string; label: string }[] = [
    { value: 'savings', label: 'Savings' },
    { value: 'current', label: 'Current' },
    { value: 'joint', label: 'Joint' },
    { value: 'others', label: 'Others' },
    { value: 'checking', label: 'Checking' },
    { value: 'cds', label: 'Certificates of deposit (CDs)' },
    { value: 'money_market', label: 'Money market accounts' },
    { value: 'fixed_deposit', label: 'Fixed deposit accounts' },
    { value: 'recurring_deposit', label: 'Recurring deposit accounts' },
  ];

  private atmCardService = inject(AtmCardService);
  private messagesService = inject(MessageService);
  private confirmService = inject(ConfirmationService);

  alphabetWithSpace: RegExp = new RegExp('^[a-zA-Z ]*$');

  atmCardFormGroup: FormGroup<{ card: FormArray<FormGroup<CardDetails>> }> =
    new FormGroup({
      card: new FormArray<FormGroup<CardDetails>>([]),
    });

  private buildAtmCardFormGroup(): FormGroup<CardDetails> {
    return new FormGroup<CardDetails>({
      customer_id: new FormControl<string | null>(
        this.customerId || this.customerData.customer_id,
        [Validators.required]
      ),
      account_name: new FormControl<string | null>(null, [Validators.required]),
      account_number: new FormControl<string | null>(null, [
        Validators.required,
      ]),
      card_number: new FormControl<string | null>(null, [Validators.required]),
      pin: new FormControl<string | null>(null, [Validators.required]),
      issuing_bank: new FormControl<string | null>(null, [Validators.required]),
      account_type: new FormControl<string | null>(null, [Validators.required]),
      username: new FormControl<string | null>(null),
      password: new FormControl<string | null>(null),
      remarks: new FormControl<string | null>(null),
    });
  }

  initializeCardForm() {
    (this.atmCardFormGroup.get('card') as FormArray)?.push(
      this.buildAtmCardFormGroup()
    );
  }

  synchronizeAtmCardRecords(customerData: any) {
    const card = customerData;

    const cardArray = this.atmCardFormGroup.get('card') as FormArray;
    cardArray.clear();

    card.forEach((record: CardData) => {
      (this.atmCardFormGroup.get('card') as FormArray).push(
        new FormGroup<CardDetails>({
          customer_id: new FormControl<string | null>(
            record.customer_id ?? null
          ),
          id: new FormControl<string | null>(record.id ?? null),
          account_name: new FormControl<string | null>(
            record.account_name ?? null
          ),
          account_number: new FormControl<string | null>(
            record.account_number ?? null
          ),
          card_number: new FormControl<string | null>(
            record.card_number ?? null
          ),
          pin: new FormControl<string | null>(record.pin ?? null),
          issuing_bank: new FormControl<string | null>(
            record.issuing_bank ?? null
          ),
          account_type: new FormControl<string | null>(
            record.account_type ?? null
          ),
          username: new FormControl<string | null>(record.username ?? null),
          password: new FormControl<string | null>(record.password ?? null),
          remarks: new FormControl<string | null>(record.remarks ?? null),
        })
      );
    });
  }

  removeCardForm(index: number, id?: string) {
    if (this.isEditMode && id) {
      this.deleteAtmCardRecord(id, index);
      return;
    }

    (this.atmCardFormGroup.get('card') as FormArray)?.removeAt(index);
  }

  ngOnInit(): void {
    if (this.isEditMode) {
      return;
    }
    this.initializeCardForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.customerData) {
      this.synchronizeAtmCardRecords(this.customerData.cl_atm_card);
      if (this.customerData.cl_atm_card.length === 0) {
        this.initializeCardForm();
      }
    }
  }

  upsertAtmCardRecords() {
    let { card } = this.atmCardFormGroup.value;
    this.atmCardService.updateAtmCard(card).subscribe({
      next: (response: any) => {
        this.messagesService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.message,
        });
        this.synchronizeAtmCardRecords(response.data);
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
      this.upsertAtmCardRecords();
      return;
    }

    let { card } = this.atmCardFormGroup.value;
    this.atmCardService.addAtmCard(card).subscribe({
      next: (response: any) => {
        this.messagesService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.message,
        });
        this.atmCardFormGroup.disable();
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

  deleteAtmCardRecord(id: string, index: number) {
    this.confirmService.confirm({
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      header: 'Confirm Delete Address',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      message:
        'Are you sure you want to DELETE this address from the database?',
      accept: () => {
        this.atmCardService.deleteAtmCard(id).subscribe({
          next: (response: any) => {
            this.messagesService.add({
              severity: 'success',
              summary: 'Success',
              detail: response.message,
            });
            this.removeCardForm(index);
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
}
