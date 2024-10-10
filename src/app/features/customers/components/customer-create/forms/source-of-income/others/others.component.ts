import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FieldsetModule } from 'primeng/fieldset';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { UpperCaseInputDirective } from '../../../../../../../shared/directives/to-uppercase.directive';
import { OtherService } from '../../../../../../../shared/services/source-of-income/other.service';

interface OthersDetails {
  customer_id: FormControl<string | null>;
  remarks: FormControl<string | null>;
}

@Component({
  selector: 'app-others',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    DividerModule,
    InputTextModule,
    FieldsetModule,
    UpperCaseInputDirective,
    FieldsetModule,
    InputTextareaModule
  ],
  templateUrl: './others.component.html',
  styleUrl: './others.component.scss'
})
export class OthersComponent {

  @Input({ required: true }) customerId!: string | null;

  private otherIncomeService = inject(OtherService);

  othersFormGroup: FormGroup<OthersDetails> = new FormGroup({
    customer_id: new FormControl<string | null>('1'),
    remarks: new FormControl<string | null>(null, [Validators.required]),
  });

  ngOnInit(): void {
    this.othersFormGroup.controls.customer_id.setValue(this.customerId);
  }

  submitForm(): void {
    this.otherIncomeService.addOther(this.othersFormGroup.value).subscribe({
      next: () => {
        console.log('Other income form submitted successfully');
      },
      error: (error) => {
        console.error('Error submitting other income form', error);
      }
    });
  }

}
