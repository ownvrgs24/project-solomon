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
import { OtherActionsService } from '../../../../../../../../shared/services/delinquent-remediation/other-actions.service';
import { MessagesModule } from 'primeng/messages';
import { ConfirmationService, MessageService } from 'primeng/api';

interface OtherActions {
  customer_id: FormControl<string | null>;
  id?: FormControl<string | null>;
  remarks: FormControl<string | null>;
}

@Component({
  selector: 'app-other-actions',
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
  templateUrl: './other-actions.component.html',
  styleUrl: './other-actions.component.scss',
  providers: [MessageService]
})
export class OtherActionsComponent implements OnInit, OnChanges {

  @Input({ required: true }) customerId!: string | null;
  @Input({ required: false }) isEditMode: boolean = false;
  @Input({ required: false }) customerData!: any;

  private otherActionsService = inject(OtherActionsService);
  private messageService = inject(MessageService);
  private readonly confirmService = inject(ConfirmationService);

  otherActionsForm: FormGroup<{ records: FormArray<FormGroup<OtherActions>> }> = new FormGroup({
    records: new FormArray<FormGroup<OtherActions>>([])
  });

  private buildOtherActionsFormGroup(): FormGroup<OtherActions> {
    return new FormGroup<OtherActions>({
      customer_id: new FormControl<string | null>(this.customerId || this.customerData.customer_id, [Validators.required]),
      remarks: new FormControl<string | null>(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    if (this.isEditMode) {
      this.synchronizeOtherActionsRecords(this.customerData.dlq_other || []);
      return;
    }
    this.initializeOtherActionsForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.customerData) {
      if (this.customerData.dlq_other?.length === 0) {
        this.initializeOtherActionsForm();
      } else {
        this.synchronizeOtherActionsRecords(this.customerData.dlq_other || []);
      }
    }
  }

  synchronizeOtherActionsRecords(customerData: any): void {
    const records = customerData;

    const recordArray = this.otherActionsForm.get('records') as FormArray;
    recordArray.clear();

    records.forEach((record: any) => {
      recordArray.push(new FormGroup<OtherActions>({
        customer_id: new FormControl<string | null>(record.customer_id || this.customerData.customer_id, [Validators.required]),
        id: new FormControl<string | null>(record.id, [Validators.required]),
        remarks: new FormControl<string | null>(record.remarks, [Validators.required]),
      }));
    });
  }

  initializeOtherActionsForm(): void {
    (this.otherActionsForm.get('records') as FormArray).push(this.buildOtherActionsFormGroup());
  }

  removeOtherActions(index: number, id?: string): void {
    if (this.isEditMode && id) {
      this.deleteOtherActionsRecord(id, index);
      return;
    }

    (this.otherActionsForm.get('records') as FormArray)?.removeAt(index);
  }

  deleteOtherActionsRecord(id: string, index: number): void {
    this.confirmService.confirm({
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      header: 'Confirm Delete Address',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      message:
        'Are you sure you want to DELETE this records from the database?',
      accept: () => {
        this.otherActionsService.deleteOtherAction(id).subscribe({
          next: (response: any) => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
            this.removeOtherActions(index);
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete other actions' });
          }
        });
      }
    });
  }

  upsertOtherActionsRecords(): void {
    const { records } = this.otherActionsForm.value;
    this.otherActionsService.updateOtherAction(records).subscribe({
      next: (response: any) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
        this.synchronizeOtherActionsRecords(response.data);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update other actions' });
      }
    });
  }

  submitForm(): void {
    if (this.isEditMode) {
      this.upsertOtherActionsRecords();
      return;
    }

    const { records } = this.otherActionsForm.value;
    this.otherActionsService.addOtherAction(records).subscribe({
      next: (response: any) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
        this.synchronizeOtherActionsRecords(response.data);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add other actions' });
      }
    });
  }

}
