import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TooltipModule } from 'primeng/tooltip';
import { UpperCaseInputDirective } from '../../../../../../../shared/directives/to-uppercase.directive';
import { OtherService } from '../../../../../../../shared/services/collaterals/other.service';

interface OthersDetails {
  customer_id: FormControl<string | null>;
  remarks: FormControl<string | null>;
}

@Component({
  selector: 'app-others',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DropdownModule,
    TooltipModule,
    InputNumberModule,
    AsyncPipe,
    CommonModule,
    ButtonModule,
    DividerModule,
    InputTextModule,
    FieldsetModule,
    UpperCaseInputDirective,
    FieldsetModule,
    InputNumberModule,
    CalendarModule,
    InputTextareaModule
  ],
  templateUrl: './others.component.html',
  styleUrl: './others.component.scss'
})
export class OthersComponent {
  // TODO: Remove the placeholder from the forms
  // TODO: Add function to send the form data to the API

  @Input({ required: true }) customerId!: string | null;

  private otherCollateralService = inject(OtherService);

  othersFormGroup: FormGroup<OthersDetails> = new FormGroup<OthersDetails>({
    customer_id: new FormControl<string | null>(this.customerId, [Validators.required]),
    remarks: new FormControl<string | null>(null, [Validators.required]),
  });

  ngOnInit(): void {
    this.initializeOtherForm();
  }

  initializeOtherForm() {
    this.othersFormGroup = new FormGroup({
      customer_id: new FormControl<string | null>(this.customerId, [Validators.required]),
      remarks: new FormControl<string | null>(null, [Validators.required]),
    });
  }

  submitForm() {
    if (this.othersFormGroup.valid) {
      this.otherCollateralService.addOtherCollateral(this.othersFormGroup.value).subscribe(
        {
          next: () => {
            console.log('Success');
          },
          error: (err) => {
            console.error(err);
          }
        }
      );
    }
  }

}
