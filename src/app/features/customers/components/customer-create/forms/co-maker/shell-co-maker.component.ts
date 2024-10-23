import { Component, Input, signal } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { CustomerListComponent } from '../../../customer-create/forms/co-maker/customer-list/customer-list.component';
import { SignatoryArrangementComponent } from './signatory-arrangement/signatory-arrangement.component';

@Component({
  selector: 'app-shell-co-maker',
  standalone: true,
  imports: [
    TabViewModule,
    CreateProfileComponent,
    CustomerListComponent,
    SignatoryArrangementComponent,
  ],
  templateUrl: './shell-co-maker.component.html',
  styleUrl: './shell-co-maker.component.scss',
})
export class ShellCoMakerComponent {
  @Input({ required: false }) customerId!: string | null;
}
