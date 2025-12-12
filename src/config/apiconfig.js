const BASE_URL = "https://msmeerpsyn9-core.azurewebsites.net/api";
 //const BASE_URL = "https://localhost:7145/api";

//const BASE_URL = "https://localhost:7145/api";
//const API_BASE_URL = 'http://localhost:49980/Vendor';

export const API_ENDPOINTS = {
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

  Journal: `${BASE_URL}/journals`,
  Account: `${BASE_URL}/Account/`,
  GetSellers: `${BASE_URL}/GRN/suppliers`,
  GetGRNNumbersBySeller: `${BASE_URL}/GRN/GetGRNNumbersBySeller`,
    GetGRNsBySeller: `${BASE_URL}/GRN/GetGRNsBySeller`, // ✅ add this
  GetgrnSellers: `${BASE_URL}/GRN/GetgrnSellers`,
  SaveMultipleGRN: `${BASE_URL}/GRN/SaveMultipleGRN`,

  GetGRNDetails: `${BASE_URL}/GRN/GetGRNDetails`,
  SaveGRN: `${BASE_URL}/GRN/SaveGRN`,


 Ledger: `${BASE_URL}/AccountLedger`,
  AllVendor: `${BASE_URL}/GetAllVendorsApi`,
  DeleteItem: `${BASE_URL}/DeleteItemApi`,
  UpdateVendor: `${BASE_URL}/UpdateVendorApi`,


  Voucher: `${BASE_URL}/AccountVoucher`,
  Vendors: `${BASE_URL}/vendors`,
  PurchaseOrders: `${BASE_URL}/PurchaseOrders`,
  SalesInvoices: `${BASE_URL}/SalesInvoices`,
  GetPurchaseAmountById: `${BASE_URL}/GetPurchaseAmountById`,
  GetSaleAmountById: `${BASE_URL}/GetSaleAmountById`,
  PaymentMode: `${BASE_URL}/PaymentMode`,
  Status: `${BASE_URL}/Status`,
 
};
