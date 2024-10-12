import { CommonModule } from '@angular/common';
import { Component, inject, Input, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FieldsetModule } from 'primeng/fieldset';
import { FileProgressEvent, FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { UploadService } from '../../../../../../shared/services/upload.service';
import { HttpEventType } from '@angular/common/http';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-promissory-note',
  standalone: true,
  imports: [FileUploadModule, CommonModule, ToastModule, FieldsetModule],
  templateUrl: './promissory-note.component.html',
  styleUrl: './promissory-note.component.scss',
  providers: [MessageService]

})
export class PromissoryNoteComponent {

  @Input({ required: true }) customerId!: string | null;

  uploadedFiles: any[] = [];

  files: any[] = [];

  private uploadService = inject(UploadService);
  private messageService = inject(MessageService);

  constructor() { }

  uploadHandler() {
    let formData = new FormData();
    this.files.forEach(file => {
      formData.append('files', file);
    });

    formData.append('customer_id', this.customerId || '');
    formData.append('type', 'promissory_note');

    // TODO: Add a loading spinner here
    this.uploadService.uploadFiles(formData).subscribe({
      next: (response: any) => {
        if (response.type === HttpEventType.UploadProgress) {
          let total = Math.round((100 * response.loaded) / response.total);
        }
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'File uploaded successfully' });
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to upload file' });
      }
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
      this.files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          console.log('File loaded:', e);
        };
        reader.readAsDataURL(file);
      });
    }
  }

}
