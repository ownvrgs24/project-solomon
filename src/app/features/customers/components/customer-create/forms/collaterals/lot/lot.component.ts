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
import { CalendarModule } from 'primeng/calendar';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TooltipModule } from 'primeng/tooltip';
import { UpperCaseInputDirective } from '../../../../../../../shared/directives/to-uppercase.directive';
import { KeyFilterModule } from 'primeng/keyfilter';
import { LotService } from '../../../../../../../shared/services/collaterals/lot.service';
import { MessagesModule } from 'primeng/messages';
import { ConfirmationService, MessageService } from 'primeng/api';

interface LotDetails {
  customer_id: FormControl<string | null>;
  id?: FormControl<string | null>;
  l_property_address: FormControl<string | null>;
  l_property_type: FormControl<string | null>;
  l_property_value: FormControl<string | null>;
  l_tax_deed_number: FormControl<string | null>;
  l_tax_declaration_number: FormControl<string | null>;
  l_sqm_area: FormControl<string | null>;
  l_title_number: FormControl<string | null>;
  remarks: FormControl<string | null>;
}

@Component({
  selector: 'app-lot',
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
    MessagesModule,
  ],
  templateUrl: './lot.component.html',
  styleUrl: './lot.component.scss',
})
export class LotComponent implements OnInit, OnChanges {
  @Input({ required: true }) customerId!: string | null;
  @Input({ required: false }) isEditMode: boolean = false;
  @Input({ required: false }) customerData!: any;

  private lotService = inject(LotService);
  private messagesService = inject(MessageService);
  private confirmService = inject(ConfirmationService);

  lotFormGroup: FormGroup<{ lot: FormArray<FormGroup<LotDetails>> }> =
    new FormGroup({
      lot: new FormArray<FormGroup<LotDetails>>([]),
    });

  private buildLotFormGroup(): FormGroup<LotDetails> {
    return new FormGroup<LotDetails>({
      customer_id: new FormControl<string | null>(
        this.customerId || this.customerData.customer_id,
        [Validators.required]
      ),
      id: new FormControl<string | null>(null),
      l_property_address: new FormControl<string | null>(null, [
        Validators.required,
      ]),
      l_property_value: new FormControl<string | null>(null, [
        Validators.required,
      ]),
      l_property_type: new FormControl<string | null>(null),
      l_tax_deed_number: new FormControl<string | null>(null),
      l_tax_declaration_number: new FormControl<string | null>(null),
      l_sqm_area: new FormControl<string | null>(null),
      l_title_number: new FormControl<string | null>(null),
      remarks: new FormControl<string | null>(null),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.customerData) {
      this.synchronizeLotForm(this.customerData.cl_lot);
      if (this.customerData.cl_lot.length === 0) {
        this.initializeLotForm();
      }
    }
  }

  synchronizeLotForm(customerData: any): void {
    const lotRecords = customerData;

    const lotFormArray = this.lotFormGroup.get('lot') as FormArray;
    lotFormArray.clear();

    lotRecords.forEach((record: any) => {
      (this.lotFormGroup.get('lot') as FormArray).push(
        new FormGroup<LotDetails>({
          customer_id: new FormControl<string | null>(
            record.customer_id || this.customerData.customer_id,
            [Validators.required]
          ),
          id: new FormControl<string | null>(record.id),
          l_property_address: new FormControl<string | null>(
            record.l_property_address,
            [Validators.required]
          ),
          l_property_value: new FormControl<string | null>(
            record.l_property_value,
            [Validators.required]
          ),
          l_property_type: new FormControl<string | null>(
            record.l_property_type
          ),
          l_tax_deed_number: new FormControl<string | null>(
            record.l_tax_deed_number
          ),
          l_tax_declaration_number: new FormControl<string | null>(
            record.l_tax_declaration_number
          ),
          l_sqm_area: new FormControl<string | null>(record.l_sqm_area),
          l_title_number: new FormControl<string | null>(record.l_title_number),
          remarks: new FormControl<string | null>(record.remarks),
        })
      );
    });
  }

  ngOnInit(): void {
    if (this.isEditMode) {
      return;
    }
    this.initializeLotForm();
  }

  initializeLotForm(): void {
    (this.lotFormGroup.get('lot') as FormArray)?.push(this.buildLotFormGroup());
  }

  removeLot(index: number, id?: string): void {
    if (this.isEditMode && id) {
      this.deleteLotRecord(id, index);
      return;
    }

    (this.lotFormGroup.get('lot') as FormArray)?.removeAt(index);
  }

  deleteLotRecord(id: string, index: number): void {
    this.confirmService.confirm({
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      header: 'Confirm Delete Lot',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      message: 'Are you sure you want to DELETE this lot from the database?',
      accept: () => {
        this.lotService.deleteLot(id).subscribe({
          next: (response: any) => {
            this.messagesService.add({
              severity: 'success',
              summary: 'Success',
              detail: response.message,
            });
            this.removeLot(index);
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

  upsertLotRecords(): void {
    let { lot } = this.lotFormGroup.value;
    this.lotService.updateLot(lot).subscribe({
      next: (response: any) => {
        this.messagesService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.message,
        });
        this.synchronizeLotForm(response.data);
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
      this.upsertLotRecords();
      return;
    }

    let { lot } = this.lotFormGroup.value;
    this.lotService.addLot(lot).subscribe({
      next: (response: any) => {
        this.messagesService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.message,
        });
        this.synchronizeLotForm(response.data);
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
