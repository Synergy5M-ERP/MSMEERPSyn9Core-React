
// const BASE_URL = "https://msmeerpsyn9-core.azurewebsites.net/api";
//  const BASE_URL = "https://msmeerpsyn9-core.azurewebsites.net/api";

const BASE_URL = "https://localhost:7145/api";


export const API_ENDPOINTS = {
  // ================= HRM ADMIN =================
    ModuleUserList: `${BASE_URL}/HRMAdminRegAPI/Login/GetModuleUserList`,
      LOGIN: `${BASE_URL}/HRMAdminRegAPI/Login`,
GetUserByEmpCode: `${BASE_URL}/HRMAdminRegAPI/GetUserByEmpCode`,
Logout: `${BASE_URL}/HRMAdminRegAPI/Logout`,
ForgotPassword: `${BASE_URL}/HRMAdminRegAPI/ForgotPassword`,
ResetPassword: `${BASE_URL}/HRMAdminRegAPI/ResetPassword`,

  ModuleUserData: `${BASE_URL}/HRMAdminRegAPI/Login/ModuleUserData`,
  GetUserDetails: `${BASE_URL}/HRMAdminRegAPI/GetUserDetails`,
  GetUserModules: `${BASE_URL}/HRMAdminRegAPI/GetUserModules`,
  UpdateUserModules: `${BASE_URL}/HRMAdminRegAPI/UpdateUserModules`,
  DEPARTMENT: `${BASE_URL}/HrmMaster/Department`,
  DESIGNATION: `${BASE_URL}/HrmMaster/Designation`,
  AUTHORITY_MATRIX: `${BASE_URL}/HrmMaster/AuthorityMatrix`,
GET_INDUSTRY: `${BASE_URL}/HRMAdminRegAPI/GetIndustry`,
    GET_CONTINENT: `${BASE_URL}/HRMAdminRegAPI/GetContinent`,
        CreatePassword: `${BASE_URL}/HRMAdminRegAPI/CreatePassword`,

GET_CURRENCY:`${BASE_URL}/HrmMaster/GetCurrency`,

  GET_INDUSTRY: `${BASE_URL}/HRMAdminRegAPI/GetIndustry`,
  GET_CONTINENT: `${BASE_URL}/HRMAdminRegAPI/GetContinent`,

  GET_CURRENCY: `${BASE_URL}/HrmMaster/GetCurrency`,
  GET_COUNTRY: `${BASE_URL}/HrmMaster/GetCountry`,
  
  GET_STATE: `${BASE_URL}/HrmMaster/GetState`,
  GET_CITY: `${BASE_URL}/HrmMaster/GetCity`,
  ORG_CHART_WITH_BUDGET: `${BASE_URL}/HrmMaster/OrgChartWithBudget`,

 // GET_CURRENCY: `${BASE_URL}/HrmMaster/GetCurrency`,

 // GET_COUNTRY: `${BASE_URL}/HrmMaster/GetCountry`,
  ///GET_STATE: `${BASE_URL}/HrmMaster/GetState`,
  //GET_CITY: `${BASE_URL}/HrmMaster/GetCity`,
  //ORG_CHART_WITH_BUDGET: `${BASE_URL}/HrmMaster/OrgChartWithBudget`,

  Emp_Info: `${BASE_URL}/HrmOrgInfo/EmpInfo`,           // GET
  MatrixSave: `${BASE_URL}/HrmOrgInfo/SaveEmpInfo`,     // POST
  MatrixList: `${BASE_URL}/HrmOrgInfo/MatrixList`,      // GET
  UpdateMatrixStatus:`${BASE_URL}/HrmOrgInfo/UpdateStatus`, // PUT /{id}
  EditMatrix: `${BASE_URL}/HrmOrgInfo/EditMatrix`,
 EditMatrix: `${BASE_URL}/HrmOrgInfo/EditMatrix`,
  GetAll_Employee: `${BASE_URL}/HrmOrgInfo/GetAllEmployees`,
  SaveEmployee: `${BASE_URL}/HrmOrgInfo/SaveAddEmployee`,
  GetEmployeeById: `${BASE_URL}/HrmOrgInfo/GetEmployeeById`,
    UpdateEmployee: `${BASE_URL}/HrmOrgInfo/UpdateEmployee`, // base only
  DeactivateEmployee: `${BASE_URL}/HrmOrgInfo/DeactivateEmployee`,
    GetemployeeAttendance: `${BASE_URL}/HrmOrgInfo/GetEmployeeAttendance`,
HRMAdminReg:`${BASE_URL}/HRMAdminRegAPI/HasChiefAdmin`,
  //------------------------Account APIs----------------------------------//
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
  AccountType: `${BASE_URL}/Account/PrimaryGroup`,
  Voucher: `${BASE_URL}/vouchers`,
  AccountGroups: `${BASE_URL}/AccountGroups`,
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
  // CreditNote: `${BASE_URL}/credit-note`,
  // DebitNote: `${BASE_URL}/Debit-note`,

  OutwardQc: `${BASE_URL}/OutwardQCReport`,
  SaveRejectionQty: `${BASE_URL}/SaveRejectionQty`,
  SubmitButtonDisable: `${BASE_URL}/SubmitButtonDisable`,

  ViewEmployees: `${BASE_URL}/HrmMaster/Employee`,

  OutwardQc: `${BASE_URL}/OutwardQCReport`,
  SaveRejectionQty: `${BASE_URL}/SaveRejectionQty`,
  SubmitButtonDisable: `${BASE_URL}/SubmitButtonDisable`,

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
  SavePaymentAllocation: `${BASE_URL}/GRN/SavePaymentAllocation`,

VendorforProd:`${BASE_URL}/AccountBankDetails/Vendors`,
  Ledger: `${BASE_URL}/AccountLedger`,
  // Ledger: `${BASE_URL}/AccountLedger`,
 // AllVendor: `${BASE_URL}/GetAllVendorsApi`,
  DeleteItem: `${BASE_URL}/DeleteItemApi`,
  UpdateVendor: `${BASE_URL}/UpdateVendorApi`,

  AccountVoucher: `${BASE_URL}/AccountVoucher`,
  CategoryVendors: `${BASE_URL}/CategoryVendors`,
  PurchaseOrders: `${BASE_URL}/PurchaseOrders`,
  SalesInvoices: `${BASE_URL}/SalesInvoices`,
  GetPurchaseAmountById: `${BASE_URL}/GetPurchaseAmountById`,
  GetSaleAmountById: `${BASE_URL}/GetSaleAmountById`,
  PaymentMode: `${BASE_URL}/PaymentMode`,
  Status: `${BASE_URL}/Status`,

  //===========BOM API========================
  //===========Enquiry API====================
  GetPRNumbers: `${BASE_URL}/Enquiry/GetPRNumbers`,
  GetPRItemDetails: `${BASE_URL}/Enquiry/GetPRItemDetails`,
  GetNextVoucherNumber: `${BASE_URL}/GetNextVoucherNumber`,
  GetVoucherDetails: `${BASE_URL}/GetVoucherDetails`,

  AccountSale: `${BASE_URL}/AccountSale`,
  Getbuyers: `${BASE_URL}/Buyers`,
  GetinvoiceNumbersBybuyer: `${BASE_URL}/GetinvoiceNumbersBybuyer`,
  GetInvoiceItemDetails: `${BASE_URL}/GetInvoiceItemDetails`,
  CheckedSaleDetails: `${BASE_URL}/CheckedSaleDetails`,
  ApprovedAccountSale: `${BASE_URL}/ApprovedAccountSale`,

  Category: `${BASE_URL}/Category`,
  GetSellerGRNNumbers: `${BASE_URL}/GetSellerGRNNumbers`,
  GetBuyersInvoiceNumbers: `${BASE_URL}/GetBuyersInvoiceNumbers`,
  GetItemsByGRN: `${BASE_URL}/GetItemsByGRN`,
  GetItemsByInvoice: `${BASE_URL}/GetItemsByInvoice`,
  GetGRNItemsDetails: `${BASE_URL}/GetGRNItemsDetails`,
  GetInvoiceItemsDetails: `${BASE_URL}/GetInvoiceItemsDetails`,
  GetNextCreditNoteNo: `${BASE_URL}/GetNextCreditNoteNo`,
  SaveCreditNote: `${BASE_URL}/SaveCreditNote`,
  GetUnits: `${BASE_URL}/GetUnits`,
  GetNextDebitNoteNo: `${BASE_URL}/GetNextDebitNoteNo`,
  SaveDebitNote: `${BASE_URL}/SaveDebitNote`,
//------------------------Account APIs----------------------------------

GetApprovedGrn: `${BASE_URL}/GRN/GRNApprovedDetails`,
  GetApprovedInvoice: `${BASE_URL}/GetApprovedInvoice`,
  Category: `${BASE_URL}/Category`,
  //------------------------Account APIs----------------------------------

  // Employee endpoints
  Departments: `${BASE_URL}/PurchaseReq/GetDepartments`,
  

  Departments: `${BASE_URL}/PurchaseReq/GetDepartments`,

  // Employee endpoints
  PR_Employees: `${BASE_URL}/PurchaseReq/GetEmpList`,
  PR_EmployeeDetails: (empId) => `${BASE_URL}/PurchaseReq/employee/${empId}`,

  // Item endpoints
 
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
ExportPRByNumberPdf:`${BASE_URL}/PurchaseReq/ExportByPRPdf`,



//Get UOM
ParametGetUOM: `${BASE_URL}/PlantSettingPara/GetUOM`,
SaveMachine:`${BASE_URL}/Production/SaveMachine`,
GetAllMachines:`${BASE_URL}/Production/GetAllMachines`,
DeleteMachine:`${BASE_URL}/Production/DeleteMachine`,
UpdateMachine:`${BASE_URL}/Production/UpdateMachineDetails`,
GetLocation:`${BASE_URL}/Product/GetLocations`,
Machinenames:`${BASE_URL}/Product/GetMachineNames/`,
GetSONumber:`${BASE_URL}/Product/GetSONumbers`,
Machinenames:`${BASE_URL}/Product/GetMachineNames`,
MachineNumber:`${BASE_URL}/Product/GetMachineNumber`,
MachineDetails:`${BASE_URL}/Product/GetMachineDetails`,
OrderDetails:`${BASE_URL}/Product/GetSpecificOrderDetails`,
SaveExtruderTemp:`${BASE_URL}/PlantSettingPara/SaveExtruderTemp`,
UniqueItem:`${BASE_URL}/Product/GetUniqueItemNames`,
Grade:`${BASE_URL}/Product/GetGradesByItem`,
GetSONumber:`${BASE_URL}/Product/GetSONumbers`,
GetSpecificOrderDetails:`${BASE_URL}/Product/GetSpecificOrderDetails`,
};
