const BASE_URL = "https://msmeerpsyn9-core.azurewebsites.net/api";
// const BASE_URL = "https://localhost:7145/api";
const API_BASE_URL = 'http://localhost:49980/Vendor';
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
  GetSellers: `${BASE_URL}/GRN/suppliers`,

  Journal: `${BASE_URL}/journals`,
  Voucher: `${BASE_URL}/vouchers`,
  Voucher: `${BASE_URL}/vouchers`,
  Account: `${BASE_URL}/Account/`,
  GetSellers: `${BASE_URL}/GRN/suppliers`,
  GetGRNNumbersBySeller: `${BASE_URL}/GRN/GetGRNNumbersBySeller`,
  GetGRNDetails: `${BASE_URL}/GRN/GetGRNDetails`,
  SaveGRN: `${BASE_URL}/GRN/SaveGRN`,
 Ledger: `${BASE_URL}/AccountLedger`,
  AllVendor: `${API_BASE_URL}/GetAllVendorsApi`,
  DeleteItem: `${API_BASE_URL}/DeleteItemApi`,
  UpdateVendor: `${API_BASE_URL}/UpdateVendorApi`,
  AccountType:`${API_BASE_URL}/Account/AccountType`,


};
