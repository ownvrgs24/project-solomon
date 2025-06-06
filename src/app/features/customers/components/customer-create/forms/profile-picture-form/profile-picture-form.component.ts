import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUpload, FileUploadModule, UploadEvent } from 'primeng/fileupload';
import { TabViewModule } from 'primeng/tabview';
import { TooltipModule } from 'primeng/tooltip';
import { WebcamUtilityComponent } from '../../../../../../shared/utils/webcam-utility/webcam-utility.component';
import { ImageService } from '../../../../../../shared/utils/image.service';
import { UploadService } from '../../../../../../shared/services/upload.service';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { HttpService } from '../../../../../../shared/services/http.service';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-profile-picture-form',
  standalone: true,
  imports: [
    FileUploadModule,
    CommonModule,
    FieldsetModule,
    TabViewModule,
    CardModule,
    TooltipModule,
    WebcamUtilityComponent,
    MessagesModule,
    ImageModule,
  ],
  templateUrl: './profile-picture-form.component.html',
  styleUrl: './profile-picture-form.component.scss',
})
export class ProfilePictureFormComponent implements OnChanges {
  @Input({ required: false }) isEditMode: boolean = false;
  @Input({ required: false }) customerData!: any;
  @Input({ required: false }) customerId!: string | null;

  @ViewChild('fileUpload') fileUpload!: FileUpload;

  messages: Message[] | undefined;
  imageData: string | null = null;
  hasUploadSucceeded: boolean = false;

  private imageService = inject(ImageService);
  private uploadService = inject(UploadService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  protected readonly http = inject(HttpService);

  files: any[] = [];

  onSelectedFiles(event: any) {
    this.files = event.currentFiles;
    if (this.files.length > 0) {
      const file = this.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageData = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.customerData) {
      this.customerData.client_picture =
        this.http.rootURL + '/' + this.customerData.client_picture;
    }
  }

  onUpload() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: async () => {
        this.uploadFileToServer(this.imageData || '');
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
          life: 3000,
        });
      },
    });
  }

  clearFileUpload() {
    this.fileUpload.clear();
    this.files = [];
  }

  async onCaptureImageEmitted(image: string) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: async () => {
        this.uploadFileToServer(image);
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
          life: 3000,
        });
      },
    });
  }

  uploadFileToServer(image: string) {
    const formData = new FormData();
    formData.append('image', this.imageService.base64ToBlob(image));
    formData.append(
      'customer_id',
      this.customerId || this.customerData.customer_id
    );
    this.uploadService.saveProfilePicture(formData).subscribe({
      next: (response: any) => {
        this.imageData = image;
        this.hasUploadSucceeded = true;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.message,
        });

        if (this.isEditMode) {
          this.customerData.client_picture =
            this.http.rootURL + '/' + response.data.client_picture;
        }
      },
      error: (error) => {
        this.hasUploadSucceeded = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }
}
