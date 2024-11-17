import { inject, Injectable } from "@angular/core";
import { DatePipe } from "@angular/common";
import { UserService } from "../user.service";
import { TDocumentDefinitions } from 'pdfmake/interfaces';


export interface Reports {
  title: string;
  subtitle: string;
  table: any;
  employee_name: string;
  email_address: string;
  account_id: string;
  total?: number;
}

type PDFMake = typeof import('pdfmake/build/pdfmake');

@Injectable({
  providedIn: "root",
})

export class ReportTemplateService {

  private pdfMake!: PDFMake;
  private fonts!: { [file: string]: string };

  async loadPDFMaker() {
    if (!this.pdfMake) {
      this.pdfMake = await import('pdfmake/build/pdfmake');
      this.fonts = (await import('pdfmake/build/vfs_fonts')).pdfMake.vfs;
    }
  }

  async open(def: TDocumentDefinitions) {
    if (!this.pdfMake) {
      try {
        await this.loadPDFMaker()
      } catch (error) {
        console.error("Failed to load pdf maker lib");
      }
    }
    this.pdfMake.createPdf(def, undefined, undefined, this.fonts).open();
  }

}