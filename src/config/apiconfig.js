const BASE_URL = "https://msmeerpsyn9-core.azurewebsites.net/api";
//  const BASE_URL = "https://localhost:7145/api";

export const API_ENDPOINTS = {
  Group: `${BASE_URL}/AccountGroups`,
  Ledger: `${BASE_URL}/AccountLedger/`,
  SubLedger: `${BASE_URL}/AccountSubLedger/`,
  VoucherType: `${BASE_URL}/AccountVoucherType/`,
  SubVoucherType: `${BASE_URL}/AccountSubVoucherType/`,
  Comapny: `${BASE_URL}/AccountCompany/`,
  FiscalPeriod: `${BASE_URL}/AccountFiscalPeriod/`,
  BankDetails: `${BASE_URL}/AccountBankDetails/`,
  Vendors: `${BASE_URL}/AccountBankDetails/`,
  AccountBankDetails: `${BASE_URL}/AccountBankDetails`,
  AccountBankDetailsSave: `${BASE_URL}/AccountBankDetails`,

  Invoices: `${BASE_URL}/Invoices/`,
  AccountBankDetails: `${BASE_URL}/AccountBankDetails/`,
  Banks: `${BASE_URL}/banks`,
  CreditNote: `${BASE_URL}/credit-note`,
  DebitNote: `${BASE_URL}/Debit-note`,
  GetSellers: `${BASE_URL}/GRN/suppliers`,

  Journal: `${BASE_URL}/journals`,
  Account: `${BASE_URL}/Account/`,
  GetSellers: `${BASE_URL}/GRN/suppliers`,
  GetGRNNumbersBySeller: `${BASE_URL}/GRN/GetGRNNumbersBySeller`,
  GetGRNDetails: `${BASE_URL}/GRN/GetGRNDetails`,
  SaveGRN: `${BASE_URL}/GRN/SaveGRN`,

  Voucher: `${BASE_URL}/AccountVoucher`,
  Vendors: `${BASE_URL}/vendors`,
  PurchaseOrders: `${BASE_URL}/PurchaseOrders`,
  SalesInvoices: `${BASE_URL}/SalesInvoices`,
  GetPurchaseAmountById: `${BASE_URL}/GetPurchaseAmountById`,
  GetSaleAmountById: `${BASE_URL}/GetSaleAmountById`,
  PaymentMode: `${BASE_URL}/PaymentMode`,
  Status: `${BASE_URL}/Status`,
  GetVoucherDetails:`${BASE_URL}/GetVoucherDetails`,

  AccountSale: `${BASE_URL}/AccountSale`,
  Getbuyers: `${BASE_URL}/Buyers`,
  GetinvoiceNumbersBybuyer: `${BASE_URL}/GetinvoiceNumbersBybuyer`,
  GetInvoiceItemDetails: `${BASE_URL}/GetInvoiceItemDetails`,
  CheckedSaleDetails: `${BASE_URL}/CheckedSaleDetails`,
  ApprovedAccountSale: `${BASE_URL}/ApprovedAccountSale`
};
