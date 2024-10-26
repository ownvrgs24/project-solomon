import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { UpperCaseInputDirective } from '../../../../../../../../shared/directives/to-uppercase.directive';
import { CourtHearingService } from '../../../../../../../../shared/services/delinquent-remediation/court-hearing.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';

interface CourtHearingDetails {
  customer_id: FormControl<string | null>;
  id?: FormControl<string | null>;
  hearing_date: FormControl<Date | null>;
  location: FormControl<string | null>;
  status: FormControl<string | null>;
  remarks: FormControl<string | null>;
}

enum COURT_HEARING_STATUS {
  ATTENDED = 'ATTENDED',
  RESET = 'RESET'
}

@Component({
  selector: 'app-court-hearing',
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
  templateUrl: './court-hearing.component.html',
  styleUrl: './court-hearing.component.scss',
  providers: [MessageService]
})
export class CourtHearingComponent implements OnInit, OnChanges {
  @Input({ required: true }) customerId!: string | null;
  @Input({ required: false }) isEditMode: boolean = false;
  @Input({ required: false }) customerData!: any;

  private courtHearingService = inject(CourtHearingService);
  private messageService = inject(MessageService);
  private readonly confirmService = inject(ConfirmationService);

  courtHearingDetailsForm: FormGroup<{ records: FormArray<FormGroup<CourtHearingDetails>> }> = new FormGroup({
    records: new FormArray<FormGroup<CourtHearingDetails>>([])
  });


  statusOptions: { value: string; label: string }[] = [
    { value: COURT_HEARING_STATUS.ATTENDED, label: "ATTENDED" },
    { value: COURT_HEARING_STATUS.RESET, label: "RESET" },
  ];

  ngOnInit(): void {
    if (this.isEditMode) {
      this.synchronizeCourtHearingRecords(this.customerData.dlq_court_hearing || []);
      return;
    }
    this.initializeCourtHearingForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.customerData) {
      if (this.customerData.dlq_court_hearing?.length === 0) {
        this.initializeCourtHearingForm();
      } else {
        this.synchronizeCourtHearingRecords(this.customerData.dlq_court_hearing || []);
      }
    }
  }

  initializeCourtHearingForm(): void {
    (this.courtHearingDetailsForm.get('records') as FormArray).push(this.buildCourtHearingFormGroup());
  }

  removeCourtHearing(index: number, id?: string): void {
    if (this.isEditMode && id) {
      this.deleteCourtHearingRecord(id, index);
      return;
    }

    (this.courtHearingDetailsForm.get('records') as FormArray)?.removeAt(index);
  }

  private buildCourtHearingFormGroup(): FormGroup<CourtHearingDetails> {
    return new FormGroup<CourtHearingDetails>({
      customer_id: new FormControl<string | null>(this.customerId || this.customerData?.customer_id, [Validators.required]),
      hearing_date: new FormControl<Date | null>(null, [Validators.required]),
      location: new FormControl<string | null>(null, [Validators.required]),
      status: new FormControl<string | null>(null, [Validators.required]),
      remarks: new FormControl<string | null>(null),
    });
  }

  synchronizeCourtHearingRecords(customerData: any): void {
    const records = customerData;

    const recordArray = this.courtHearingDetailsForm.get('records') as FormArray;
    recordArray.clear();

    records.forEach((record: any) => {
      recordArray.push(new FormGroup<CourtHearingDetails>({
        customer_id: new FormControl<string | null>(record.customer_id || this.customerData?.customer_id, [Validators.required]),
        id: new FormControl<string | null>(record.id, [Validators.required]),
        hearing_date: new FormControl<Date | null>(new Date(record.hearing_date), [Validators.required]),
        location: new FormControl<string | null>(record.location, [Validators.required]),
        status: new FormControl<string | null>(record.status, [Validators.required]),
        remarks: new FormControl<string | null>(record.remarks),
      }));
    });
  }

  deleteCourtHearingRecord(id: string, index: number): void {
    this.confirmService.confirm({
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      header: 'Confirm Delete Address',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      message:
        'Are you sure you want to DELETE this records from the database?',
      accept: () => {
        this.courtHearingService.deleteCourtHearing(id).subscribe({
          next: (response: any) => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
            this.removeCourtHearing(index);
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete court hearing' });
          }
        });
      }
    });
  }

  upsertCourtHearingRecords(): void {
    const { records } = this.courtHearingDetailsForm.value;
    this.courtHearingService.updateCourtHearing(records).subscribe({
      next: (response: any) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
        this.synchronizeCourtHearingRecords(response.data);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to upsert court hearing' });
      }
    });
  }

  submitForm(): void {
    if (this.isEditMode) {
      this.upsertCourtHearingRecords();
      return;
    }

    const { records } = this.courtHearingDetailsForm.value;
    this.courtHearingService.addCourtHearing(records).subscribe({
      next: (response: any) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
        this.synchronizeCourtHearingRecords(response.data);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add court hearing' });
      }
    });
  }

}
