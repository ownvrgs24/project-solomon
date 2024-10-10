import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { UpperCaseInputDirective } from '../../../../../../../shared/directives/to-uppercase.directive';
import { SelfEmployedService } from '../../../../../../../shared/services/source-of-income/self-employed.service';

interface SelfEmployedDetails {
  customer_id: FormControl<string | null>;
  net_income: FormControl<string | null>;
  source: FormControl<string | null>;
  remarks: FormControl<string | null>;
}

@Component({
  selector: 'app-self-employed',
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
    InputTextareaModule,
    InputNumberModule
  ],
  templateUrl: './self-employed.component.html',
  styleUrl: './self-employed.component.scss'
})
export class SelfEmployedComponent {

  @Input({ required: true }) customerId!: string | null;

  private selfEmployedService = inject(SelfEmployedService);

  ngOnInit(): void {
    this.selfEmployedFormGroup.controls.customer_id.setValue(this.customerId);
  }

  selfEmployedFormGroup: FormGroup<SelfEmployedDetails> = new FormGroup({
    customer_id: new FormControl<string | null>(this.customerId, [Validators.required]),
    net_income: new FormControl<string | null>(null, [Validators.required]),
    source: new FormControl<string | null>(null, [Validators.required]),
    remarks: new FormControl<string | null>(null)
  });

  submitForm(): void {
    this.selfEmployedService.addSelfEmployed(this.selfEmployedFormGroup.value).subscribe({
      next: () => {
        console.log('Self-employed form submitted successfully');
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

}
