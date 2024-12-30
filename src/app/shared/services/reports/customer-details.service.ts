import { inject, Injectable } from "@angular/core";
import { ReportTemplateService } from "./report-template.service";
import { UserService } from "../user.service";
import { UtilsService } from "../utils.service";
import { CustomerDetails, CustomerSourceOfIncomeEmployment } from "../../../interfaces/customer-details";
import { ReturnStatement } from "@angular/compiler";
import { DatePipe } from "@angular/common";

@Injectable({
  providedIn: "root",
})
export class CustomerDetailsService {

  private readonly userService = inject(UserService);
  private readonly templateReportGeneratorService = inject(ReportTemplateService);
  private readonly utilsService = inject(UtilsService);
  private readonly datePipe = inject(DatePipe);

  createCustomerDataSheetReport(data: CustomerDetails) {

    // Get the data of Source of Income Employment then append it on the table

    let sourceOfIncomeEmployment: any = null;
    let sourceOfIncomePension: any = null;
    let sourceOfIncomeBusiness: any = null;
    let sourceOfIncomeSelfEmployed: any = null;
    let sourceOfIncomeOthers: any = null;

    if (data.soi_employment) {
      sourceOfIncomeEmployment = {
        table: {
          widths: ["*", "*"],
          body: [
            [{ text: "Company", bold: true }, data.soi_employment?.company ?? "-"],
            [{ text: "Company Address", bold: true }, data.soi_employment?.company_address ?? "-"],
            [{ text: "Company Contact", bold: true }, data.soi_employment?.company_contact ?? "-"],
            [{ text: "Company Email", bold: true }, data.soi_employment?.company_email ?? "-"],
            [{ text: "Date of Employment", bold: true }, data.soi_employment?.date_of_employment ? new Date(data.soi_employment.date_of_employment).toDateString() : "-"],
            [{ text: "Designation", bold: true }, data.soi_employment?.designation ?? "-"],
            [{ text: "Net Salary", bold: true }, this.utilsService.currencyFormatter(data.soi_employment?.net_salary ?? 0)],
            [{ text: "Pay Frequency", bold: true }, data.soi_employment?.pay_frequency?.replace(/_/g, " ") ?? "-"],
            [{ text: "Status", bold: true }, data.soi_employment?.status?.replace(/_/g, " ") ?? "-"],
            [{ text: "Remarks", bold: true }, data.soi_employment?.remarks ?? "-"],
          ],
        },
        layout: "noBorders",
        margin: [0, 0, 0, 10],
      };
    }

    if (data.soi_pension_fund) {
      // Get the data of the source of income pension fund then append it on the table
      sourceOfIncomePension = {
        table: {
          widths: ["*", "*"],
          body: [
            [{ text: "Amount", bold: true }, this.utilsService.currencyFormatter(data.soi_pension_fund?.amount ?? 0)],
            [{ text: "Pay Frequency", bold: true }, data.soi_pension_fund?.pay_frequency.replace(/_/g, " ") ?? "-"],
            [{ text: "Source", bold: true }, data.soi_pension_fund?.source ?? "-"],
            [{ text: "Remarks", bold: true }, data.soi_pension_fund?.remarks ?? "-"],
          ],
        },
        layout: "noBorders",
        margin: [0, 0, 0, 10],
      };
    }

    if (data.soi_business_owner) {
      // Get the data of the source of income business owner then append it on the table
      sourceOfIncomeBusiness = {
        table: {
          widths: ["*", "*"],
          body: [
            [{ text: "Business Name", bold: true }, data.soi_business_owner?.business_name ?? "-"],
            [{ text: "Net Income", bold: true }, this.utilsService.currencyFormatter(data.soi_business_owner?.net_income ?? 0)],
            [{ text: "Business Address", bold: true }, data.soi_business_owner?.business_address ?? "-"],
            [{ text: "Business Contact", bold: true }, data.soi_business_owner?.business_contact ?? "-"],
            [{ text: "Business Telephone", bold: true }, data.soi_business_owner?.business_telephone ?? "-"],
            [{ text: "Business Email", bold: true }, data.soi_business_owner?.business_email ?? "-"],
            [{ text: "Remarks", bold: true }, data.soi_business_owner?.remarks ?? "-"],
          ],
        },
        layout: "noBorders",
        margin: [0, 0, 0, 10],
      };

    }

    if (data.soi_self_employed) {
      // Get the data of the source of income self employed then append it on the table
      sourceOfIncomeSelfEmployed = {
        table: {
          widths: ["*", "*"],
          body: [
            [{ text: "Net Income", bold: true }, this.utilsService.currencyFormatter(data.soi_self_employed?.net_income ?? 0)],
            [{ text: "Source", bold: true }, data.soi_self_employed?.source ?? "-"],
            [{ text: "Remarks", bold: true }, data.soi_self_employed?.remarks ?? "-"],
          ],
        },
        layout: "noBorders",
        margin: [0, 0, 0, 10],
      };

    }

    if (data.soi_other) {
      // Get the data of the source of income other then append it on the table
      sourceOfIncomeOthers = {
        table: {
          widths: ["*", "*"],
          body: [
            [{ text: "Remarks", bold: true }, data.soi_other?.remarks ?? "-"],
          ],
        },
        layout: "noBorders",
        margin: [0, 0, 0, 10],
      };

    }

    // Get the data of Collateral ATM Card then append it on the table
    let collateralATMCard = data.cl_atm_card?.map((item) => {
      return {
        table: {
          widths: ["*", "*"],
          body: [
            [{ text: "Issuing Bank", bold: true }, item.issuing_bank ?? "-"],
            [{ text: "Card Number", bold: true }, item.card_number ?? "-"],
            [{ text: "Account Name", bold: true }, item.account_name ?? "-"],
            [{ text: "Account Type", bold: true }, item.account_type ?? "-"],
            [{ text: "PIN", bold: true }, item.pin ?? "-"],
            [{ text: "Account Number", bold: true }, item.account_number ?? "-"],
            [{ text: "Username", bold: true }, item.username ?? "-"],
            [{ text: "Password", bold: true }, item.password ?? "-"],
            [{ text: "Remarks", bold: true }, item.remarks ?? "-"],
          ],
        },
        layout: "noBorders",
        margin: [0, 0, 0, 10],
      };
    }) ?? [];

    // Get the data of Collateral Bank Check then append it on the table
    let collateralCheck = data.cl_bank_check?.map((item) => {
      return {
        table: {
          widths: ["*", "*"],
          body: [
            [{ text: "Check Date", bold: true }, item.check_date ?? "-"],
            [{ text: "Issuing Bank", bold: true }, item.issuing_bank ?? "-"],
            [{ text: "Amount", bold: true }, this.utilsService.currencyFormatter(item.amount) ?? "-"],
            [{ text: "Check Number", bold: true }, item.check_number ?? "-"],
            [{ text: "Payee", bold: true }, item.payee ?? "-"],
            [{ text: "Date Acquired", bold: true }, item.date_acquired ?? "-"],
            [{ text: "Remarks", bold: true }, item.remarks ?? "-"],
          ],
        },
        layout: "noBorders",
        margin: [0, 0, 0, 10],
      };
    }) ?? [];

    // Get the data of Collateral Lot then append it on the table
    let collateralLot = data.cl_lot?.map((item) => {
      return {
        table: {
          widths: ["*", "*"],
          body: [
            [{ text: "Property Address", bold: true }, item.l_property_address ?? "-"],
            [{ text: "Property Type", bold: true }, item.l_property_type ?? "-"],
            [{ text: "Property Value", bold: true }, this.utilsService.currencyFormatter(item.l_property_value ?? 0)],
            [{ text: "Tax Deed Number", bold: true }, item.l_tax_deed_number ?? "-"],
            [{ text: "Tax Declaration Number", bold: true }, item.l_tax_declaration_number ?? "-"],
            [{ text: "Square Meter Area", bold: true }, item.l_sqm_area ?? "-"],
            [{ text: "Title Number", bold: true }, item.l_title_number ?? "-"],
            [{ text: "Remarks", bold: true }, item.remarks ?? "-"],
          ],
        },
        layout: "noBorders",
        margin: [0, 0, 0, 10],
      };
    }) ?? [];


    // Get the data of Collateral House and Lot then append it on the table
    let collateralHouseAndLot = data.cl_house_and_lot?.map((item) => {
      return {
        table: {
          widths: ["*", "*"],
          body: [
            [{ text: "Property Address", bold: true }, item.hal_property_address ?? "-"],
            [{ text: "Property Type", bold: true }, item.hal_property_type ?? "-"],
            [{ text: "Property Value", bold: true }, this.utilsService.currencyFormatter(item.hal_property_value ?? 0)],
            [{ text: "Tax Deed Number", bold: true }, item.hal_tax_deed_number ?? "-"],
            [{ text: "Tax Declaration Number", bold: true }, item.hal_tax_declaration_number ?? "-"],
            [{ text: "Square Meter Area", bold: true }, item.hal_sqm_area ?? "-"],
            [{ text: "Title Number", bold: true }, item.hal_title_number ?? "-"],
            [{ text: "Remarks", bold: true }, item.remarks ?? "-"],
          ],
        },
        layout: "noBorders",
        margin: [0, 0, 0, 10],
      };
    }) ?? [];


    // Get the data of Collateral Item then append it on the table
    let collateralItem = data.cl_item?.map((item) => {
      return {
        table: {
          widths: ["*", "*"],
          body: [
            [{ text: "Item Description", bold: true }, item.item_description ?? "-"],
            [{ text: "Item Serial Number", bold: true }, item.item_serial_number ?? "-"],
            [{ text: "Item Quantity", bold: true }, item.item_quantity ?? "-"],
            [{ text: "Item Monetary Value", bold: true }, this.utilsService.currencyFormatter(item.item_monetary_value ?? 0)],
            [{ text: "Date Acquired", bold: true }, item.date_acquired ?? "-"],
            [{ text: "Remarks", bold: true }, item.remarks ?? "-"],
          ],
        },
        layout: "noBorders",
        margin: [0, 0, 0, 10],
      };
    }) ?? [];

    // Get the data of Collateral Vehicle then append it on the table
    let collateralVehicle = data.cl_vehicle?.map((item) => {
      return {
        table: {
          widths: ["*", "*"],
          body: [
            [{ text: "Vehicle Details", bold: true }, item.vehicle_details ?? "-"],
            [{ text: "Official Receipt", bold: true }, item.official_receipt ?? "-"],
            [{ text: "Certificate of Registration", bold: true }, item.certificate_of_registration ?? "-"],
            [{ text: "Remarks", bold: true }, item.remarks ?? "-"],
          ],
        },
        layout: "noBorders",
        margin: [0, 0, 0, 10],
      };
    }) ?? [];

    // Get the data of Collateral Other then append it on the table
    let collateralOthers = data.cl_other?.map((item) => {
      return {
        table: {
          widths: ["*", "*"],
          body: [
            [{ text: "Remarks", bold: true }, item.remarks ?? "-"],
          ],
        },
        layout: "noBorders",
        margin: [0, 0, 0, 10],
      };
    }) ?? [];


    // Get the data of the comaker then append it on the table
    const coMakerTextEntries = data.co_makers.map((comaker) => {
      return {
        text: `${comaker.cx_detail.first_name} ${comaker.cx_detail.last_name}`,
        bold: false,
      };
    });

    // Get the data of the addresses then append it on the table
    let addressDisplayInfo = data.cx_address.map((address) => {
      return {
        text: `${address.complete_address}`,
        bold: false,
      };
    });

    // Get the data of principal loan then append it on the table
    let principalLoanData = data.cxl_principal_loan?.map((item) => {
      return {
        table: {
          widths: ["*", "*"],
          body: [
            [{ text: "Loan Amount", bold: true }, this.utilsService.currencyFormatter(item.loan_amount ?? 0)],
            [{ text: "Loan Interest Rate", bold: true }, { text: `${item.loan_interest_rate ?? "-"} %` }],
            [{ text: "Loan Mode of Payment", bold: true }, item.loan_mode_of_payment?.replace(/_/g, " ") ?? "-"],
            [{ text: "Loan Opening Date", bold: true }, this.datePipe.transform(item.loan_opening_date, 'longDate')?.toString() ?? "-"],
            [{ text: "Loan Closed Date", bold: true }, this.datePipe.transform(item.loan_closed_date, 'longDate')?.toString() ?? "-"],
            [{ text: "Loan Status", bold: true }, item.loan_status?.replace(/_/g, " ") ?? "-"],
            [{ text: "Date Marked as Delinquent", bold: true }, item.date_marked_as_delinquent ?? "-"],
            [{ text: "Loan Remarks", bold: true }, item.loan_remarks ?? "-"],
          ],
        },
        layout: "noBorders",
        margin: [0, 0, 0, 10],
      };
    }) ?? [];

    this.templateReportGeneratorService.open({
      content: [
        { text: "DOLBEN LENDING INVESTOR CORPORATION", fontSize: 14, color: "blue", style: "header", alignment: "center", margin: [0, 10, 0, 0] },
        { text: "16 KAUFFMAN ST., GORDON HEIGHTS, OLONGAPO CITY, ZAMBALES", style: "subtitle", alignment: "center", },
        { text: "CUSTOMER PERSONAL DATA SHEET", color: "red", bold: true, alignment: "center", fontSize: 16, margin: [0, 0, 0, 10] },
        {
          table: {
            widths: ["auto", "*"],
            body: [
              [{ text: "Customer Name", bold: true }, { text: `${data.first_name ?? ""} ${data.middle_name ?? ""} ${data.last_name ?? ""} ${data.extension_name ?? ""}`, bold: false }],
              [{ text: "Sex at Birth", bold: true }, { text: data.gender?.toUpperCase().replace(/_/g, " ") ?? "-" }],
              [{ text: "Civil Status", bold: true }, { text: data.civil_status?.toUpperCase().replace(/_/g, " ") ?? "-" }],
              [{ text: "Mobile Number", bold: true }, data.mobile_number ?? "-"],
              [{ text: "Telephone Number", bold: true }, data.telephone_number ?? "-"],
              [{ text: "Email Address", bold: true }, data.email_address ?? "-"],
              [{ text: "Date of Birth", bold: true }, data.date_of_birth ? this.datePipe.transform(data.date_of_birth, 'longDate')?.toString() : "-"],
              [{ text: "Client Status", bold: true }, data.client_status?.replace(/_/g, " ") ?? "-"],
              [{ text: "Co-Makers", bold: true }, coMakerTextEntries.length > 0 ? { ol: coMakerTextEntries.map((item) => item.text) } : "-"],
              [{ text: "Co-Maker Override/Status", bold: true }, data.cmk_status?.replace(/_/g, " ") ?? "-"],
              [{ text: "Address", bold: true }, addressDisplayInfo.length > 0 ? { ol: addressDisplayInfo.map((item) => item.text) } : "-"],

              [{ text: "PRINCIPAL LOAN DATA", bold: true, fontSize: 10, marginBottom: 5, marginTop: 15, color: 'green' }, ""],
              [
                { text: "Principal Loan", bold: true },
                principalLoanData.length > 0 ? principalLoanData : { text: "No data available.", bold: false },
              ],

              [{ text: "CUSTOMER COLLATERAL", bold: true, fontSize: 10, marginBottom: 5, marginTop: 15, color: 'red' }, ""],
              [{ text: "ATM Card Data", bold: true }, collateralATMCard.length > 0 ? collateralATMCard : { text: "No data available.", bold: false }],
              [{ text: "Bank Check Data", bold: true }, collateralCheck.length > 0 ? collateralCheck : { text: "No data available.", bold: false }],
              [{ text: "Lot Data", bold: true }, collateralLot.length > 0 ? collateralLot : { text: "No data available.", bold: false }],
              [{ text: "House and Lot Data", bold: true }, collateralHouseAndLot.length > 0 ? collateralHouseAndLot : { text: "No data available.", bold: false }],
              [{ text: "Item Data", bold: true }, collateralItem.length > 0 ? collateralItem : { text: "No data available.", bold: false }],
              [{ text: "Vehicle Data", bold: true }, collateralVehicle.length > 0 ? collateralVehicle : { text: "No data available.", bold: false }],
              [{ text: "Other Data", bold: true }, collateralOthers.length > 0 ? collateralOthers : { text: "No data available.", bold: false }],
              [{ text: "END OF CUSTOMER COLLATERAL", bold: true, fontSize: 7, marginBottom: 5, marginTop: 15, color: 'red' }, ""],

              [{ text: "CUSTOMER SOURCE OF INCOME", bold: true, fontSize: 10, marginBottom: 5, marginTop: 15, color: 'red' }, ""],
              [{ text: "Employment Data", bold: true }, sourceOfIncomeEmployment ? sourceOfIncomeEmployment : { text: "No data available.", bold: false }],
              [{ text: "Pension Fund Data", bold: true }, sourceOfIncomePension ? sourceOfIncomePension : { text: "No data available.", bold: false }],
              [{ text: "Business Owner Data", bold: true }, sourceOfIncomeBusiness ? sourceOfIncomeBusiness : { text: "No data available.", bold: false }],
              [{ text: "Self Employed Data", bold: true }, sourceOfIncomeSelfEmployed ? sourceOfIncomeSelfEmployed : { text: "No data available.", bold: false }],
              [{ text: "Other Data", bold: true }, sourceOfIncomeOthers ? sourceOfIncomeOthers : { text: "No data available.", bold: false }],
              [{ text: "END OF CUSTOMER SOURCE OF INCOME", bold: true, fontSize: 7, marginBottom: 5, marginTop: 15, color: 'red' }, ""],
            ],
          },
          layout: "noBorders",
          style: "defaultStyle",
        },
      ],
      footer: [
        { text: `DATE/TIME GENERATED: ${new Date().toLocaleString()}`, alignment: "right", marginRight: 15, fontSize: 9 },
        { text: `GENERATED BY: ${this.userService.getFullName()}`, alignment: "right", fontSize: 9, marginRight: 15, italics: true },
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
    });
  }
}