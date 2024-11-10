import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PrincipalLoanComponent } from '../customer-create/forms/principal-loan/principal-loan.component';

@Component({
  selector: 'app-customer-add-loan',
  standalone: true,
  imports: [
    PrincipalLoanComponent
  ],
  templateUrl: './customer-add-loan.component.html',
  styleUrl: './customer-add-loan.component.scss'
})
export class CustomerAddLoanComponent {
  private readonly route = inject(ActivatedRoute);
  customerId = this.route.snapshot.params['id'];
} 
