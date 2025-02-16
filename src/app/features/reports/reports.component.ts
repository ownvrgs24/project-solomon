import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [ButtonModule, RouterModule, TabMenuModule, CommonModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Daily Report',
        routerLink: ['daily-report']
      },
      {
        label: 'Monthly Report',
        routerLink: ['monthly-report']
      },
      {
        label: 'Annual Report',
        routerLink: ['annual-report']
      },
      {
        label: 'Delinquent Report',
        routerLink: ['delinquent-report']
      }
    ];
  }
}
