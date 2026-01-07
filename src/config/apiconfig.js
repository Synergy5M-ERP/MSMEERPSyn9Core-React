

// const BASE_URL = "https://msmeerpsyn9-core.azurewebsites.net/api";
 const BASE_URL = "https://localhost:7145/api";




export const API_ENDPOINTS = {
 // ================= HRM ADMIN =================
  ModuleUserData: `${BASE_URL}/HRMAdminRegAPI/Login/ModuleUserData`,
  GetUserDetails: `${BASE_URL}/HRMAdminRegAPI/GetUserDetails`,
  GetUserModules: `${BASE_URL}/HRMAdminRegAPI/GetUserModules`,
  UpdateUserModules: `${BASE_URL}/HRMAdminRegAPI/UpdateUserModules`,
  DEPARTMENT: `${BASE_URL}/HrmMaster/Department`,
  DESIGNATION: `${BASE_URL}/HrmMaster/Designation`,
  AUTHORITY_MATRIX: `${BASE_URL}/HrmMaster/AuthorityMatrix`,

  GET_INDUSTRY: `${BASE_URL}/HRMAdminRegAPI/GetIndustry`,
  GET_CONTINENT: `${BASE_URL}/HRMAdminRegAPI/GetContinent`,
  GET_CURRENCY:`${BASE_URL}/HrmMaster/GetCurrency`,
  GET_COUNTRY: `${BASE_URL}/HrmMaster/GetCountry`,
  GET_STATE: `${BASE_URL}/HrmMaster/GetState`,
  GET_CITY: `${BASE_URL}/HrmMaster/GetCity`,
  ORG_CHART_WITH_BUDGET:`${BASE_URL}/HrmMaster/OrgChartWithBudget`,

  Emp_Info: `${BASE_URL}/HrmOrgInfo/EmpInfo`,           // GET
  MatrixSave: `${BASE_URL}/HrmOrgInfo/SaveEmpInfo`,     // POST
  MatrixList: `${BASE_URL}/HrmOrgInfo/MatrixList`,      // GET
  UpdateMatrixStatus: `${BASE_URL}/HrmOrgInfo/UpdateStatus`, // PUT /{id}
  EditMatrix: `${BASE_URL}/HrmOrgInfo/EditMatrix`, 


  //------------------------Account APIs----------------------------------
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
  Banks: `${BASE_URL}/banks`,
  CreditNote: `${BASE_URL}/credit-note`,
  DebitNote: `${BASE_URL}/Debit-note`,
  suppliers: `${BASE_URL}/suppliers`,
  GRN: `${BASE_URL}/grn-numbers`,
  PONumber: `${BASE_URL}/po-numbers`,
  ItemNames: `${BASE_URL}/Item/GetAllItemsApi`,
  Journal: `${BASE_URL}/journals`,
  AccountType: `${BASE_URL}/Account/AccountType`,
  Voucher: `${BASE_URL}/vouchers`,
  Group: `${BASE_URL}/AccountGroups`,
  AccountSubGroup: `${BASE_URL}/Subgroups`,
  AccountSubSubGroup: `${BASE_URL}/SubSubgroups`,

  // ✅ FIXED
  Inventory: `${BASE_URL}/Inventory`,
  Vendors: `${BASE_URL}/AccountBankDetails/`,
  AccountBankDetails: `${BASE_URL}/AccountBankDetails`,
  AccountBankDetailsSave: `${BASE_URL}/AccountBankDetails`,

  Invoices: `${BASE_URL}/Invoices/`,
  AccountBankDetails: `${BASE_URL}/AccountBankDetails/`,
  Banks: `${BASE_URL}/banks`,
  CreditNote: `${BASE_URL}/credit-note`,
  DebitNote: `${BASE_URL}/Debit-note`,


ViewEmployees:`${BASE_URL}/HrmMaster/Employee`,

  OutwardQc:`${BASE_URL}/OutwardQCReport`,
  SaveRejectionQty:`${BASE_URL}/SaveRejectionQty`,
  SubmitButtonDisable:`${BASE_URL}/SubmitButtonDisable`,

  Journal: `${BASE_URL}/journals`,
  Account: `${BASE_URL}/Account/`,
  GetSellers: `${BASE_URL}/GRN/suppliers`,

  GetGRNNumbersBySeller: `${BASE_URL}/GRN/GetGRNNumbersBySeller`,
  GetGRNsBySeller: `${BASE_URL}/GRN/GetGRNsBySeller`, // ✅ add this
  GetgrnSellers: `${BASE_URL}/GRN/GetgrnSellers`,
  SaveMultipleGRN: `${BASE_URL}/GRN/SaveMultipleGRN`,
  Vendors: `${BASE_URL}/AccountBankDetails/Vendors`,

  GetGRNDetails: `${BASE_URL}/GRN/GetGRNDetails`,
  SaveGRN: `${BASE_URL}/GRN/SaveGRN`,

  // Ledger: `${BASE_URL}/AccountLedger`,
  AllVendor: `${BASE_URL}/GetAllVendorsApi`,
  DeleteItem: `${BASE_URL}/DeleteItemApi`,
  UpdateVendor: `${BASE_URL}/UpdateVendorApi`,

  AccountVoucher: `${BASE_URL}/AccountVoucher`,
  Vendors: `${BASE_URL}/vendors`,
  PurchaseOrders: `${BASE_URL}/PurchaseOrders`,
  SalesInvoices: `${BASE_URL}/SalesInvoices`,
  GetPurchaseAmountById: `${BASE_URL}/GetPurchaseAmountById`,
  GetSaleAmountById: `${BASE_URL}/GetSaleAmountById`,
  PaymentMode: `${BASE_URL}/PaymentMode`,
  Status: `${BASE_URL}/Status`,
  GetNextVoucherNumber: `${BASE_URL}/GetNextVoucherNumber`,
  GetVoucherDetails:`${BASE_URL}/GetVoucherDetails`,

  AccountSale: `${BASE_URL}/AccountSale`,
  Getbuyers: `${BASE_URL}/Buyers`,
  GetinvoiceNumbersBybuyer: `${BASE_URL}/GetinvoiceNumbersBybuyer`,
  GetInvoiceItemDetails: `${BASE_URL}/GetInvoiceItemDetails`,
  CheckedSaleDetails: `${BASE_URL}/CheckedSaleDetails`,
  ApprovedAccountSale: `${BASE_URL}/ApprovedAccountSale`,


 GetApprovedGrn:`${BASE_URL}/GRN/GRNApprovedDetails`,
 GetApprovedInvoice:`${BASE_URL}/GetApprovedInvoice`,
  Category: `${BASE_URL}/Category`,
//------------------------Account APIs----------------------------------


  
  // Employee endpoints
  Departments: `${BASE_URL}/PurchaseReq/GetDepartments`,
  
  // Employee Endpoints
//   PR_Employees: `${BASE_URL}/PurchaseReq/GetEmpList`,
//   PR_EmployeeDetails: (empName) => `${BASE_URL}/PurchaseReq/GetEmpDetails?empName=${encodeURIComponent(empName)}`,
  
//   // Item Endpoints
//   ItemList: `${BASE_URL}/PurchaseReq/GetItemList`,
//   PR_GradesForItem: (itemName) => `${BASE_URL}/PurchaseReq/GetGradesForItem?itemName=${encodeURIComponent(itemName)}`,
//   PR_ItemDetails: (itemName, grade) => `${BASE_URL}/PurchaseReq/GetGradeDetails?itemName=${encodeURIComponent(itemName)}&grade=${encodeURIComponent(grade)}`,
  
//   // Budget Endpoint
//   PR_BudgetByDept: (deptCode) => `${BASE_URL}/PurchaseReq/GetLastBudgetBalance?departmentCode=${encodeURIComponent(deptCode)}`,
  
//   // Requisition Type Endpoint
//   ReqTypes: `${BASE_URL}/PurchaseReq/GetRequisitionTypes`,
  
//   // Create Purchase Request
//   CreateManualPR: `${BASE_URL}/PurchaseReq/Create`,

// ExportByPR: (prNumber) => `${BASE_URL}/PurchaseReq/ExportByPR?prNumber=${encodeURIComponent(prNumber)}`,
//   // Additional endpoints for future use
//   PR_Specifications: `${BASE_URL}/PurchaseReq/GetSpecifications`,
//   PR_Currencies: `${BASE_URL}/PurchaseReq/GetCurrencies`,
//   PR_UOM: `${BASE_URL}/PurchaseReq/GetUOM`,
//   ReqRes: `${BASE_URL}/PurchaseReq/GetPrn`,
//   // Currency and UOM endpoints
//   PR_Currencies: `${BASE_URL}/PurchaseReq/currencies`,
//   PR_UOM: `${BASE_URL}/PurchaseReq/uoms`,
  
//   // Budget endpoint
//   PR_BudgetByDept: (deptCode) => `${BASE_URL}/PurchaseReq/GetLastBudgetBalance?departmentCode=${encodeURIComponent(deptCode)}`,
  
//   // Requisition types
//   ReqRes: `${BASE_URL}/PurchaseReq/requisitions`,
  
//   // Create Manual PR
//   CreateManualPR: `${BASE_URL}/PurchaseReq/create`,
  
// ViewManualPRList:`${BASE_URL}/PurchaseReq/GetManualPR`,
//   GetPRNumbers: `${BASE_URL}/PurchaseReq/GetPRNo`,
// GetPRForEdit:`${BASE_URL}/PurchaseReq/GetPRForEdit`,




// config/apiconfig.js

  
  // Employee Endpoints
  PR_Employees: `${BASE_URL}/PurchaseReq/GetEmpList`,
  
  // Item Endpoints
  ItemList: `${BASE_URL}/PurchaseReq/GetItemList`,
  PR_GradesForItem: (itemName) => `${BASE_URL}/PurchaseReq/GetGradesForItem?itemName=${encodeURIComponent(itemName)}`,
  PR_ItemDetails: (itemName, grade) => `${BASE_URL}/PurchaseReq/GetGradeDetails?itemName=${encodeURIComponent(itemName)}&grade=${encodeURIComponent(grade)}`,
  
  // Requisition Type Endpoints
  ReqTypes: `${BASE_URL}/PurchaseReq/GetRequisitionTypes`,
  
  // Budget Endpoints
  PR_BudgetByDept: (deptCode) => `${BASE_URL}/PurchaseReq/GetLastBudgetBalance?departmentCode=${encodeURIComponent(deptCode)}`,
  
  // Purchase Request CRUD Endpoints
  CreateManualPR: `${BASE_URL}/PurchaseReq/Create`,
  UpdateManualPR: `${BASE_URL}/PurchaseReq/Update`,
  GetPRForEdit: `${BASE_URL}/PurchaseReq/GetPRForEdit`,
  ViewManualPRList: `${BASE_URL}/PurchaseReq/GetManualPR`,
  GetPRNumbers: `${BASE_URL}/PurchaseReq/GetPRNo`,
   DeleteManualPR: (prNumber) => 
    `${BASE_URL}/PurchaseReq/Delete?prNumber=${encodeURIComponent(prNumber)}`,
  ManualPRReport:`${BASE_URL}/PurchaseReq/GenerateDynamicReport`,
  // Export Endpoint
  ExportPRByNumber:`${BASE_URL}/PurchaseReq/ExportByPR`,
ExportPRByNumberPdf:`${BASE_URL}/PurchaseReq/ExportByPRPdf`
};
