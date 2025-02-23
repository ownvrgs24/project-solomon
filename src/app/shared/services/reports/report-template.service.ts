import { Injectable } from "@angular/core";
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';


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

  async open(def: TDocumentDefinitions) {

    if (!this.pdfMake) {
      this.pdfMake = pdfMake;
      this.fonts = pdfFonts?.pdfMake?.vfs;
      this.pdfMake.vfs = pdfFonts?.pdfMake?.vfs;
    }

    this.pdfMake.createPdf(def, undefined, undefined, this.fonts).open();
  }

}