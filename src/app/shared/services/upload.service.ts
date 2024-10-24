import { inject, Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { HttpEvent, HttpRequest } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  readonly http = inject(HttpService);

  saveProfilePicture(data: FormData) {
    return this.http.postRequest('upload/pfp', data);
  }

  uploadFiles(data: FormData) {
    return this.http.uploadFile(data);
  }

  deleteFile(data: any) {
    return this.http.postRequest(`upload/files/delete`, data);
  }
}
