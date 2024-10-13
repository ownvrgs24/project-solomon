import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
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
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';

interface CourtHearingDetails {
  customer_id: FormControl<string | null>;
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
export class CourtHearingComponent implements OnInit {

  @Input({ required: true }) customerId!: string | null;

  private courtHearingService = inject(CourtHearingService);
  private messageService = inject(MessageService);

  courtHearingDetailsForm: FormGroup<{ records: FormArray<FormGroup<CourtHearingDetails>> }> = new FormGroup({
    records: new FormArray<FormGroup<CourtHearingDetails>>([])
  });

  private buildCourtHearingFormGroup(): FormGroup<CourtHearingDetails> {
    return new FormGroup<CourtHearingDetails>({
      customer_id: new FormControl<string | null>(this.customerId, [Validators.required]),
      hearing_date: new FormControl<Date | null>(null, [Validators.required]),
      location: new FormControl<string | null>(null, [Validators.required]),
      status: new FormControl<string | null>(null, [Validators.required]),
      remarks: new FormControl<string | null>(null),
    });
  }

  statusOptions: { value: string; label: string }[] = [
    { value: COURT_HEARING_STATUS.ATTENDED, label: "ATTENDED" },
    { value: COURT_HEARING_STATUS.RESET, label: "RESET" },
  ];

  ngOnInit(): void {
    this.addCourtHearing();
  }

  addCourtHearing(): void {
    (this.courtHearingDetailsForm.get('records') as FormArray).push(this.buildCourtHearingFormGroup());
  }

  removeCourtHearing(index: number): void {
    (this.courtHearingDetailsForm.get('records') as FormArray)?.removeAt(index);
  }

  submitForm(): void {
    const { records } = this.courtHearingDetailsForm.value;
    this.courtHearingService.addCourtHearing(records).subscribe({
      next: (response: any) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add court hearing' });
      }
    });
  }

}
