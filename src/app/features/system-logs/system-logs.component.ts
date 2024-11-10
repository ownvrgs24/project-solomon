import { Component } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { AuditLogsComponent } from "./components/audit-logs/audit-logs.component";

@Component({
  selector: 'app-system-logs',
  standalone: true,
  imports: [
    TabViewModule,
    AuditLogsComponent
  ],
  templateUrl: './system-logs.component.html',
  styleUrl: './system-logs.component.scss',
})
export class SystemLogsComponent { }
