import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { EmploymentComponent } from './employment/employment.component';
import { BusinessComponent } from './business/business.component';
import { SelfEmployedComponent } from './self-employed/self-employed.component';
import { PensionComponent } from './pension/pension.component';
import { OthersComponent } from '../source-of-income/others/others.component';

@Component({
  selector: 'app-shell-source-of-income',
  standalone: true,
  imports: [
    TabViewModule,
    CommonModule,
    EmploymentComponent,
    BusinessComponent,
    SelfEmployedComponent,
    PensionComponent,
    OthersComponent,
  ],
  templateUrl: './shell-source-of-income.component.html',
  styleUrl: './shell-source-of-income.component.scss',
})
export class ShellSourceOfIncomeComponent {
  @Input({ required: false }) customerId!: string | null;

  tabs: { title: string; value: string }[] = [
    { title: 'Employment', value: 'employment' },
    { title: 'Business Owner', value: 'business_owner' },
    { title: 'Self Employed', value: 'self_employed' },
    { title: 'Pension Fund', value: 'pension_fund' },
    { title: 'Others', value: 'others' },
  ];
}
