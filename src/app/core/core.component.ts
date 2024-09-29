import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLinkActive } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-core',
  standalone: true,
  imports: [MenubarModule, CommonModule, ButtonModule, RouterLinkActive, ToolbarModule],
  templateUrl: './core.component.html',
  styleUrl: './core.component.scss'
})
export class CoreComponent {


  protected rootRoute = "/core";

  constructor(private router: Router, private confirmationService: ConfirmationService, private messageService: MessageService) { }

  items: MenuItem[] | undefined = [
    {
      label: 'Dashboard',
      icon: 'pi pi-objects-column',
      command: () => {
        this.router.navigate([`${this.rootRoute}/dashboard`]);
      },
      routerLinkActiveOptions: { exact: true }

    },
    {
      label: 'Approvals',
      icon: 'pi pi-list-check',
      command: () => {
        this.router.navigate([`${this.rootRoute}/approvals`]);
      },
      routerLinkActiveOptions: { exact: true }

    },
    {
      label: 'Accounts',
      icon: 'pi pi-user',
      command: () => {
        this.router.navigate([`${this.rootRoute}/accounts`]);
      },
      routerLinkActiveOptions: { exact: true }

    },
    {
      label: 'Customers Records',
      icon: 'pi pi-database',
      command: () => {
        this.router.navigate([`${this.rootRoute}/customers/list`]);
      },
      routerLinkActiveOptions: { exact: true }

    },
    {
      label: 'Add Customers',
      icon: 'pi pi-user-plus',
      command: () => {
        this.router.navigate([`${this.rootRoute}/customers/create`]);
      },
      routerLinkActiveOptions: { exact: true }
    },
    {
      label: 'System Logs',
      icon: 'pi pi-server',
      command: () => {
        this.router.navigate([`${this.rootRoute}/system-logs`]);
      },
      routerLinkActiveOptions: { exact: true }

    },
    {
      label: 'Reports',
      icon: 'pi pi-chart-line',
      command: () => {
        this.router.navigate([`${this.rootRoute}/reports`]);
      },
      routerLinkActiveOptions: { exact: true }
    },
  ];

  invokeLogout() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to logout?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-text',
      acceptButtonStyleClass: 'p-button-text p-button-danger',
      accept: () => {
        this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'You have successfully logged out' });
        this.router.navigate(['/login']);
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Rejected', detail: 'You have cancelled the logout' });
      }
    });
  }
}
