import { CommonModule } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component, inject, Input } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FieldsetModule } from 'primeng/fieldset';
import {
  FileUploadModule,
  FileUploadEvent,
  FileProgressEvent,
  FileUpload,
  FileUploadHandlerEvent,
} from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { UploadService } from '../../../../../../shared/services/upload.service';

@Component({
  selector: 'app-archives',
  standalone: true,
  imports: [FileUploadModule, CommonModule, ToastModule, FieldsetModule],
  templateUrl: './archives.component.html',
  styleUrl: './archives.component.scss',
  providers: [MessageService],
})
export class ArchivesComponent {
  @Input({ required: false }) customerId!: string | null;

  uploadedFiles: any[] = [];
  files: any[] = [];

  private uploadService = inject(UploadService);
  private messageService = inject(MessageService);

  onFileUploadProgress(event: FileProgressEvent, fileUploadForm: FileUpload) {
    fileUploadForm.progress = event.progress;
  }

  uploadHandler(event: FileUploadHandlerEvent, fileUploadForm: FileUpload) {
    fileUploadForm.progress = 0;

    let formData = new FormData();
    this.files.forEach((file) => {
      formData.append('files', file);
    });

    formData.append('customer_id', this.customerId || '');
    formData.append('type', 'archive');

    this.uploadService.uploadFiles(formData).subscribe({
      next: (response: any) => {
        if (response.type === HttpEventType.UploadProgress) {
          const progress = Math.round((100 * response.loaded) / response.total);
          fileUploadForm.onProgress.emit({
            originalEvent: undefined!,
            progress,
          });
          fileUploadForm.uploading = true;
        } else if (response.type === HttpEventType.Response) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: response.body.message,
            life: 5000,
            closable: true,
          });
          fileUploadForm.clear();
          this.uploadedFiles.push(...event.files); // Spread operator to add all uploaded files
          fileUploadForm.uploading = false;
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to upload files',
        });
        fileUploadForm.uploading = false;
      },
    });
  }

  onUpload(event: FileUploadEvent) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
  }

  handleSelectedFile(event: any) {
    this.files = event.currentFiles;
    if (this.files.length > 0) {
      this.files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          console.log('File loaded:', e);
        };
        reader.readAsDataURL(file);
      });
    }
  }
}
