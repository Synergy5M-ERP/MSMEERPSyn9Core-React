// const BASE_URL = "https://msmeerpsyn9-core.azurewebsites.net/api";
 const BASE_URL = "https://localhost:7145/api";

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
 
 Departments: `${BASE_URL}/PurchaseReq/GetDepartments`,
  
  // Employee endpoints
  PR_Employees: `${BASE_URL}/PurchaseReq/GetEmpList`,
  PR_EmployeeDetails: (empId) => `${BASE_URL}/PurchaseReq/employee/${empId}`,
  
  // Item endpoints
  ItemList: `${BASE_URL}/PurchaseReq/items`,
  PR_ItemDetails: (itemId) => `${BASE_URL}/PurchaseReq/item/${itemId}`,
  
  // Specification/Grade endpoints
  PR_Specifications: `${BASE_URL}/PurchaseReq/specifications`,
  GetGradesForItem: (itemName) => `${BASE_URL}/PurchaseReq/grades/${encodeURIComponent(itemName)}`,
  GetGradeDetails: (itemName, grade) => `${BASE_URL}/PurchaseReq/gradedetails?itemName=${encodeURIComponent(itemName)}&grade=${encodeURIComponent(grade)}`,
  
  // Currency and UOM endpoints
  PR_Currencies: `${BASE_URL}/PurchaseReq/currencies`,
  PR_UOM: `${BASE_URL}/PurchaseReq/uoms`,
  
  // Budget endpoint
  PR_BudgetByDept: (deptCode) => `${BASE_URL}PurchaseReq/GetLastBudgetBalance/${encodeURIComponent(deptCode)}`,
  
  // Requisition types
  ReqRes: `${BASE_URL}/PurchaseReq/requisitions`,
  
  // Create Manual PR
  CreateManualPR: `${BASE_URL}/PurchaseReq/create`,
  
  // View List PR
  ViewListPR: `${BASE_URL}/PurchaseReq/list`,
  
  // PR Numbers and Department Names
  GetPRNumbers: `${BASE_URL}/PurchaseReq/GetPrn`,
  GetDepartmentNames: `${BASE_URL}/PurchaseReq/departmentnames`,

};
