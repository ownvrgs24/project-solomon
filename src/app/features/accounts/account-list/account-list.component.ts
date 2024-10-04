import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [ButtonModule, RouterModule],
  templateUrl: './account-list.component.html',
  styleUrl: './account-list.component.scss'
})
export class AccountListComponent {

  createNewAccount() {
    throw new Error('Method not implemented.');
  }

}
