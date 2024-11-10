import { inject, Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class AuditLogsService {

  readonly http = inject(HttpService);

  getAuditLogs() {
    return this.http.getRequest('logger/audit');
  }
}
