//const BASE_URL = "https://msmeerpsyn9-core.azurewebsites.net/api";
 const BASE_URL = "https://localhost:7145/api";

export const API_ENDPOINTS = {
  Ledger: `${BASE_URL}/AccountLedger/`,
  SubLedger: `${BASE_URL}/AccountSubLedger/`,
  VoucherType: `${BASE_URL}/AccountVoucherType/`,
  SubVoucherType: `${BASE_URL}/AccountSubVoucherType/`,
  Comapny: `${BASE_URL}/AccountCompany/`,
  FiscalPeriod: `${BASE_URL}/AccountFiscalPeriod/`,
  BankDetails: `${BASE_URL}/AccountBankDetails/`,
   Vendors: `${BASE_URL}/vendors/`,   
  Invoices: `${BASE_URL}/AccountLedger/`,    
  Items: `${BASE_URL}/AccountBankDetails/`,
  Banks:`${BASE_URL}/banks`,
  CreditNote: `${BASE_URL}/credit-note`,
  DebitNote: `${BASE_URL}/Debit-note`,
  suppliers:`${BASE_URL}/suppliers`,
  GRN:`${BASE_URL}/grn-numbers`,
  PONumber:`${BASE_URL}/po-numbers`,
  ItemNames:`${BASE_URL}/Item/GetAllItemsApi`,
  Journal:`${BASE_URL}/journals`,
AccountType:`${BASE_URL}/Account/AccountType`,
Voucher:`${BASE_URL}/vouchers`,
Voucher:`${BASE_URL}/vouchers`,
AccountGroup:`${BASE_URL}/AccountGroups`,
AccountSubGroup:`${BASE_URL}/Subgroups`,
AccountSubSubGroup:`${BASE_URL}/SubSubgroups`,
};
