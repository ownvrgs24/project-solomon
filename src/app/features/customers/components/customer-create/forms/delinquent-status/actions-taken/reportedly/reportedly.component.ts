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
import { ReportedlyService } from '../../../../../../../../shared/services/delinquent-remediation/reportedly.service';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';

interface Reportedly {
  customer_id: FormControl<string | null>;
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
export class ReportedlyComponent implements OnInit {

  @Input({ required: true }) customerId!: string | null;

  private reportedlyService = inject(ReportedlyService);
  private messageService = inject(MessageService);

  reportedlyForm: FormGroup<{ records: FormArray<FormGroup<Reportedly>> }> = new FormGroup({
    records: new FormArray<FormGroup<Reportedly>>([])
  });

  private buildReportedlyFormGroup(): FormGroup<Reportedly> {
    return new FormGroup<Reportedly>({
      customer_id: new FormControl<string | null>(this.customerId, [Validators.required]),
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

  addReportedly(): void {
    (this.reportedlyForm.get('records') as FormArray).push(this.buildReportedlyFormGroup());
  }

  removeReportedly(index: number): void {
    (this.reportedlyForm.get('records') as FormArray)?.removeAt(index);
  }

  ngOnInit(): void {
    this.addReportedly();
  }

  submitForm(): void {
    const { records } = this.reportedlyForm.value;
    this.reportedlyService.addReportedly(records).subscribe({
      next: (reponse: any) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: reponse.message });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add reportedly' });
      },
    });
  }



}
