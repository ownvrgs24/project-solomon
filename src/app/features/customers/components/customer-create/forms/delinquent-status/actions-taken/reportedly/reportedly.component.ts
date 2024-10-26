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
import { ReportedlyService } from '../../../../../../../../shared/services/delinquent-remediation/reportedly.service';
import { MessagesModule } from 'primeng/messages';
import { ConfirmationService, MessageService } from 'primeng/api';

interface Reportedly {
  customer_id: FormControl<string | null>;
  id?: FormControl<string | null>;
  date_reported: FormControl<Date | null>;
  remarks: FormControl<string | null>;
  response: FormControl<string | null>;
}

enum PERSONALLY_REPORTED_RESPONSE {
  PROMISE_TO_PAY = "PROMISE_TO_PAY",
  PROVIDE_NEW_COLLATERAL = "PROVIDE_NEW_COLLATERAL",
}


@Component({
  selector: 'app-reportedly',
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
  templateUrl: './reportedly.component.html',
  styleUrl: './reportedly.component.scss',
  providers: [MessageService]
})
export class ReportedlyComponent implements OnInit, OnChanges {
  @Input({ required: true }) customerId!: string | null;
  @Input({ required: false }) isEditMode: boolean = false;
  @Input({ required: false }) customerData!: any;

  private reportedlyService = inject(ReportedlyService);
  private messageService = inject(MessageService);
  private readonly confirmService = inject(ConfirmationService);

  reportedlyForm: FormGroup<{ records: FormArray<FormGroup<Reportedly>> }> = new FormGroup({
    records: new FormArray<FormGroup<Reportedly>>([])
  });

  private buildReportedlyFormGroup(): FormGroup<Reportedly> {
    return new FormGroup<Reportedly>({
      customer_id: new FormControl<string | null>(this.customerId || this.customerData?.customer_id, [Validators.required]),
      date_reported: new FormControl<Date | null>(null, [Validators.required]),
      response: new FormControl<string | null>(null, [Validators.required]),
      remarks: new FormControl<string | null>(null),
    });
  }

  responseOptions: { value: string; label: string }[] = [
    {
      value: PERSONALLY_REPORTED_RESPONSE.PROMISE_TO_PAY,
      label: "PROMISE TO PAY",
    },
    {
      value: PERSONALLY_REPORTED_RESPONSE.PROVIDE_NEW_COLLATERAL,
      label: "PROVIDE NEW COLLATERAL",
    },
  ];

  initializeReportedlyForm(): void {
    (this.reportedlyForm.get('records') as FormArray).push(this.buildReportedlyFormGroup());
  }

  removeReportedly(index: number, id?: string): void {
    if (this.isEditMode && id) {
      this.deleteReportedlyRecord(id, index);
      return;
    }

    (this.reportedlyForm.get('records') as FormArray)?.removeAt(index);
  }

  ngOnInit(): void {
    if (this.isEditMode) {
      this.synchronizeReportedlyRecords(this.customerData.dlq_personally_reported || []);
      return;
    }
    this.initializeReportedlyForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.customerData) {
      if (this.customerData.dlq_personally_reported?.length === 0) {
        this.initializeReportedlyForm();
      } else {
        this.synchronizeReportedlyRecords(this.customerData.dlq_personally_reported || []);
      }
    }
  }

  synchronizeReportedlyRecords(customerData: any) {
    const records = customerData;

    const reportedlyFormArray = this.reportedlyForm.get('records') as FormArray;
    reportedlyFormArray.clear();

    records.forEach(async (record: any) => {
      reportedlyFormArray.push(new FormGroup<Reportedly>({
        customer_id: new FormControl<string | null>(record.customer_id || this.customerData.customer_id, [Validators.required]),
        id: new FormControl<string | null>(record.id, [Validators.required]),
        date_reported: new FormControl<Date | null>(new Date(record.date_reported), [Validators.required]),
        response: new FormControl<string | null>(record.response, [Validators.required]),
        remarks: new FormControl<string | null>(record.remarks),
      }));
    });
  }

  deleteReportedlyRecord(id: string, index: number): void {
    this.confirmService.confirm({
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      header: 'Confirm Delete Address',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      message:
        'Are you sure you want to DELETE this records from the database?',
      accept: () => {
        this.reportedlyService.deleteReportedly(id).subscribe({
          next: (response: any) => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
            this.removeReportedly(index);
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete reportedly' });
          },
        });
      },
    });
  }

  updateReportedlyRecord(): void {
    const { records } = this.reportedlyForm.value;
    this.reportedlyService.updateReportedly(records).subscribe({
      next: (response: any) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
        this.synchronizeReportedlyRecords(response.data);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update reportedly' });
      },
    });
  }

  submitForm(): void {
    if (this.isEditMode) {
      this.updateReportedlyRecord();
      return;
    }

    const { records } = this.reportedlyForm.value;
    this.reportedlyService.addReportedly(records).subscribe({
      next: (response: any) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
        this.synchronizeReportedlyRecords(response.data);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add reportedly' });
      },
    });
  }



}
