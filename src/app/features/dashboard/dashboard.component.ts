import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardModule, IconFieldModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
