import { DatePipe } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { ReportTemplateService } from '../../../../shared/services/reports/report-template.service';
import { UserService } from '../../../../shared/services/user.service';
import { UtilsService } from '../../../../shared/services/utils.service';

@Injectable({
  providedIn: 'root'
})
export class PrintingExportService {

  private readonly userService = inject(UserService);
  private readonly templateReportGeneratorService = inject(ReportTemplateService);
  private readonly utilsService = inject(UtilsService);
  private readonly datePipe = inject(DatePipe);

  createAnnualReport(
    annualCashOnHandColumns: { month: string, total_balance: number }[],
    annualExpensesColumns: { month: string, total_amount: number }[],
    annualCashReleaseColumns: { month: string, total_capital: number }[],
    annualCashCollectionColumns: { month: string, total_collection: number }[],
    annualCashChangesColumns: { month: string, total_change: number }[],
    selectedYear: Date,
  ) {
    const reportYear = this.datePipe.transform(selectedYear, 'yyyy');

    const annualCashOnHandTable = [
      [{ text: 'CASH ON HAND', fontSize: 9, bold: true, margin: [0, 10, 0, 0] }, { text: '' }],
      ["DATE", { text: "AMOUNT", alignment: "right" }],
      ...annualCashOnHandColumns.map((cashOnHand: { month: string, total_balance: number }) => [
        cashOnHand.month.toUpperCase() || '',
        { text: this.utilsService.currencyFormatter(cashOnHand.total_balance), alignment: "right" },
      ]),
      [{ text: "TOTAL:", margin: [0, 5, 0, 0], bold: true, alignment: "right" }, { text: this.utilsService.currencyFormatter(annualCashOnHandColumns.reduce((acc, curr) => acc + curr.total_balance, 0)), alignment: "right", margin: [0, 5, 0, 0], bold: true }],
    ];

    const annualExpensesTable = [
      [{ text: 'EXPENSES', fontSize: 9, bold: true, margin: [0, 10, 0, 0] }, { text: '' }],
      ["DATE", { text: "AMOUNT", alignment: "right" }],
      ...annualExpensesColumns.map((element: { month: string, total_amount: number }) => [
        element.month.toUpperCase() || '',
        { text: this.utilsService.currencyFormatter(element.total_amount), alignment: "right" },
      ]),
      [{ text: "TOTAL:", margin: [0, 5, 0, 0], bold: true, alignment: "right" }, { text: this.utilsService.currencyFormatter(annualExpensesColumns.reduce((acc, curr) => acc + curr.total_amount, 0)), alignment: "right", margin: [0, 5, 0, 0], bold: true }],
    ];

    const annualCashReleaseTable = [
      [{ text: 'CASH RELEASE', fontSize: 9, bold: true, margin: [0, 10, 0, 0] }, { text: '' }],
      ["DATE", { text: "AMOUNT", alignment: "right" }],
      ...annualCashReleaseColumns.map((element: { month: string, total_capital: number }) => [
        element.month.toUpperCase() || '',
        { text: this.utilsService.currencyFormatter(element.total_capital), alignment: "right" },
      ]),
      [{ text: "TOTAL:", margin: [0, 5, 0, 0], bold: true, alignment: "right" }, { text: this.utilsService.currencyFormatter(annualCashReleaseColumns.reduce((acc, curr) => acc + curr.total_capital, 0)), alignment: "right", margin: [0, 5, 0, 0], bold: true }],
    ];

    const annualCollectionTable = [
      [{ text: 'CASH COLLECTION', fontSize: 9, bold: true, margin: [0, 10, 0, 0] }, { text: '' }],
      ["DATE", { text: "AMOUNT", alignment: "right" }],
      ...annualCashCollectionColumns.map((element: { month: string, total_collection: number }) => [
        element.month.toUpperCase() || '',
        { text: this.utilsService.currencyFormatter(element.total_collection), alignment: "right" },
      ]),
      [{ text: "TOTAL:", margin: [0, 5, 0, 0], bold: true, alignment: "right" }, { text: this.utilsService.currencyFormatter(annualCashCollectionColumns.reduce((acc, curr) => acc + curr.total_collection, 0)), alignment: "right", margin: [0, 5, 0, 0], bold: true }],
    ];

    const annualCashChangesTable = [
      [{ text: 'CASH CHANGES', fontSize: 9, bold: true, margin: [0, 10, 0, 0] }, { text: '' }],
      ["DATE", { text: "AMOUNT", alignment: "right" }],
      ...annualCashChangesColumns.map((element: { month: string, total_change: number }) => [
        element.month.toUpperCase() || '',
        { text: this.utilsService.currencyFormatter(element.total_change), alignment: "right" },
      ]),
      [{ text: "TOTAL:", margin: [0, 5, 0, 0], bold: true, alignment: "right" }, { text: this.utilsService.currencyFormatter(annualCashChangesColumns.reduce((acc, curr) => acc + curr.total_change, 0)), alignment: "right", margin: [0, 5, 0, 0], bold: true }],
    ];

    // Sum the cash in using Collection, Cash on Hand
    const totalCashIn = annualCashCollectionColumns.reduce((acc, curr) => acc + curr.total_collection, 0) + annualCashOnHandColumns.reduce((acc, curr) => acc + curr.total_balance, 0);

    // Sum the cash out using Expenses, Cash Release, Cash Changes
    const totalCashOut = annualExpensesColumns.reduce((acc, curr) => acc + curr.total_amount, 0) + annualCashReleaseColumns.reduce((acc, curr) => acc + curr.total_capital, 0) + annualCashChangesColumns.reduce((acc, curr) => acc + curr.total_change, 0);

    // Compute the total cash
    const cashOnHand = totalCashIn - totalCashOut;

    const summaryTable = [
      [{ text: 'SUMMARY', fontSize: 9, bold: true, margin: [0, 5, 0, 0] }, { text: '' }, { text: '' }],
      ["DESCRIPTION", "", { text: "AMOUNT", alignment: "right" }],
      [{ text: "TOTAL CASH IN", bold: true }, "", { text: this.utilsService.currencyFormatter(totalCashIn), alignment: "right", bold: true }],
      [{ text: "TOTAL CASH OUT", bold: true }, "", { text: this.utilsService.currencyFormatter(totalCashOut), alignment: "right", bold: true }],
      [{ text: "TOTAL CASH ON HAND", bold: true }, "", { text: this.utilsService.currencyFormatter(cashOnHand), alignment: "right", bold: true }],
    ];

    // Open the PDF
    this.templateReportGeneratorService.open({
      content: [
        { text: "DOLBEN LENDING INVESTOR CORPORATION", fontSize: 14, color: "blue", style: "header", alignment: "center", margin: [0, 10, 0, 0] },
        { text: "16 KAUFFMAN ST., GORDON HEIGHTS, OLONGAPO CITY, ZAMBALES", style: "subtitle", alignment: "center", },
        { text: "ANNUAL REPORT", color: "red", bold: true, alignment: "center", fontSize: 16, margin: [0, 0, 0, 0] },
        // Add the Month and Year of the report
        { text: `for the year ${reportYear}`, alignment: "center", fontSize: 8, margin: [0, 0, 0, 5], italics: true },

        // Cash on Hand
        {
          table: {
            widths: ["*", "*"],
            headerRows: 2,
            body: annualCashOnHandTable,
          },
          layout: 'lightHorizontalLines',
          style: "defaultStyle",
        },

        // Expenses Table
        {
          table: {
            widths: ["*", "*"],
            headerRows: 2,
            body: annualExpensesTable,
          },
          layout: 'lightHorizontalLines',
          style: "defaultStyle",
        },

        // Cash Release Table
        {
          table: {
            widths: ["*", "*"],
            headerRows: 2,
            body: annualCashReleaseTable,
          },
          layout: 'lightHorizontalLines',
          style: "defaultStyle",
        },

        // Cash Collection Table
        {
          table: {
            widths: ["*", "*"],
            headerRows: 2,
            body: annualCollectionTable,
          },
          layout: 'lightHorizontalLines',
          style: "defaultStyle",
        },

        // Cash Changes Table
        {
          table: {
            widths: ["*", "*"],
            headerRows: 2,
            body: annualCashChangesTable,
          },
          layout: 'lightHorizontalLines',
          style: "defaultStyle",
        },

        // Summary Table
        {
          table: {
            widths: ["*", "*", "*"],
            headerRows: 2,
            body: summaryTable,
          },
          layout: 'lightHorizontalLines',
          style: "defaultStyle",
        },

      ],
      styles: {
        header: {
          fontSize: 12,
          bold: true,
          margin: [0, 5, 0, 5],
        },
        subtitle: {
          fontSize: 10,
          bold: false,
          margin: [0, 0, 0, 10],
        },
        defaultStyle: { margin: [0, 5, 0, 5], fontSize: 9 },
      },
      pageSize: "A4",
      pageOrientation: "portrait",
      watermark: { text: "DOLBEN LENDING PROPERTY", color: "red", opacity: 0.1, bold: true },
      header: [
        { text: `DATE/TIME GENERATED: ${new Date().toLocaleString()}`, alignment: "right", marginRight: 15, fontSize: 6, marginTop: 10 },
        { text: `GENERATED BY: ${this.userService.getFullName()}`, alignment: "right", fontSize: 6, marginRight: 15, italics: true },
      ],
    });
  }
}
