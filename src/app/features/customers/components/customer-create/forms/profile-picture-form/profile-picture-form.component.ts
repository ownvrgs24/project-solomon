import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { TabViewModule } from 'primeng/tabview';
import { TooltipModule } from 'primeng/tooltip';
import { WebcamUtilityComponent } from "../../../../../../shared/utils/webcam-utility/webcam-utility.component";

@Component({
  selector: 'app-profile-picture-form',
  standalone: true,
  imports: [FileUploadModule, CommonModule, FieldsetModule, TabViewModule, CardModule, TooltipModule, WebcamUtilityComponent],
  templateUrl: './profile-picture-form.component.html',
  styleUrl: './profile-picture-form.component.scss'
})
export class ProfilePictureFormComponent {

  @ViewChild('fileUpload') fileUpload!: FileUpload;

  files: any[] = [];

  onSelectedFiles(event: any) {
    this.files = event.currentFiles;
  }

  onUpload(event: any) {
    // Handle successful upload
  }

  clearFileUpload() {
    this.fileUpload.clear();
    this.files = [];
  }
}
