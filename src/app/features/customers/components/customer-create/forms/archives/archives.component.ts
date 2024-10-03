import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule, FileUploadEvent } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-archives',
  standalone: true,
  imports: [FileUploadModule, CommonModule, ToastModule, FieldsetModule],
  templateUrl: './archives.component.html',
  styleUrl: './archives.component.scss',
  providers: [MessageService]

})
export class ArchivesComponent {
  uploadedFiles: any[] = [];

  constructor(private messageService: MessageService) { }

  onUpload(event: FileUploadEvent) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }

    this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
  }
}
