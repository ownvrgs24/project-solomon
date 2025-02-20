import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLinkActive, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserService } from '../shared/services/user.service';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-core',
  standalone: true,
  imports: [MenubarModule, CommonModule, ButtonModule, RouterLinkActive, RouterModule, ToolbarModule],
  templateUrl: './core.component.html',
  styleUrl: './core.component.scss',
})

export class CoreComponent {
  protected readonly rootRoute = "/core";
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  public userDetails: {
    fullName: string,
    role: string
  } = {
      fullName: this.userService.getFullName(),
      role: this.userService.getUserRole()
    }

  items: MenuItem[] | undefined = [
    {
      label: 'Dashboard',
      icon: 'pi pi-objects-column',
      routerLink: `${this.rootRoute}/dashboard`,
      routerLinkActiveOptions: { exact: true }
    },
    {
      label: 'Approvals',
      icon: 'pi pi-list-check',
      routerLink: `${this.rootRoute}/approvals`,
      routerLinkActiveOptions: { exact: true }
    },
    {
      label: 'Accounts',
      icon: 'pi pi-user',
      routerLink: `${this.rootRoute}/accounts`,
      routerLinkActiveOptions: { exact: true }
    },
    {
      label: 'Customers Records',
      icon: 'pi pi-database',
      routerLink: `${this.rootRoute}/customers/list`,
      routerLinkActiveOptions: { exact: true }
    },
    {
      label: 'Add Customers',
      icon: 'pi pi-user-plus',
      routerLink: `${this.rootRoute}/customers/create`,
      routerLinkActiveOptions: { exact: true }
    },
    {
      label: 'Reports',
      icon: 'pi pi-chart-line',
      routerLink: `${this.rootRoute}/reports`,
      routerLinkActiveOptions: { exact: true }
    },
    {
      label: 'System Logs',
      icon: 'pi pi-server',
      routerLink: `${this.rootRoute}/system-logs`,
      routerLinkActiveOptions: { exact: true }
    },
  ];

  handleLogout() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to logout?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonStyleClass: 'p-button-text',
      acceptButtonStyleClass: 'p-button-text p-button-danger',
      accept: () => {
        this.authService.userLogout();
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Rejected', detail: 'You have cancelled the logout' });
      }
    });
  }

  ngOnInit(): void {
    console.log(this.userService.getUserRole());

  }
}
