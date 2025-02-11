import { DatePipe } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { ReportTemplateService } from '../../../../shared/services/reports/report-template.service';
import { UserService } from '../../../../shared/services/user.service';
import { UtilsService } from '../../../../shared/services/utils.service';
import { Column, Table } from 'pdfmake/interfaces';

export interface CashRelease {
  capital: number;
  transaction_id: string;
  created_at: Date;
  cxl_principal_loan: {
    cx_detail: {
      first_name: string;
      middle_name?: string;
      last_name: string;
      extension_name?: string;
    }
  }
}

export interface CashChange {
  change: number;
  transaction_id: string;
  created_at: Date;
  cxl_principal_loan: {
    cx_detail: {
      first_name: string;
      middle_name?: string;
      last_name: string;
      extension_name?: string;
    }
  }
}

export interface CashCollection {
  collection: number;
  transaction_id: string;
  created_at: Date;
  cxl_principal_loan: {
    cx_detail: {
      first_name: string;
      middle_name?: string;
      last_name: string;
      extension_name?: string;
    }
  }
}

export interface Expenses {
  expense_id: string
  expense_detail: string
  expense_amount: number
  created_at: string
  updated_at: string
  category: string
}

export interface CashOnHand {
  recno: number
  cash_id: string
  cash_amount: number
  cash_detail: string
  created_at: string
  updated_at: string
  is_deleted: boolean
  is_locked: boolean
}[]

@Injectable({
  providedIn: 'root'
})
export class PrintingExportService {


  private readonly userService = inject(UserService);
  private readonly templateReportGeneratorService = inject(ReportTemplateService);
  private readonly utilsService = inject(UtilsService);
  private readonly datePipe = inject(DatePipe);


  private cashReleaseColumns: any[] = [];
  private expensesColumns: Expenses[] = [];
  private cashChangeColumns: any[] = [];
  private cashCollectionColumns: any[] = [];
  private cashOnHandColumns!: CashOnHand;

  compileCashOnHandData(data: CashOnHand) {
    this.cashOnHandColumns = data;
  }

  compileCashCollectionData(data: CashCollection[]) {
    this.cashCollectionColumns = data.map((cashRelease) => {
      const { first_name, middle_name, last_name, extension_name } = cashRelease.cxl_principal_loan.cx_detail;
      const nameParts = [first_name, middle_name, last_name, extension_name].filter(part => part && part.trim() !== '');
      return {
        name: nameParts.join(' '),
        collection: cashRelease.collection,
        transaction_id: cashRelease.transaction_id,
        created_at: cashRelease.created_at
      }
    });
  }


  compileCashReleaseData(data: CashRelease[]) {
    this.cashReleaseColumns = data.map((cashRelease) => {
      const { first_name, middle_name, last_name, extension_name } = cashRelease.cxl_principal_loan.cx_detail;
      const nameParts = [first_name, middle_name, last_name, extension_name].filter(part => part && part.trim() !== '');
      return {
        name: nameParts.join(' '),
        capital: cashRelease.capital,
        transaction_id: cashRelease.transaction_id,
        created_at: cashRelease.created_at
      }
    });
  }

  compileCashChangeData(data: CashChange[]) {
    this.cashChangeColumns = data.map((cashRelease) => {
      const { first_name, middle_name, last_name, extension_name } = cashRelease.cxl_principal_loan.cx_detail;
      const nameParts = [first_name, middle_name, last_name, extension_name].filter(part => part && part.trim() !== '');
      return {
        name: nameParts.join(' '),
        change: cashRelease.change,
        transaction_id: cashRelease.transaction_id,
        created_at: cashRelease.created_at
      }
    });
  }

  compileExpensesData(data: Expenses[]) {
    this.expensesColumns = data;
  }

