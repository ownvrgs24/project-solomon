import { AsyncPipe, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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

interface ItemDetails {
  customer_id: FormControl<string | null>;
  item_description: FormControl<string | null>;
  item_serial_number: FormControl<string | null>;
  item_quantity: FormControl<string | null>;
  item_monetary_value: FormControl<string | null>;
  date_acquired: FormControl<string | null>;
  remarks: FormControl<string | null>;
}


@Component({
  selector: 'app-items',
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
  templateUrl: './items.component.html',
  styleUrl: './items.component.scss'
})


export class ItemsComponent {
  // TODO: Remove the placeholder from the forms
  // TODO: Add function to send the form data to the API

  itemsFormGroup: FormGroup<{ items: FormArray<FormGroup<ItemDetails>> }> = new FormGroup({
    items: new FormArray([this.buildItemFormGroup()])
  });

  private buildItemFormGroup(): FormGroup<ItemDetails> {
    return new FormGroup<ItemDetails>({
      customer_id: new FormControl<string | null>('1'),
      item_description: new FormControl<string | null>(null, [Validators.required]),
      item_monetary_value: new FormControl<string | null>(null, [Validators.required]),
      item_serial_number: new FormControl<string | null>(null),
      item_quantity: new FormControl<string | null>(null),
      date_acquired: new FormControl<string | null>(null),
      remarks: new FormControl<string | null>(null)
    });
  }

  addItem(): void {
    (this.itemsFormGroup.get('items') as FormArray)?.push(this.buildItemFormGroup());
  }

  removeItem(index: number): void {
    (this.itemsFormGroup.get('items') as FormArray)?.removeAt(index);
  }

}
