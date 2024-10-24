import { CommonModule } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import {
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
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
import { HttpService } from '../../../../../../shared/services/http.service';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-archives',
  standalone: true,
  imports: [
    FileUploadModule,
    CommonModule,
    ToastModule,
    FieldsetModule,
    ButtonModule,
    DividerModule,
    TooltipModule,
  ],
  templateUrl: './archives.component.html',
  styleUrl: './archives.component.scss',
  providers: [MessageService],
})
export class ArchivesComponent implements OnChanges {
  @Input({ required: false }) customerId!: string | null;
  @Input({ required: false }) isEditMode: boolean = false;
  @Input({ required: false }) customerData!: any;

  uploadedFiles: any[] = [];
  files: any[] = [];

  private uploadService = inject(UploadService);
  private messageService = inject(MessageService);
  private readonly confirmService = inject(ConfirmationService);
  protected readonly http = inject(HttpService);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.customerData) {
      this.displayUpdatedFiles(this.customerData);
    }
  }

  displayUpdatedFiles(customerData: any) {
    this.uploadedFiles = [];

    customerData?.cx_file_archive.forEach((file: any) => {
      this.uploadedFiles.push({
        ...file,
        name: file.file_name,
        file_path: `${this.http.rootURL}/${file.file_path}`,
      });
    });
  }

  onFileUploadProgress(event: FileProgressEvent, fileUploadForm: FileUpload) {
    fileUploadForm.progress = event.progress;
  }

  uploadHandler(event: FileUploadHandlerEvent, fileUploadForm: FileUpload) {
    fileUploadForm.progress = 0;

    let formData = new FormData();
    this.files.forEach((file) => {
      formData.append('files', file);
    });

    formData.append(
      'customer_id',
      this.customerId || this.customerData?.customer_id
    );
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
        this.displayUpdatedFiles(response.body);
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

  deleteFile(params: any) {
    this.confirmService.confirm({
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      header: 'Confirm Deletion',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      message: 'Are you sure you want to delete this file from the database?',
      accept: () => {
        this.uploadService
          .deleteFile({
            id: params.file_id,
            type: 'archive',
          })
          .subscribe({
            next: (response: any) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: response.message,
                life: 3000,
              });
              this.displayUpdatedFiles(response);
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                life: 3000,
                detail: error.error.message,
              });
            },
          });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: 'You have rejected',
        });
      },
    });
  }
}
