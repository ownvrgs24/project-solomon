import { Component, inject, OnInit } from '@angular/core';
import { AuditLogsService } from '../../../../shared/services/audit-logs.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';

interface AuditLog {
  level: string
  message: string
  timestamp: string
  type: string
}

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [
    TableModule,
    CommonModule,
    TagModule
  ],
  templateUrl: './audit-logs.component.html',
  styleUrl: './audit-logs.component.scss'
})
export class AuditLogsComponent implements OnInit {
  private readonly auditLogsService = inject(AuditLogsService);

  auditLogs: AuditLog[] = [];

  ngOnInit(): void {
    this.auditLogsService.getAuditLogs().subscribe({
      next: (res: any) => {
        this.auditLogs = res.data as AuditLog[];
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

}
