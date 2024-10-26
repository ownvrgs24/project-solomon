import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { UpperCaseInputDirective } from '../../../../../../../../shared/directives/to-uppercase.directive';
import { DemandNoticeService } from '../../../../../../../../shared/services/delinquent-remediation/demand-notice.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';

interface DemandNotice {
  customer_id: FormControl<string | null>;
  id?: FormControl<string | null>;
  demand_letter_date: FormControl<Date | null>;
  status: FormControl<string | null>;
  returned_date: FormControl<Date | null>;
  remarks: FormControl<string | null>;
}

enum DEMAND_LETTER_STATUS {
  REFUSED_TO_RECEIVE = "REFUSED_TO_RECEIVE",
  MOVED = "MOVED",
  CANNOT_LOCATE = "CANNOT_LOCATE",
  RETURNED = "RETURNED",
}

@Component({
  selector: 'app-demand-notice',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    CalendarModule,
    InputTextModule,
    FieldsetModule,
    DropdownModule,
    CalendarModule,
    InputMaskModule,
    InputTextareaModule,
    UpperCaseInputDirective,
    MessagesModule
  ],
  templateUrl: './demand-notice.component.html',
  styleUrl: './demand-notice.component.scss',
  providers: [MessageService]
})
export class DemandNoticeComponent implements OnInit, OnChanges {

  enum: typeof DEMAND_LETTER_STATUS = DEMAND_LETTER_STATUS;

  @Input({ required: true }) customerId!: string | null;
  @Input({ required: false }) isEditMode: boolean = false;
  @Input({ required: false }) customerData!: any;

  private demandNoticeService = inject(DemandNoticeService);
  private messageService = inject(MessageService);
  private readonly confirmService = inject(ConfirmationService);

  demandNoticeForm: FormGroup<{ records: FormArray<FormGroup<DemandNotice>> }> = new FormGroup({
    records: new FormArray<FormGroup<DemandNotice>>([])
  });

  ngOnInit(): void {
    if (this.isEditMode) {
      this.synchronizeDemandNoticeRecords(this.customerData.dlq_demand_letter || []);
      return;
    }
    this.initializeDemandNoticeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.customerData) {
      if (this.customerData.dlq_demand_letter?.length === 0) {
        this.initializeDemandNoticeForm();
      } else {
        this.synchronizeDemandNoticeRecords(this.customerData.dlq_demand_letter || []);
      }
    }
  }

  synchronizeDemandNoticeRecords(customerData: any) {
    const records = customerData;

    const demandNoticeFormArray = this.demandNoticeForm.get('records') as FormArray;
    demandNoticeFormArray.clear();

    records.forEach(async (record: any, index: number) => {
      demandNoticeFormArray.push(new FormGroup<DemandNotice>({
        customer_id: new FormControl<string | null>(record.customer_id, [Validators.required]),
        id: new FormControl<string | null>(record.id, [Validators.required]),
        demand_letter_date: new FormControl<Date | null>(new Date(record.demand_letter_date), [Validators.required]),
        status: new FormControl<string | null>(record.status, [Validators.required]),
        returned_date: new FormControl<Date | null>(new Date(record.returned_date) ?? null),
        remarks: new FormControl<string | null>(record.remarks),
      }));
      this.statusOnChange({
        value: record.status,
        originalEvent: new Event('statusChange')
      }, index);
    });

  }

  private buildDemandNoticeFormGroup(): FormGroup<DemandNotice> {
    return new FormGroup<DemandNotice>({
      customer_id: new FormControl<string | null>(this.customerId || this.customerData.customer_id, [Validators.required]),
      demand_letter_date: new FormControl<Date | null>(null, [Validators.required]),
      returned_date: new FormControl<Date | null>(null, [Validators.required]),
      status: new FormControl<string | null>(null, [Validators.required]),
      remarks: new FormControl<string | null>(null),
    });

  }

  initializeDemandNoticeForm(): void {
    (this.demandNoticeForm.get('records') as FormArray).push(this.buildDemandNoticeFormGroup());
  }

  removeDemandNotice(index: number, id?: string): void {
    if (this.isEditMode && id) {
      this.deleteDemandNoticeRecords(id, index);
      return;
    }

    (this.demandNoticeForm.get('records') as FormArray)?.removeAt(index);
  }

  statusOptions: { value: string; label: string }[] = [
    { value: DEMAND_LETTER_STATUS.REFUSED_TO_RECEIVE, label: "REFUSED TO RECEIVE" },
    { value: DEMAND_LETTER_STATUS.MOVED, label: "MOVED" },
    { value: DEMAND_LETTER_STATUS.CANNOT_LOCATE, label: "CANNOT LOCATE" },
    { value: DEMAND_LETTER_STATUS.RETURNED, label: "RETURNED" },
  ];

  deleteDemandNoticeRecords(id: string, index: number): void {
    this.confirmService.confirm({
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      header: 'Confirm Delete Address',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      message:
        'Are you sure you want to DELETE this records from the database?',
      accept: () => {
        this.demandNoticeService.deleteDemandNotice(id).subscribe({
          next: (response: any) => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
            this.removeDemandNotice(index);
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete demand notice' });
          }
        })
      }
    });
  }

  upsertDemandNoticeRecords(): void {
    const { records } = this.demandNoticeForm.value;
    this.demandNoticeService.updateDemandNotice(records).subscribe({
      next: (response: any) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
        this.synchronizeDemandNoticeRecords(response.data);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add demand notice' });
      }
    })
  }

  submitForm() {
    if (this.isEditMode) {
      this.upsertDemandNoticeRecords();
      return;
    }
    const { records } = this.demandNoticeForm.value;
    this.demandNoticeService.addDemandNotice(records).subscribe({
      next: (response: any) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add demand notice' });
      }
    })
  }

  statusOnChange($event: DropdownChangeEvent, index: number): void {
    const demandNoticeFormArray = this.demandNoticeForm.get('records') as FormArray;
    const demandNoticeFormGroup = demandNoticeFormArray.at(index) as FormGroup<DemandNotice>;
    const returnedDateControl = demandNoticeFormGroup.get('returned_date');

    if ($event.value === DEMAND_LETTER_STATUS.RETURNED) {
      returnedDateControl?.enable();
      returnedDateControl?.setValue(new Date());
      returnedDateControl?.markAsTouched();
    } else {
      returnedDateControl?.disable();
      returnedDateControl?.setValue(null);
    }
  }

  getSelectedStatus(index: number): string {
    return (this.demandNoticeForm.get('records') as FormArray).at(index).get("status")?.value;
  }


}
