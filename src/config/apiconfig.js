const BASE_URL = "https://msmeerpsyn9-core.azurewebsites.net/api";
// const BASE_URL = "https://localhost:7145/api";

export const API_ENDPOINTS = {
  Account: `${BASE_URL}/Account/`, 
  Ledger: `${BASE_URL}/AccountLedger/`,
  SubLedger: `${BASE_URL}/AccountSubLedger/`,
  VoucherType: `${BASE_URL}/AccountVoucherType/`,
  SubVoucherType: `${BASE_URL}/AccountSubVoucherType/`,
  Comapny: `${BASE_URL}/AccountCompany/`,
  FiscalPeriod: `${BASE_URL}/AccountFiscalPeriod/`,
  BankDetails: `${BASE_URL}/AccountBankDetails/`,
   CreditNote: `${BASE_URL}/credit-note`,
  DebitNote: `${BASE_URL}/Debit-note`,
};
