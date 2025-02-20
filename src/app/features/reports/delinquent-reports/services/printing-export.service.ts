import { DatePipe } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { ReportTemplateService } from '../../../../shared/services/reports/report-template.service';
import { UserService } from '../../../../shared/services/user.service';
import { UtilsService } from '../../../../shared/services/utils.service';

export interface AccountDelinquencyData {
  customer: Customer
  principal_loan: PrincipalLoan
  delinquency_data: DelinquencyData
  co_makers: CoMaker[]
}

export interface Customer {
  fullname: string
  customer_id: string
  address: Address[]
}

export interface PrincipalLoan {
  loan_id: string
  loan_mode_of_payment: string
  loan_interest_rate: number
  principal_loan_amount: number
}

export interface DelinquencyData {
  interest: number
  selectedIndex: number
  loan_interest_rate: number
  days: number
  months: number
  isDelinquent: boolean
  loan_mode_of_payment: string
  find_upper_payment_bracket_index: number
  paid_in_advance: boolean
  balance: number
  date_marked_as_delinquent: string
}

export interface CoMaker {
  fullname: string
  address: Address[]
}

export interface Address {
  complete_address: string
  landmark: any
}


@Injectable({
  providedIn: 'root'
})
export class PrintingExportService {

  private readonly userService = inject(UserService);
  private readonly templateReportGeneratorService = inject(ReportTemplateService);
  private readonly utilsService = inject(UtilsService);
  private readonly datePipe = inject(DatePipe);

  generateDelinquentReport(data: AccountDelinquencyData[]) {

    // Get the Month and Year of the report from the first cash on hand 
    const reportMonth = this.datePipe.transform(new Date(), 'MMMM');
    const reportYear = this.datePipe.transform(new Date(), 'yyyy');

    const delinquentTable = [
      [{ text: "Customer Name", fontSize: 9, bold: true }, { text: "Address", fontSize: 9, bold: true }, { text: "Co Maker / Co Maker Address", fontSize: 9, bold: true }, { text: "Principal Loan", fontSize: 9, bold: true }, { text: "Mode of Payment", fontSize: 9, bold: true }, { text: "Interest Rate", fontSize: 9, bold: true }, { text: "Obligations", fontSize: 9, bold: true }],
      ...data.map((element: AccountDelinquencyData) => [
        { text: element.customer.fullname, bold: true, fontSize: 10 },
        element.customer.address ? {
          ul: element.customer.address.map((address: Address) => ({ text: address.complete_address, fontSize: 8 })).filter(addr => addr),
        } : '-',  // If there is no address, display a dash
        element.co_makers ? {
          ul: element.co_makers.map((coMaker: CoMaker) => {
            const addresses = coMaker.address.map((address: Address) => ({ text: address.complete_address, fontSize: 8 })).filter(addr => addr);
            return addresses.length > 0 ? { text: `${coMaker.fullname} / ${addresses.map(addr => addr.text).join(', ')}`, fontSize: 8 } : { text: coMaker.fullname, fontSize: 8 };
          }),
        } : '-', // If there is no co-maker, display a dash
        this.utilsService.currencyFormatter(element.principal_loan.principal_loan_amount || 0),
        element.principal_loan.loan_mode_of_payment.replaceAll('_', '') || '-',
        `${element.principal_loan.loan_interest_rate}%`,
        {
          table: {
            widths: ["*", "auto", "*"],
            body: [
              [{ text: 'Delinquent Since', fontSize: 8, bold: true }, ':', { text: this.datePipe.transform(element.delinquency_data.date_marked_as_delinquent, 'MMMM dd, yyyy'), fontSize: 8, }],
              [{ text: 'Balance', fontSize: 8, bold: true }, ':', { text: this.utilsService.currencyFormatter(element.delinquency_data.balance), fontSize: 8, }],
              [{ text: 'Interest', fontSize: 8, bold: true }, ':', { text: this.utilsService.currencyFormatter(element.delinquency_data.interest), fontSize: 8, }],
              [{ text: 'Total', fontSize: 8, bold: true }, ':', { text: this.utilsService.currencyFormatter((element.delinquency_data.balance || 0) + (element.delinquency_data.interest || 0)), fontSize: 8, color: 'red', bold: true }],
            ],
          },
          layout: 'lightHorizontalLines',
          style: "defaultStyle",
        },
      ]), // Add the data here

      // Overall Total sum all the balance and interest of the delinquent accounts using reduce
      [{ marginTop: 5, text: "Total Delinquent Accounts", colSpan: 6, alignment: "right", fontSize: 12, bold: true }, {}, {}, {}, {}, {}, {
        alignment: "right",
        marginTop: 5,
        text: this.utilsService.currencyFormatter(data.reduce((acc, curr) => acc + (curr.delinquency_data.balance || 0) + (curr.delinquency_data.interest || 0), 0)),
        fontSize: 12,
        bold: true,
        color: 'red',
      }],
    ];

    this.templateReportGeneratorService.open({
      content: [
        { text: "DOLBEN LENDING INVESTOR CORPORATION", fontSize: 14, color: "blue", style: "header", alignment: "center", margin: [0, 10, 0, 0] },
        { text: "16 KAUFFMAN ST., GORDON HEIGHTS, OLONGAPO CITY, ZAMBALES", style: "subtitle", alignment: "center", },
        { text: "DELINQUENCY REPORT", color: "red", bold: true, alignment: "center", fontSize: 16, margin: [0, 0, 0, 0] },
        { text: `As of ${reportMonth} ${reportYear}`, alignment: "center", fontSize: 8, margin: [0, 0, 0, 5], italics: true },
        {
          table: {
            widths: ["*", "*", "*", "auto", "auto", "auto", "*"],
            headerRows: 1,
            body: delinquentTable,
          },
          layout: 'lightHorizontalLines',
          style: "defaultStyle",
        },
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
      pageSize: "LEGAL",
      pageOrientation: "landscape",
      watermark: { text: "DOLBEN LENDING PROPERTY", color: "red", opacity: 0.1, bold: true },
    })
  }
}
