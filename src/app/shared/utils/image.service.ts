import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor() { }

  base64ToBlob(base64: string) {
    // Extract MIME type from base64 string
    const mimeType = base64.split(";")[0].split(":")[1];

    // Get file extension based on MIME type
    const ext = this.getMimeTypeExtension(mimeType);

    // Convert base64 to byte characters
    const byteCharacters = atob(base64.split(",")[1]);

    // Convert byte characters to byte numbers
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    // Create a Uint8Array from byte numbers
    const byteArray = new Uint8Array(byteNumbers);

    // Create a Blob from Uint8Array
    const blob = new Blob([byteArray]);

    // Create a File from the Blob
    const file = new File([blob], `filename.${ext}`, { type: mimeType });

    return file;
  }

  getMimeTypeExtension(mimeType: string): string {
    // Map MIME types to file extensions
    const mimeToExt: { [key: string]: string } = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/gif": "gif",
      "image/bmp": "bmp",
      "image/webp": "webp",
      "image/tiff": "tiff",
      "image/svg+xml": "svg",
    };

    if (mimeToExt.hasOwnProperty(mimeType)) {
      return mimeToExt[mimeType];
    } else {
      // Default extension if no matching MIME type is found
      return "dat"; // or any other default extension you prefer
    }
  }
}
