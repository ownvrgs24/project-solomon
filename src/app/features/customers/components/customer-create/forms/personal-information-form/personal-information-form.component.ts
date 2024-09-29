import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { UpperCaseInputDirective } from '../../../../../../shared/directives/to-uppercase.directive';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-personal-information-form',
  standalone: true,
  imports: [InputTextModule, InputMaskModule, UpperCaseInputDirective, DropdownModule, CalendarModule],

  templateUrl: './personal-information-form.component.html',
  styleUrl: './personal-information-form.component.scss'
})
export class PersonalInformationFormComponent {

  constructor() { }

}
