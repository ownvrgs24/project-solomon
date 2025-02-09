import { DatePipe } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { ReportTemplateService } from '../../../../shared/services/reports/report-template.service';
import { UserService } from '../../../../shared/services/user.service';
import { UtilsService } from '../../../../shared/services/utils.service';
import { CashChange, CashCollection, CashOnHand, CashRelease, Expenses } from '../../daily-reports/services/printing-export.service';

@Injectable({
  providedIn: 'root'
})
export class PrintingExportService {

  private readonly userService = inject(UserService);
  private readonly templateReportGeneratorService = inject(ReportTemplateService);
  private readonly utilsService = inject(UtilsService);
  private readonly datePipe = inject(DatePipe);

  createMonthlyReport(
    cashOnHandColumns: CashOnHand[],
    expensesColumns: Expenses[],
    cashReleaseColumns: CashRelease[],
    cashCollectionColumns: CashCollection[],
    cashChangeColumns: CashChange[],
    selected_month: Date
  ) {

    // Get the Month and Year of the report from the first cash on hand 
    const reportMonth = this.datePipe.transform(selected_month, 'MMMM');
    const reportYear = this.datePipe.transform(selected_month, 'yyyy');

    // Sum of Cash on Hand
    const totalMonthlyCashOnHand = cashOnHandColumns.reduce((acc, cash) => acc + cash.cash_amount, 0);

    const monthlyCashOnHand = [
      [{ text: 'CASH ON HAND', fontSize: 9, bold: true, margin: [0, 10, 0, 0] }, { text: '' }, { text: '' }],
      ["DATE", "LOCKED", { text: "AMOUNT", alignment: "right" }],
      ...cashOnHandColumns.map(cash => [
        this.datePipe.transform(cash.created_at, 'MMMM dd, yyyy') || '',
        cash.is_locked ? "Yes" : "No",
        { text: this.utilsService.currencyFormatter(cash.cash_amount), alignment: "right" },
      ]),
      [{}, { text: "TOTAL:", colSpan: 1, bold: true, margin: [0, 5, 0, 0] }, { text: this.utilsService.currencyFormatter(totalMonthlyCashOnHand), alignment: "right", bold: true, margin: [0, 5, 0, 0] }],
    ];


    // Sum of monthly expenses
    const totalMonthlyExpenses = expensesColumns.reduce((acc, expense) => acc + expense.expense_amount, 0);

    const monthlyExpenses = [
      [{ text: 'EXPENSES', fontSize: 9, bold: true, margin: [0, 10, 0, 0] }, { text: '' }, { text: '' }],
      ["DATE", "DETAIL", { text: "AMOUNT", alignment: "right" }],
      ...expensesColumns.map(expense => [
        this.datePipe.transform(expense.created_at, 'MMMM dd, yyyy') || '',
        expense.expense_detail || '',
        { text: this.utilsService.currencyFormatter(expense.expense_amount), alignment: "right" },
      ]),
      [{}, { text: "TOTAL:", colSpan: 1, bold: true, margin: [0, 5, 0, 0] }, { text: this.utilsService.currencyFormatter(totalMonthlyExpenses), alignment: "right", bold: true, margin: [0, 5, 0, 0] }],
    ];

    // Sum of Monthly Cash Release
    const totalMonthlyCashRelease = cashReleaseColumns.reduce((acc, cash) => acc + cash.capital, 0);

    const monthlyCashRelease = [
      [{ text: 'CASH RELEASE', fontSize: 9, bold: true, margin: [0, 10, 0, 0] }, { text: '' }, { text: '' }],
      ["DATE", "CUSTOMER NAME", { text: "AMOUNT", alignment: "right" }],
      ...cashReleaseColumns.map(cash => {
        const nameParts = [
          cash.cxl_principal_loan.cx_detail.first_name,
          cash.cxl_principal_loan.cx_detail.middle_name,
          cash.cxl_principal_loan.cx_detail.last_name,
          cash.cxl_principal_loan.cx_detail.extension_name
        ].filter(part => part && part.trim() !== '');
        const customerName = nameParts.join(' ');
        return [
          this.datePipe.transform(cash.created_at, 'MMMM dd, yyyy') || '',
          customerName,
          { text: this.utilsService.currencyFormatter(cash.capital), alignment: "right" },
        ];
      }),
      [{}, { text: "TOTAL:", colSpan: 1, bold: true, margin: [0, 5, 0, 0] }, { text: this.utilsService.currencyFormatter(totalMonthlyCashRelease), alignment: "right", bold: true, margin: [0, 5, 0, 0] }],
    ];

    // Sum of Monthly Cash Collection
    const totalMonthlyCashCollection = cashCollectionColumns.reduce((acc, cash) => acc + cash.collection, 0);

    const monthlyCashCollection = [
      [{ text: 'CASH COLLECTION', fontSize: 9, bold: true, margin: [0, 10, 0, 0] }, { text: '' }, { text: '' }],
      ["DATE", "CUSTOMER NAME", { text: "AMOUNT", alignment: "right" }],
      ...cashCollectionColumns.map(cash => {
        const nameParts = [
          cash.cxl_principal_loan.cx_detail.first_name,
          cash.cxl_principal_loan.cx_detail.middle_name,
          cash.cxl_principal_loan.cx_detail.last_name,
          cash.cxl_principal_loan.cx_detail.extension_name
        ].filter(part => part && part.trim() !== '');
        const customerName = nameParts.join(' ');
        return [
          this.datePipe.transform(cash.created_at, 'MMMM dd, yyyy') || '',
          customerName,
          { text: this.utilsService.currencyFormatter(cash.collection), alignment: "right" },
        ];
      }),
      [{}, { text: "TOTAL:", colSpan: 1, bold: true, margin: [0, 5, 0, 0] }, { text: this.utilsService.currencyFormatter(totalMonthlyCashCollection), alignment: "right", bold: true, margin: [0, 5, 0, 0] }],
    ];

    // Sum of Monthly Cash Changes
    const totalMonthlyCashChanges = cashChangeColumns.reduce((acc, cash) => acc + cash.change, 0);

    const monthlyCashChange = [
      [{ text: 'CASH COLLECTION', fontSize: 9, bold: true, margin: [0, 10, 0, 0] }, { text: '' }, { text: '' }],
      ["DATE", "CUSTOMER NAME", { text: "AMOUNT", alignment: "right" }],
      ...cashChangeColumns.map(cash => {
        const nameParts = [
          cash.cxl_principal_loan.cx_detail.first_name,
          cash.cxl_principal_loan.cx_detail.middle_name,
          cash.cxl_principal_loan.cx_detail.last_name,
          cash.cxl_principal_loan.cx_detail.extension_name
        ].filter(part => part && part.trim() !== '');
        const customerName = nameParts.join(' ');
        return [
          this.datePipe.transform(cash.created_at, 'MMMM dd, yyyy') || '',
          customerName,
          { text: this.utilsService.currencyFormatter(cash.change), alignment: "right" },
        ];
      }),
      [{}, { text: "TOTAL:", colSpan: 1, bold: true, margin: [0, 5, 0, 0] }, { text: this.utilsService.currencyFormatter(totalMonthlyCashChanges), alignment: "right", bold: true, margin: [0, 5, 0, 0] }],
    ];

    // Sum the cash in using Collection, Cash on Hand
    const totalCashIn = totalMonthlyCashOnHand + totalMonthlyCashCollection;

    // Sum the cash out using Expenses, Cash Release, Cash Changes
    const totalCashOut = totalMonthlyExpenses + totalMonthlyCashRelease + totalMonthlyCashChanges;

    // Compute the total cash
    const cashOnHand = totalCashIn - totalCashOut;

    const summaryTable = [
      [{ text: 'SUMMARY', fontSize: 9, bold: true, margin: [0, 5, 0, 0] }, { text: '' }, { text: '' }],
      ["DESCRIPTION", "", { text: "AMOUNT", alignment: "right" }],
      [{ text: "TOTAL CASH IN", bold: true }, "", { text: this.utilsService.currencyFormatter(totalCashIn), alignment: "right", bold: true }],
      [{ text: "TOTAL CASH OUT", bold: true }, "", { text: this.utilsService.currencyFormatter(totalCashOut), alignment: "right", bold: true }],
      [{ text: "TOTAL CASH ON HAND", bold: true }, "", { text: this.utilsService.currencyFormatter(cashOnHand), alignment: "right", bold: true }],
    ];

    this.templateReportGeneratorService.open({

      content: [
        { text: "DOLBEN LENDING INVESTOR CORPORATION", fontSize: 14, color: "blue", style: "header", alignment: "center", margin: [0, 10, 0, 0] },
        { text: "16 KAUFFMAN ST., GORDON HEIGHTS, OLONGAPO CITY, ZAMBALES", style: "subtitle", alignment: "center", },
        { text: "MONTHLY REPORT", color: "red", bold: true, alignment: "center", fontSize: 16, margin: [0, 0, 0, 0] },
        // Add the Month and Year of the report
        { text: `As of ${reportMonth} ${reportYear}`, alignment: "center", fontSize: 8, margin: [0, 0, 0, 5], italics: true },

        // Cash on Hand
        {
          table: {
            widths: ["*", "*", "*"],
            headerRows: 2,
            body: monthlyCashOnHand,
          },
          layout: 'lightHorizontalLines',
          style: "defaultStyle",
        },

        // Expenses
        {
          table: {
            widths: ["*", "*", "*"],
            headerRows: 2,
            body: monthlyExpenses,
          },
          layout: 'lightHorizontalLines',
          style: "defaultStyle",
        },

        // Cash Release
        {
          table: {
            widths: ["*", "*", "*"],
            headerRows: 2,
            body: monthlyCashRelease,
          },
          layout: 'lightHorizontalLines',
          style: "defaultStyle",
        },

        // Cash Collection
        {
          table: {
            widths: ["*", "*", "*"],
            headerRows: 2,
            body: monthlyCashCollection,
          },
          layout: 'lightHorizontalLines',
          style: "defaultStyle",
        },

        // Cash Changes
        {
          table: {
            widths: ["*", "*", "*"],
            headerRows: 2,
            body: monthlyCashChange,
          },
          layout: 'lightHorizontalLines',
          style: "defaultStyle",
        },

        // Summary
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



      footer: [
        { text: `DATE/TIME GENERATED: ${new Date().toLocaleString()}`, alignment: "right", marginRight: 15, fontSize: 6 },
        { text: `GENERATED BY: ${this.userService.getFullName()}`, alignment: "right", fontSize: 6, marginRight: 15, italics: true },
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
    })
  }
}
