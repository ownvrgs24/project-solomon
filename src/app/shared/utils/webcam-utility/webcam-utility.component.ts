import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  Input,
  inject,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { UploadService } from '../../services/upload.service';
import { ImageService } from '../image.service';

@Component({
  selector: 'app-webcam-utility',
  standalone: true,
  imports: [MessagesModule, ButtonModule, CommonModule],
  templateUrl: './webcam-utility.component.html',
  styleUrl: './webcam-utility.component.scss',
})
export class WebcamUtilityComponent implements AfterViewInit, OnDestroy {
  @Output() imageCaptured: EventEmitter<string> = new EventEmitter();
  @Input({ required: true }) customerId!: string;
  @Input({ required: true }) hasUploadSucceeded!: boolean;
  WIDTH = 340;
  HEIGHT = 280;

  @ViewChild('video', { static: false })
  public video?: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { static: false })
  public canvas?: ElementRef<HTMLCanvasElement>;

  capturedImage: string | null = null;
  error: string = '';
  isCaptured: boolean = false;
  private stream?: MediaStream;

  ngAfterViewInit() {
    console.log('ngAfterViewInit called');
    this.initializeDevices().catch((error) => {
      console.error('Error in initializeDevices:', error);
      this.error =
        'Failed to initialize devices. Please check console for details.';
    });
  }

  ngOnDestroy() {
    this.stopStream();
  }

  private stopStream() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }
  }

  async initializeDevices() {
    console.log('Initializing devices...');
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('getUserMedia is not supported in this browser');
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      console.log('Stream obtained:', this.stream);
      if (!this.video) {
        throw new Error('Video element not found');
      }
      this.video.nativeElement.srcObject = this.stream;
      await this.video.nativeElement.play();
      console.log('Video playing');
      this.error = '';
    } catch (e) {
      console.error('Error in getUserMedia:', e);
      this.error = `Failed to access the camera: ${
        e instanceof Error ? e.message : String(e)
      }`;
      throw e;
    }
  }

  takeSnapshot() {
    console.log('Taking snapshot...');
    if (!this.video || !this.canvas) {
      console.error('Video or canvas element not found');
      this.error = 'Video or canvas element not found';
      return;
    }

    this.renderImageToCanvas(this.video.nativeElement);
    this.capturedImage = this.canvas.nativeElement.toDataURL('image/png');
    console.log('Snapshot taken');
    this.isCaptured = true;
  }

  renderImageToCanvas(image: HTMLVideoElement) {
    console.log('Rendering image to canvas...');
    if (!this.canvas) {
      console.error('Canvas element not found');
      this.error = 'Canvas element not found';
      return;
    }

    const ctx = this.canvas.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Could not get 2D context from canvas');
      this.error = 'Could not get 2D context from canvas';
      return;
    }

    ctx.drawImage(image, 0, 0, this.WIDTH, this.HEIGHT);
    console.log('Image rendered to canvas');
  }

  retakeImage() {
    this.isCaptured = false;
    this.capturedImage = null;
  }

  confirmCapturedImage() {
    if (this.capturedImage) {
      this.imageCaptured.emit(this.capturedImage);
    }
  }
}
