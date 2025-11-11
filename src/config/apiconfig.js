const BASE_URL = "https://msmeerp-syn9core.azurewebsites.net/api";
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
};
