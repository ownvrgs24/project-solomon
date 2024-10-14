import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StatusTagService {
  constructor() {}

  getSeverity(
    status: string
  ):
    | 'success'
    | 'secondary'
    | 'info'
    | 'warning'
    | 'danger'
    | 'contrast'
    | undefined {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'FOR_REVIEW':
        return 'warning';
      case 'DELINQUENT':
        return 'danger';
      default:
        return undefined;
    }
  }

  getStatusLabel(
    status: string
  ):
    | 'success'
    | 'secondary'
    | 'info'
    | 'warning'
    | 'danger'
    | 'contrast'
    | undefined {
    switch (status) {
      case 'FOR_REVIEW':
        return 'contrast';
      case 'FOR_DELETION':
        return 'secondary';
      case 'DELETED':
        return 'danger';
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'warning';
      default:
        return undefined;
    }
  }
}
