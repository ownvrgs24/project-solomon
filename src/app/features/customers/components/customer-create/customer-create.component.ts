import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { PersonalInformationFormComponent } from "./forms/personal-information-form/personal-information-form.component";
import { CardModule } from 'primeng/card';
import { AddressFormComponent } from "./forms/address-form/address-form.component";

@Component({
  selector: 'app-customer-create',
  standalone: true,
  imports: [ButtonModule, StepperModule, PersonalInformationFormComponent, CardModule, AddressFormComponent],
  templateUrl: './customer-create.component.html',
  styleUrl: './customer-create.component.scss'
})
export class CustomerCreateComponent {

}
