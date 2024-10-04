import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { BasicInformationComponent } from "./forms/basic-information/basic-information.component";
import { SecurityInformationComponent } from "./forms/security-information/security-information.component";
import { AdditionalInformationComponent } from "./forms/additional-information/additional-information.component";

@Component({
  selector: 'app-account-create',
  standalone: true,
  imports: [StepperModule, ButtonModule, BasicInformationComponent, SecurityInformationComponent, AdditionalInformationComponent],
  templateUrl: './account-create.component.html',
  styleUrl: './account-create.component.scss'
})
export class AccountCreateComponent {

  registerAccount() {
    throw new Error('Method not implemented.');
  }

}
