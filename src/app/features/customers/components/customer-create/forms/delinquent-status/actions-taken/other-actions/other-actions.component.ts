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
import { OtherActionsService } from '../../../../../../../../shared/services/delinquent-remediation/other-actions.service';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';

interface OtherActions {
  customer_id: FormControl<string | null>;
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
export class OtherActionsComponent implements OnInit {
  @Input({ required: true }) customerId!: string | null;

  private otherActionsService = inject(OtherActionsService);
  private messageService = inject(MessageService);

  otherActionsForm: FormGroup<{ records: FormArray<FormGroup<OtherActions>> }> = new FormGroup({
    records: new FormArray<FormGroup<OtherActions>>([])
  });

  private buildOtherActionsFormGroup(): FormGroup<OtherActions> {
    return new FormGroup<OtherActions>({
      customer_id: new FormControl<string | null>(this.customerId, [Validators.required]),
      remarks: new FormControl<string | null>(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.addOtherActions();
  }

  addOtherActions(): void {
    (this.otherActionsForm.get('records') as FormArray).push(this.buildOtherActionsFormGroup());
  }

  removeOtherActions(index: number): void {
    (this.otherActionsForm.get('records') as FormArray)?.removeAt(index);
  }


  submitForm(): void {
    const { records } = this.otherActionsForm.value;
    this.otherActionsService.addOtherAction(records).subscribe({
      next: (response: any) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add other actions' });
      }
    });
  }

}
