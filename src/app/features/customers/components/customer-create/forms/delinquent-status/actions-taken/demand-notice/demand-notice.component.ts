import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
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
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';

interface DemandNotice {
  customer_id: FormControl<string | null>;
  demand_letter_date: FormControl<Date | null>;
  status: FormControl<string | null>;
  returned_date?: FormControl<Date | null>;
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
export class DemandNoticeComponent implements OnInit {


  enum: typeof DEMAND_LETTER_STATUS = DEMAND_LETTER_STATUS;

  @Input({ required: true }) customerId!: string | null;

  private demandNoticeService = inject(DemandNoticeService);
  private messageService = inject(MessageService);

  demandNoticeForm: FormGroup<{ records: FormArray<FormGroup<DemandNotice>> }> = new FormGroup({
    records: new FormArray<FormGroup<DemandNotice>>([])
  });

  ngOnInit(): void {
    this.addDemandNotice();
  }

  private buildDemandNoticeFormGroup(): FormGroup<DemandNotice> {
    return new FormGroup<DemandNotice>({
      customer_id: new FormControl<string | null>(this.customerId, [Validators.required]),
      demand_letter_date: new FormControl<Date | null>(null, [Validators.required]),
      status: new FormControl<string | null>(null, [Validators.required]),
      remarks: new FormControl<string | null>(null),
    });
  }

  addDemandNotice(): void {
    (this.demandNoticeForm.get('records') as FormArray).push(this.buildDemandNoticeFormGroup());
  }

  removeDemandNotice(index: number): void {
    (this.demandNoticeForm.get('records') as FormArray)?.removeAt(index);
  }

  statusOptions: { value: string; label: string }[] = [
    {
      value: DEMAND_LETTER_STATUS.REFUSED_TO_RECEIVE, label: "REFUSED TO RECEIVE",
    },
    { value: DEMAND_LETTER_STATUS.MOVED, label: "MOVED" },
    {
      value: DEMAND_LETTER_STATUS.CANNOT_LOCATE,
      label: "CANNOT LOCATE",
    },
    { value: DEMAND_LETTER_STATUS.RETURNED, label: "RETURNED" },
  ];

  submitForm() {
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

    if ($event.value === DEMAND_LETTER_STATUS.RETURNED) {
      demandNoticeFormGroup.addControl('returned_date', new FormControl<Date | null>(null, [Validators.required]));
    } else {
      demandNoticeFormGroup.removeControl('returned_date');
    }
  }

  getSelectedStatus(index: number): string {
    return (this.demandNoticeForm.get('records') as FormArray).at(index).get("status")?.value;
  }


}
