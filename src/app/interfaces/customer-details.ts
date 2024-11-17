export interface CustomerDetails {
    customer_id: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    extension_name: string;
    gender: string;
    civil_status: string;
    mobile_number: string;
    telephone_number: string;
    email_address: string;
    client_picture: string;
    date_of_birth: string;
    client_status: string;
    cmk_status: string;
    date_marked_as_delinquent: Date | string;

    cx_address: CustomerAddress[];

    soi_employment: CustomerSourceOfIncomeEmployment[];
    soi_pension_fund: CustomerSourceOfIncomePensionFund[];
    soi_business_owner: CustomerSourceOfIncomeBusinessOwner[];
    soi_self_employed: CustomerSourceOfIncomeSelfEmployed[];
    soi_other: CustomerSourceOfIncomeOther[];

    cl_atm_card: CustomerCollateralATMCard[];
    cl_bank_check: CustomerCollateralBankCheck[];
    cl_lot: CustomerCollateralLot[];
    cl_house_and_lot: CustomerCollateralHouseAndLot[];
    cl_item: CustomerCollateralItem[];
    cl_vehicle: CustomerCollateralVehicle[];
    cl_other: CustomerCollateralOther[];

    cxl_principal_loan: CustomerPrincipalLoan[];

    dlq_court_hearing: DelinquencyCourtHearing[];
    dlq_demand_letter: DelinquencyDemandLetter[];
    dlq_personally_reported: DelinquencyPersonallyReported[];
    dlq_other: DelinquencyOther[];

    co_makers: CustomerCoMaker[];
}

export interface CustomerAddress {
    complete_address: string;
}
[];

/**
 * Represents the employment details of a customer's source of income.
 */

export interface CustomerSourceOfIncomeEmployment {
    designation: string;
    company: string;
    company_address: string;
    company_contact: string;
    company_email: string;
    date_of_employment: Date | string;
    net_salary: number;
    pay_frequency: string;
    status: string;
    remarks: string;
}

export interface CustomerSourceOfIncomePensionFund {
    recno: number;
    id: string;
    customer_id: string;
    amount: number;
    pay_frequency: string;
    source: string;
    remarks?: string;
}

export interface CustomerSourceOfIncomeBusinessOwner {
    recno: number;
    id: string;
    customer_id: string;
    business_name: string;
    net_income: number;
    business_address: string;
    business_contact?: string;
    business_telephone?: string;
    business_email?: string;
    remarks?: string;
}

export interface CustomerSourceOfIncomeSelfEmployed {
    recno: number;
    id: string;
    customer_id: string;
    net_income: number;
    source: string;
    remarks?: string;
}

export interface CustomerSourceOfIncomeOther {
    recno: number;
    id: string;
    customer_id: string;
    remarks?: string;
}

export interface CustomerCollateralATMCard {
    recno: number;
    id: string;
    customer_id: string;
    attachment_id: string;
    issuing_bank: string;
    card_number: string;
    account_name: string;
    account_type: string;
    pin: string;
    account_number?: string;
    username?: string;
    password?: string;
    remarks?: string;
    created_at: Date;
    updated_at: Date;
}

export interface CustomerCollateralBankCheck {
    recno: number;
    id: string;
    customer_id: string;
    attachment_id: string;
    check_date: Date;
    issuing_bank: string;
    amount: number;
    check_number: string;
    payee: string;
    date_acquired?: Date;
    remarks?: string;
    created_at: Date;
    updated_at: Date;
}

export interface CustomerCollateralLot {
    recno: number;
    id: string;
    customer_id: string;
    attachment_id: string;
    l_property_address: string;
    l_property_type?: string;
    l_property_value?: number;
    l_tax_deed_number?: string;
    l_tax_declaration_number?: string;
    l_sqm_area?: string;
    l_title_number?: string;
    remarks?: string;
    created_at: Date;
    updated_at: Date;
}

export interface CustomerCollateralHouseAndLot {
    recno: number;
    id: string;
    customer_id: string;
    attachment_id: string;
    hal_property_address: string;
    hal_property_type?: string;
    hal_property_value?: number;
    hal_tax_deed_number?: string;
    hal_tax_declaration_number?: string;
    hal_sqm_area?: number;
    hal_title_number?: string;
    remarks?: string;
    created_at: Date;
    updated_at: Date;
}

export interface CustomerCollateralItem {
    recno: number;
    id: string;
    customer_id: string;
    attachment_id: string;
    item_description: string;
    item_serial_number?: string;
    item_quantity: string;
    item_monetary_value: number;
    date_acquired: Date;
    remarks?: string;
    created_at: Date;
    updated_at: Date;
}

export interface CustomerCollateralVehicle {
    recno: number;
    customer_id: string;
    id: string;
    attachment_id: string;
    vehicle_type: string;
    vehicle_brand: string;
    vehicle_model: string;
    vehicle_color: string;
    vehicle_plate: string;
    vehicle_chassis: string;
    vehicle_engine: string;
    vehicle_serial: string;
    vehicle_year: string;
    vehicle_value: number;
    vehicle_status: string;
    date_acquired: Date;
    remarks?: string;
    created_at: Date;
    updated_at: Date;
}

export interface CustomerCollateralOther {
    recno: number;
    customer_id: string;
    id: string;
    attachment_id: string;
    monetary_value: number;
    date_acquired: Date;
    remarks?: string;
    created_at: Date;
    updated_at: Date;
}

// End of Collateral

export interface CustomerPrincipalLoan {
    recno: number;
    customer_id: string;
    loan_id: string;
    loan_amount: number;
    loan_interest_rate: number;
    loan_mode_of_payment: string;
    loan_opening_date: Date;
    loan_closed_date?: Date;
    loan_status: string;
    date_marked_as_delinquent?: Date;
    loan_remarks?: string;
    created_at: Date;
    updated_at: Date;
    cx_detail: CustomerDetails;
    cxl_transaction: CustomerTransaction[];
}

export interface CustomerTransaction {
    recno: number;
    transaction_id: string;
    loan_id: string;
    transaction_date: Date;
    transaction_or_number?: number;
    balance_interest: number;
    interest: number;
    payment: number;
    capital: number;
    balance: number;
    collection: number;
    change: number;
    is_interest_applied: boolean;
    is_deleted: boolean;
    transaction_status: string;
    transaction_remarks?: string;
    created_at: Date;
    updated_at: Date;
}

export interface DelinquencyCourtHearing {
    recno: number;
    id: string;
    customer_id: string;
    hearing_date: Date;
    location: string;
    status?: string;
    remarks?: string;
    created_at: Date;
    updated_at: Date;
}

export interface DelinquencyDemandLetter {
    recno: number;
    id: string;
    customer_id: string;
    demand_letter_date: Date;
    returned_date?: Date;
    remarks?: string;
    status?: string;
    created_at: Date;
    updated_at: Date;
}

export interface DelinquencyPersonallyReported {
    recno: number;
    id: string;
    customer_id: string;
    date_reported: Date;
    remarks?: string;
    response?: string;
    created_at: Date;
    updated_at: Date;
}

export interface DelinquencyOther {
    recno: number;
    id: string;
    customer_id: string;
    remarks: string;
    created_at: Date;
    updated_at: Date;
}

export interface CustomerCoMaker {
    customer_id: string;
    comaker_id: string;
    cx_detail: CustomerDetails;
}