import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { UpperCaseInputDirective } from '../../../shared/directives/to-uppercase.directive';
import { AccountService } from '../../../shared/services/account.service';

export interface Account {
  recno: string;
  account_id: string;
  username: string;
  password: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  extension_name: string;
  email_address: string;
  date_of_birth: string;
  contact_number: string;
  profile_picture: string;
  gender: string;
  role: string;
  account_status: string;
  updated_at: string;
  created_at: string;
  is_deleted: string;
  restrictions: string;
  user_account_address: {
    complete_address: string;
  }[];
  address?: string;
}

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [RouterModule, ButtonModule, TableModule, IconFieldModule, FormsModule, InputIconModule, InputTextModule, CommonModule, TagModule, UpperCaseInputDirective],
  templateUrl: './account-list.component.html',
  styleUrl: './account-list.component.scss',
  providers: []
})
export class AccountListComponent {

  loading: boolean = true;
  accounts: Account[] = [];
  searchValue!: string;

  readonly accountService = inject(AccountService);

  ngOnInit(): void {
    this.fetchAccounts();
  }

  fetchAccounts() {
    this.loading = true;
    this.accountService.fetchAccounts().subscribe((accounts) => {
      this.accounts = accounts as Account[];
      this.loading = false;
    });
  }

  createNewAccount() {
    throw new Error('Method not implemented.');
  }

  getSeverity(status: any): "success" | "secondary" | "info" | "warning" | "danger" | "contrast" | undefined {
    switch (status) {
      case 'ADMINISTRATOR':
        return 'success';
      case 'ENCODER':
        return 'secondary';
      case 'CASHIER':
        return 'info';
      default:
        return undefined;
    }
  }
}
