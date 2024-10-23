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
import { HouseAndLotService } from '../../../../../../../shared/services/collaterals/house-and-lot.service';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MessagesModule } from 'primeng/messages';
import { ConfirmationService, MessageService } from 'primeng/api';

interface HouseAndLotDetails {
  customer_id: FormControl<string | null>;
  id?: FormControl<string | null>;
  hal_property_address: FormControl<string | null>;
  hal_property_type: FormControl<string | null>;
  hal_property_value: FormControl<string | null>;
  hal_tax_deed_number: FormControl<string | null>;
  hal_tax_declaration_number: FormControl<string | null>;
  hal_sqm_area: FormControl<string | null>;
  hal_title_number: FormControl<string | null>;
  remarks: FormControl<string | null>;
}

@Component({
  selector: 'app-house-and-lot',
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
  templateUrl: './house-and-lot.component.html',
  styleUrl: './house-and-lot.component.scss',
})
export class HouseAndLotComponent implements OnInit, OnChanges {
  // TODO: Remove the placeholder from the forms
  // TODO: Add function to send the form data to the API

  @Input({ required: true }) customerId!: string | null;
  @Input({ required: false }) isEditMode: boolean = false;
  @Input({ required: false }) customerData!: any;

  private houseAndLotService = inject(HouseAndLotService);
  private messagesService = inject(MessageService);
  private confirmService = inject(ConfirmationService);

  houseAndLotFormGroup: FormGroup<{
    houseAndLot: FormArray<FormGroup<HouseAndLotDetails>>;
  }> = new FormGroup({
    houseAndLot: new FormArray<FormGroup<HouseAndLotDetails>>([]),
  });

  ngOnInit(): void {
    if (this.isEditMode) {
      return;
    }
    this.initializeHouseAndLotForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.customerData) {
      this.synchronizeHouseAndLotForm(this.customerData.cl_house_and_lot);
    }
  }

  synchronizeHouseAndLotForm(customerData: any): void {
    const houseAndLotRecords = customerData;

    const houseAndLotFormArray = this.houseAndLotFormGroup.get(
      'houseAndLot'
    ) as FormArray;
    houseAndLotFormArray.clear();

    houseAndLotRecords.forEach((record: any) => {
      (this.houseAndLotFormGroup.get('houseAndLot') as FormArray).push(
        new FormGroup<HouseAndLotDetails>({
          customer_id: new FormControl<string | null>(
            record.customer_id || this.customerData.customer_id,
            [Validators.required]
          ),
          id: new FormControl<string | null>(record.id),
          hal_property_address: new FormControl<string | null>(
            record.hal_property_address,
            [Validators.required]
          ),
          hal_property_value: new FormControl<string | null>(
            record.hal_property_value,
            [Validators.required]
          ),
          hal_property_type: new FormControl<string | null>(
            record.hal_property_type
          ),
          hal_tax_deed_number: new FormControl<string | null>(
            record.hal_tax_deed_number
          ),
          hal_tax_declaration_number: new FormControl<string | null>(
            record.hal_tax_declaration_number
          ),
          hal_sqm_area: new FormControl<string | null>(record.hal_sqm_area),
          hal_title_number: new FormControl<string | null>(
            record.hal_title_number
          ),
          remarks: new FormControl<string | null>(record.remarks),
        })
      );
    });
  }

  private buildHouseAndLotFormGroup(): FormGroup<HouseAndLotDetails> {
    return new FormGroup<HouseAndLotDetails>({
      customer_id: new FormControl<string | null>(
        this.customerId || this.customerData.customer_id,
        [Validators.required]
      ),
      hal_property_address: new FormControl<string | null>(null, [
        Validators.required,
      ]),
      hal_property_value: new FormControl<string | null>(null, [
        Validators.required,
      ]),
      hal_property_type: new FormControl<string | null>(null),
      hal_tax_deed_number: new FormControl<string | null>(null),
      hal_tax_declaration_number: new FormControl<string | null>(null),
      hal_sqm_area: new FormControl<string | null>(null),
      hal_title_number: new FormControl<string | null>(null),
      remarks: new FormControl<string | null>(null),
    });
  }

  initializeHouseAndLotForm(): void {
    (this.houseAndLotFormGroup.get('houseAndLot') as FormArray)?.push(
      this.buildHouseAndLotFormGroup()
    );
  }

  removeHouseAndLot(index: number, id?: string): void {
    if (this.isEditMode && id) {
      this.deleteHouseAndLotRecord(id, index);
      return;
    }

    (this.houseAndLotFormGroup.get('houseAndLot') as FormArray)?.removeAt(
      index
    );
  }

  deleteHouseAndLotRecord(id: string, index: number) {
    this.confirmService.confirm({
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      header: 'Confirm Delete Address',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      message:
        'Are you sure you want to DELETE this address from the database?',
      accept: () => {
        this.houseAndLotService.deleteHouseAndLot(id).subscribe({
          next: (response: any) => {
            this.messagesService.add({
              severity: 'success',
              summary: 'Success',
              detail: response.message,
            });
            this.removeHouseAndLot(index);
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

  upsertHouseAndLotRecords(): void {
    let { houseAndLot } = this.houseAndLotFormGroup.value;
    this.houseAndLotService.updateHouseAndLot(houseAndLot).subscribe({
      next: (response: any) => {
        this.messagesService.add({
          severity: 'success',
          summary: 'House and Lot Updated',
          detail: response.message,
        });
        this.synchronizeHouseAndLotForm(response.data);
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
      this.upsertHouseAndLotRecords();
      return;
    }

    let { houseAndLot } = this.houseAndLotFormGroup.value;
    this.houseAndLotService.addHouseAndLot(houseAndLot).subscribe({
      next: (response: any) => {
        this.messagesService.add({
          severity: 'success',
          summary: 'House and Lot Added',
          detail: response.message,
        });
        this.synchronizeHouseAndLotForm(response.data);
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
