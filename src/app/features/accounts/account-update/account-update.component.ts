import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { BasicInformationComponent } from '../account-create/forms/basic-information/basic-information.component';
import { AdditionalInformationComponent } from '../account-create/forms/additional-information/additional-information.component';
import { SecurityInformationComponent } from '../account-create/forms/security-information/security-information.component';
import { InputTextModule } from 'primeng/inputtext';
import { ActivatedRoute } from '@angular/router';
import { AccountCreateComponent } from "../account-create/account-create.component";
import { AccountService } from '../../../shared/services/account.service';

@Component({
  selector: 'app-account-update',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    FieldsetModule,
    InputTextModule,
    AccountCreateComponent
],
  templateUrl: './account-update.component.html',
  styleUrl: './account-update.component.scss'
})
export class AccountUpdateComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly userAccountService = inject(AccountService);

  userAccountData!: any;

  ngOnInit(): void {
    this.fetchUserAccount();
  }

  fetchUserAccount(): void {
    const id = this.activatedRoute.snapshot.params['id'];

    this.userAccountService.fetchUserAccount(id).subscribe({
      next: (res: any) => {
        this.userAccountData = res.data;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