  createComprehensiveDailyReport() {

    const totalExpenses = this.expensesColumns.reduce((acc, curr) => acc + curr.expense_amount, 0);
    const totalCashRelease = this.cashReleaseColumns.reduce((acc, curr) => acc + curr.capital, 0);
    const totalCashChange = this.cashChangeColumns.reduce((acc, curr) => acc + curr.change, 0);

    const totalCashOut = totalExpenses + totalCashRelease + totalCashChange;

    const totalCollection = this.cashCollectionColumns.reduce((acc, curr) => acc + curr.collection, 0);

    const totalCashIn = totalCollection + (this.cashOnHandColumns?.cash_amount ?? 0);

    const collectionColumns = {
      table: {
        widths: ["*", "*", "*"],
        headerRows: 2,
        body: [
          [{ text: 'COLLECTION', fontSize: 9, bold: true, margin: [0, 0, 0, 0], colSpan: 3 }, null, null],
          [{ text: 'NAME', bold: true }, { text: 'AMOUNT', bold: true }, { text: 'DATE', bold: true }],
          ...this.cashCollectionColumns.map((cashRelease: {
            name: string
            collection: number
            created_at: string
          }) => [
              cashRelease.name ?? "-",
              this.utilsService.currencyFormatter(cashRelease.collection) ?? "-",
              this.datePipe.transform(cashRelease.created_at, 'MMM dd, yyyy hh:mm a') ?? "-"
            ]),
          [{ text: 'TOTAL', bold: true, }, { text: this.utilsService.currencyFormatter(totalCollection), bold: true }, null]
        ],
      },
    }

    const changeColumns = {
      table: {
        widths: ["*", "*", "*"],
        headerRows: 2,
        body: [
          [{ text: 'CHANGE', fontSize: 9, bold: true, margin: [0, 0, 0, 0], colSpan: 3 }, null, null],
          [{ text: 'NAME', bold: true }, { text: 'AMOUNT', bold: true }, { text: 'DATE', bold: true }],
          ...this.cashChangeColumns.map((cashRelease: {
            name: string
            change: number
            created_at: string
          }) => [
              cashRelease.name ?? "-",
              this.utilsService.currencyFormatter(cashRelease.change) ?? "-",
              this.datePipe.transform(cashRelease.created_at, 'MMM dd, yyyy hh:mm a') ?? "-"
            ]),
          [{ text: 'TOTAL', bold: true, }, { text: this.utilsService.currencyFormatter(totalCashChange), bold: true }, null]
        ],
      },
    };

    const expensesColumns = {
      table: {
        widths: ["*", "*", "*"],
        headerRows: 2,
        body: [
          [{ text: 'EXPENSES', fontSize: 9, bold: true, margin: [0, 0, 0, 0], colSpan: 3 }, null, null],
          [{ text: 'DETAIL', bold: true }, { text: 'AMOUNT', bold: true }, { text: 'DATE', bold: true }],
          ...this.expensesColumns.map((expense: {
            expense_detail: string
            expense_amount: number
            created_at: string
          }) => [
              expense.expense_detail ?? "-",
              this.utilsService.currencyFormatter(expense.expense_amount) ?? "-",
              this.datePipe.transform(expense.created_at, 'MMM dd, yyyy hh:mm a') ?? "-"
            ]),
          [{ text: 'TOTAL', bold: true, }, { text: this.utilsService.currencyFormatter(totalExpenses), bold: true }, null]
        ],
      },
    };

    const cashReleaseColumns = {
      table: {
        widths: ["*", "*", "*"],
        headerRows: 2,
        body: [
          [{ text: 'RELEASED CASH', fontSize: 9, bold: true, margin: [0, 0, 0, 0], colSpan: 3 }, null, null],
          [{ text: 'NAME', bold: true }, { text: 'AMOUNT', bold: true }, { text: 'DATE', bold: true }],
          ...this.cashReleaseColumns.map((cashRelease: {
            name: string
            capital: number
            transaction_id: string
            created_at: string
          }) => [
              cashRelease.name ?? "-",
              this.utilsService.currencyFormatter(cashRelease.capital) ?? "-",
              this.datePipe.transform(cashRelease.created_at, 'MMM dd, yyyy hh:mm a') ?? "-"
            ]),
          [{ text: 'TOTAL', bold: true, }, { text: this.utilsService.currencyFormatter(totalCashRelease), bold: true }, null]
        ],
      },
    };

    this.templateReportGeneratorService.open({
      content: [
        { text: "DOLBEN LENDING INVESTOR CORPORATION", fontSize: 14, color: "blue", style: "header", alignment: "center", margin: [0, 10, 0, 0] },
        { text: "16 KAUFFMAN ST., GORDON HEIGHTS, OLONGAPO CITY, ZAMBALES", style: "subtitle", alignment: "center", },
        { text: "DAILY REPORT", color: "red", bold: true, alignment: "center", fontSize: 16, margin: [0, 0, 0, 10] },
        {
          columnGap: 20,
          columns: [
            [
              {
                table: cashReleaseColumns.table,
                layout: 'lightHorizontalLines',
                style: "defaultStyle",
              } as unknown as Column,
              {
                table: expensesColumns.table,
                layout: 'lightHorizontalLines',
                style: "defaultStyle",
              } as unknown as Column,
              {
                table: changeColumns.table,
                layout: 'lightHorizontalLines',
                style: "defaultStyle",
              } as unknown as Column,

            ],
            [
              {
                table: collectionColumns.table,
                layout: 'lightHorizontalLines',
                style: "defaultStyle",
              } as unknown as Column,

              {
                table: {
                  widths: ["*", "*", "*"],
                  body: [
                    [{ text: 'CASH ON HAND', fontSize: 9, bold: true, margin: [0, 0, 0, 0], colSpan: 3 }, { text: '' }, { text: '' }],
                    [{ text: 'NAME', bold: true }, { text: 'AMOUNT', bold: true }, { text: 'DATE', bold: true }],
                    [
                      { text: `-`, bold: true },
                      { text: this.utilsService.currencyFormatter(this.cashOnHandColumns?.cash_amount ?? 0), bold: true },
                      { text: this.datePipe.transform(this.cashOnHandColumns?.created_at, 'MMM dd, yyyy hh:mm a') || null, bold: true },
                    ],
                  ]
                },
                layout: 'lightHorizontalLines',
                style: "defaultStyle",
              },
            ]
          ]
        },
        {
          table: {
            widths: ["*"],
            body: [
              [{
                table: {
                  widths: ["*", "*"],
                  body: [
                    [{ text: 'TOTAL CASH OUT', bold: true }, { text: this.utilsService.currencyFormatter(totalCashOut), bold: true }],
                    [{ text: 'TOTAL CASH IN', bold: true }, { text: this.utilsService.currencyFormatter(totalCashIn), bold: true }],
                    [{ text: 'TOTAL CASH', bold: true }, { text: this.utilsService.currencyFormatter(totalCollection - totalCashOut), bold: true }],
                  ]
                },
                layout: 'lightHorizontalLines',
                style: "defaultStyle",
              }],
            ],
          },
          marginTop: 10,
        }
      ],
      header: [
        { text: `DATE/TIME GENERATED: ${new Date().toLocaleString()}`, alignment: "right", marginRight: 15, fontSize: 6, marginTop: 10 },
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
