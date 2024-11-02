import { Component } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { CustomerApprovalComponent } from "./components/customer-approval/customer-approval.component";
import { LoanApprovalComponent } from "./components/loan-approval/loan-approval.component";

@Component({
  selector: 'app-approvals',
  standalone: true,
  imports: [TabViewModule, CustomerApprovalComponent, LoanApprovalComponent],
  templateUrl: './approvals.component.html',
  styleUrl: './approvals.component.scss'
})
export class ApprovalsComponent { }
