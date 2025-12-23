// // src/pages/MM/CreateManualPR.jsx
// import { useEffect, useState } from "react";
// import { Form, Row, Col, Button, Table, Alert, Spinner } from "react-bootstrap";
// import { API_ENDPOINTS } from "../../config/apiconfig";

// // ---------- helper functions ----------
// async function safeJson(result) {
//   if (result.status === "rejected") {
//     console.warn("Fetch rejected:", result.reason);
//     return null;
//   }

//   const res = result.value;
//   if (!res.ok) {
//     console.warn(`API failed (${res.status}): ${res.url}`);
//     return null;
//   }

//   const contentType = res.headers.get("content-type");
//   if (!contentType?.includes("application/json")) {
//     console.warn("Non-JSON response:", res.url);
//     return null;
//   }

//   try {
//     return await res.json();
//   } catch (error) {
//     console.warn("JSON parse failed:", res.url, error);
//     return null;
//   }
// }

// async function getPRMasters() {
//   try {
//     const [dRes, eRes, iRes, sRes, cRes, uRes, ReqRes] = await Promise.allSettled([
//       fetch(API_ENDPOINTS.Departments),
//       fetch(API_ENDPOINTS.PR_Employees),
//       fetch(API_ENDPOINTS.ItemList),
//       fetch(API_ENDPOINTS.PR_Specifications),
//       fetch(API_ENDPOINTS.PR_Currencies),
//       fetch(API_ENDPOINTS.PR_UOM),
//       fetch(API_ENDPOINTS.ReqRes),
//     ]);


//     const departments = await safeJson(dRes);
//     const employees = await safeJson(eRes);
//     const items = await safeJson(iRes);
//     const specs = await safeJson(sRes);
//     const currencies = await safeJson(cRes);
//     const uoms = await safeJson(uRes);
//     const requisitions = await safeJson(ReqRes);

//     return {
//       departments: departments || [],
//       employees: employees || [],
//       items: items || [],
//       specs: specs || [],
//       currencies: currencies || [],
//       uoms: uoms || [],
//       requisitions: requisitions || [],
//     };
//   } catch (error) {
//     console.error("getPRMasters failed:", error);
//     return {
//       departments: [],
//       employees: [],
//       items: [],
//       specs: [],
//       currencies: [],
//       uoms: [],
//       requisitions: [],
//     };
//   }
// }

// async function getDeptBudget(deptCode) {
//   try {
//     const res = await fetch(API_ENDPOINTS.PR_BudgetByDept(deptCode));
//     if (!res.ok) return {};
//     const contentType = res.headers.get("content-type");
//     if (!contentType?.includes("application/json")) return {};
//     return await res.json();
//   } catch {
//     return {};
//   }
// }

// async function getEmployee(empId) {
//   try {
//     const res = await fetch(API_ENDPOINTS.PR_EmployeeDetails(empId));
    
//     if (!res.ok) return {};
//     const contentType = res.headers.get("content-type");
//     if (!contentType?.includes("application/json")) return {};
//     return await res.json();
   
//   } catch {
//     return {};
//   }
// }


// async function getItem(itemId) {
//   try {
//     const res = await fetch(API_ENDPOINTS.PR_ItemDetails(itemId));
//     if (!res.ok) return {};
//     const contentType = res.headers.get("content-type");
//     if (!contentType?.includes("application/json")) return {};
//     return await res.json();
//   } catch {
//     return {};
//   }
// }

// async function saveCreateManualPR(payload) {
//   try {
//     const res = await fetch(API_ENDPOINTS.CreateManualPR, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     if (!res.ok) {
//       const errorText = await res.text();
//       throw new Error(`HTTP ${res.status}: ${errorText}`);
//     }

//     return await res.json();
//   } catch (error) {
//     console.error("Save failed:", error);
//     throw error;
//   }
// }

// // ---------- empty models ----------
// const emptyHeader = {
//   plantName: "",
//   plantLocation: "",
//   departmentId: "",       // will store selected departmentName
//   department_code: "",    // display department code for selected name
//   budgetAllocated: "",
//   budgetBalance: "",
//   searchEmployee: "",
//   employeeId: "",
//   employeeName: "",
//   employeeCode: "",
//   typeOfRequisition: "",
//   createdBy: "",
//   checkedBy: "",
//   approvedBy: "",
// };

// const emptyItem = {
//   id: "",
//   itemId: "",
//   itemName: "",
//   specificationId: "",
//   specificationName: "",
//   itemCode: "",
//   uom: "",
//   currency: "",
//   avgPrice: "",
//   requiredBy: "",
//   hsnCode: "",
//   qty: "",
//   value: "",
//   budgetAvailable: "",
// };

// // ---------- main component ----------
// export default function CreateManualPR() {
//   const [header, setHeader] = useState(emptyHeader);
//   const [currentItem, setCurrentItem] = useState(emptyItem);
//   const [items, setItems] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [submitLoading, setSubmitLoading] = useState(false);
//   const [error, setError] = useState("");

//   const [departments, setDepartments] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [masterItems, setMasterItems] = useState([]);
//   const [specs, setSpecs] = useState([]);
//   const [currencies, setCurrencies] = useState([]);
//   const [uoms, setUoms] = useState([]);
//   const [requisitions, setRequisitions] = useState([]);

//   // load masters
//   useEffect(() => {
//     getPRMasters()
//       .then((masters) => {
//         setDepartments(masters.departments || []);
//         setEmployees(masters.employees || []);
//         setMasterItems(masters.items || []);
//         setSpecs(masters.specs || []);
//         setCurrencies(masters.currencies || []);
//         setUoms(masters.uoms || []);
//         setRequisitions(masters.requisitions || []);
//         setError("");
//       })
//       .catch((err) => {
//         console.error("Masters load failed:", err);
//         setError("Failed to load master data. Some dropdowns may be empty.");
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   const onHeaderChange = async (e) => {
//     const { name, value } = e.target;
//     let updated = { ...header, [name]: value };

//     try {
//       // departmentId holds departmentName; find its code from departments list
//       if (name === "departmentId" && value) {
//         const dept = departments.find((d) => d.departmentName === value);

//         updated = {
//           ...updated,
//           department_code: dept?.department_code || "",
//         };

//         // if you need budget by department_code
//         if (dept?.department_code) {
//           const data = await getDeptBudget(dept.department_code);
//           updated = {
//             ...updated,
//             department_code: dept.department_code,
//             budgetAllocated: data.budgetAllocated || "",
//             budgetBalance: data.budgetBalance || "",
//           };
//         }
//       }

//       if (name === "employeeId" && value) {
//         const data = await getEmployee(value);
//         updated = {
//           ...updated,
//           employeeName: data.employeeName || "",
//           employeeCode: data.employeeCode || "",
//         };
//       }
//     } catch (err) {
//       console.error("Header fetch failed:", err);
//     }

//     setHeader(updated);
//   };

//   const onItemChange = async (e) => {
//     const { name, value } = e.target;
//     let updated = { ...currentItem, [name]: value };

//     try {
//       if (name === "itemId" && value) {
//         const data = await getItem(value);
//         updated = {
//           ...updated,
//           itemName: data.itemName || "",
//           itemCode: data.itemCode || "",
//           hsnCode: data.hsnCode || "",
//           uom: data.uom || updated.uom,
//           avgPrice: data.avgPrice || updated.avgPrice,
//         };
//       }
//     } catch (err) {
//       console.error("Item fetch failed:", err);
//     }

//     if (name === "qty" || name === "avgPrice") {
//       const qty = name === "qty" ? Number(value) || 0 : Number(currentItem.qty || 0);
//       const price =
//         name === "avgPrice" ? Number(value) || 0 : Number(currentItem.avgPrice || 0);
//       updated.value = (qty * price).toFixed(2);
//     }

//     setCurrentItem(updated);
//   };

//   const addItem = () => {
//     if (!currentItem.itemId || !currentItem.qty) {
//       alert("Please select item and enter quantity");
//       return;
//     }
//     setItems((prev) => [...prev, { ...currentItem, id: Date.now() }]);
//     setCurrentItem(emptyItem);
//   };

//   const removeItem = (id) => {
//     setItems((prev) => prev.filter((r) => r.id !== id));
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     if (!header.departmentId || items.length === 0) {
//       alert("Please fill required fields and add at least one item");
//       return;
//     }

//     try {
//       setSubmitLoading(true);
//       const payload = { ...header, items };
//       await saveCreateManualPR(payload);
//       alert("PR created successfully!");
//       onCancel();
//     } catch (err) {
//       alert("Failed to create PR: " + err.message);
//     } finally {
//       setSubmitLoading(false);
//     }
//   };

//   const onCancel = () => {
//     setHeader(emptyHeader);
//     setCurrentItem(emptyItem);
//     setItems([]);
//     setError("");
//   };

//   if (loading) {
//     return (
//       <div className="p-5 text-center">
//         <Spinner animation="border" role="status" className="me-2" />
//         <strong>Loading data...</strong>
//       </div>
//     );
//   }

//   return (
//     <div className="p-3">
//       <h3 className="mb-4">Create Manual Purchase Request</h3>
      
//       {error && (
//         <Alert variant="warning" className="mb-3">
//           {error}
//         </Alert>
//       )}

//       <Form onSubmit={onSubmit}>
//         {/* header row 1 */}
//         <Row className="mb-3">
//           <Col>
//             <Form.Group>
//               <Form.Label>Plant Name/No</Form.Label>
//               <Form.Control
//                 name="plantName"
//                 value={header.plantName}
//                 onChange={onHeaderChange}
//                 required
//               />
//             </Form.Group>
//           </Col>
//           <Col>
//             <Form.Group>
//               <Form.Label>Plant Location</Form.Label>
//               <Form.Control
//                 name="plantLocation"
//                 value={header.plantLocation}
//                 onChange={onHeaderChange}
//               />
//             </Form.Group>
//           </Col>
//           <Col>
//             <Form.Group>
//               <Form.Label>Department Name</Form.Label>
//               <Form.Select
//                 name="departmentId"
//                 value={header.departmentId}
//                 onChange={onHeaderChange}
//                 required
//               >
//                 <option value="">SELECT DEPARTMENT</option>
//                 {departments.map((d) => (
//                   <option key={d.id} value={d.departmentName}>
//                     {d.departmentName}
//                   </option>
//                 ))}
//               </Form.Select>
//             </Form.Group>
//           </Col>
//           <Col>
//             <Form.Group>
//               <Form.Label>Department Code</Form.Label>
//               <Form.Control
//                 name="department_code"
//                 value={header.department_code}
//                 disabled
//               />
//             </Form.Group>
//           </Col>
//           <Col>
//             <Form.Group>
//               <Form.Label>Budget Allocated</Form.Label>
//               <Form.Control
//                 name="budgetAllocated"
//                 value={header.budgetAllocated}
//                 disabled
//               />
//             </Form.Group>
//           </Col>
//         </Row>

//         {/* header row 2 */}
//         <Row className="mb-3">
//           <Col>
//             <Form.Group>
//               <Form.Label>Budget Balance</Form.Label>
//               <Form.Control
//                 name="budgetBalance"
//                 value={header.budgetBalance}
//                 disabled
//               />
//             </Form.Group>
//           </Col>
//           <Col>
//             <Form.Group>
//               <Form.Label>Search Employee</Form.Label>
//               <Form.Control
//                 name="searchEmployee"
//                 value={header.searchEmployee}
//                 onChange={onHeaderChange}
//                 placeholder="Search..."
//               />
//             </Form.Group>
//           </Col>
//           <Col>
//             <Form.Group>
//               <Form.Label>Employee Name</Form.Label>
//               <Form.Select
//                 name="employeeId"
//                 value={header.employeeId}
//                 onChange={onHeaderChange}
//               >
//                 <option value="">SELECT EMPLOYEE</option>
//                 {employees.map((e) => (
//                   <option key={e.id} value={e.id}>
//                     {e.name}
//                   </option>
//                 ))}
//               </Form.Select>
//             </Form.Group>
//           </Col>
//           <Col>
//             <Form.Group>
//               <Form.Label>Employee Code</Form.Label>
//               <Form.Control
//                 name="employeeCode"
//                 value={header.employeeCode}
//                 disabled
//               />
//             </Form.Group>
//           </Col>
//           <Col>
//             <Form.Group>
//               <Form.Label>Type Of Requisition</Form.Label>
//               <Form.Select
//                 name="typeOfRequisition"
//                 value={header.typeOfRequisition}
//                 onChange={onHeaderChange}
//               >
//                 <option value="">SELECT Requisition Type</option>
//                 {requisitions.map((r) => (
//                   <option key={r.id} value={r.id}>
//                     {r.name}
//                   </option>
//                 ))}
//               </Form.Select>
//             </Form.Group>
//           </Col>
//         </Row>

//         {/* item details section title */}
//         <div className="mb-3">
//           <h5>ITEM DETAILS</h5>
//         </div>

//         {/* item row 1: list + basic details */}
//         <Row className="mb-3">
//           <Col>
//             <Form.Group>
//               <Form.Label>Item Name</Form.Label>
//               <Form.Select
//                 name="itemId"
//                 value={currentItem.itemId}
//                 onChange={onItemChange}
//               >
//                 <option value="">SELECT ITEM NAME</option>
//                 {masterItems.map((i) => (
//                   <option key={i.id} value={i.id}>
//                     {i.name}
//                   </option>
//                 ))}
//               </Form.Select>
//             </Form.Group>
//           </Col>
//           <Col>
//             <Form.Group>
//               <Form.Label>Specification</Form.Label>
//               <Form.Select
//                 name="specificationId"
//                 value={currentItem.specificationId}
//                 onChange={onItemChange}
//               >
//                 <option value="">SELECT SPECIFICATION</option>
//                 {specs.map((s) => (
//                   <option key={s.id} value={s.id}>
//                     {s.name}
//                   </option>
//                 ))}
//               </Form.Select>
//             </Form.Group>
//           </Col>
//           <Col>
//             <Form.Group>
//               <Form.Label>Item Code</Form.Label>
//               <Form.Control
//                 name="itemCode"
//                 value={currentItem.itemCode}
//                 onChange={onItemChange}
//                 disabled
//               />
//             </Form.Group>
//           </Col>
//           <Col>
//             <Form.Group>
//               <Form.Label>UOM</Form.Label>
//               <Form.Control
//                 name="uom"
//                 value={currentItem.uom}
//                 onChange={onItemChange}
//                 disabled
//               >
              
//               </Form.Control>
//             </Form.Group>
//           </Col>
//           <Col>
//             <Form.Group>
//               <Form.Label>Currency</Form.Label>
//               <Form.Control
//                 name="currency"
//                 value={currentItem.currency}
//                 onChange={onItemChange}
//                 disabled
//               >
               
//               </Form.Control>
//             </Form.Group>
//           </Col>
//         </Row>

//         {/* item row 2: qty/pricing */}
//         <Row className="mb-3">
//           <Col>
//             <Form.Group>
//               <Form.Label>Average Price</Form.Label>
//               <Form.Control
//                 type="number"
//                 step="0.01"
//                 name="avgPrice"
//                 value={currentItem.avgPrice}
//                 onChange={onItemChange}
//                 disabled
//               />
//             </Form.Group>
//           </Col>
//           <Col>
//             <Form.Group>
//               <Form.Label>Required By</Form.Label>
//               <Form.Control
//                 type="date"
//                 name="requiredBy"
//                 value={currentItem.requiredBy}
//                 onChange={onItemChange}
//               />
//             </Form.Group>
//           </Col>
//           <Col>
//             <Form.Group>
//               <Form.Label>HSN Code</Form.Label>
//               <Form.Control
//                 name="hsnCode"
//                 value={currentItem.hsnCode}
//                 onChange={onItemChange}
//                 disabled
//               />
//             </Form.Group>
//           </Col>
//           <Col>
//             <Form.Group>
//               <Form.Label>Require Qty</Form.Label>
//               <Form.Control
//                 type="number"
//                 name="qty"
//                 value={currentItem.qty}
//                 onChange={onItemChange}
//               />
//             </Form.Group>
//           </Col>
//           <Col>
//             <Form.Group>
//               <Form.Label>Value</Form.Label>
//               <Form.Control
//                 name="value"
//                 value={currentItem.value}
//                 disabled
//               />
//             </Form.Group>
//           </Col>
//         </Row>

//         {/* item row 3: budget + footer names */}
//         <Row className="mb-3">
//           <Col>
//             <Form.Group>
//               <Form.Label>Budget Available</Form.Label>
//               <Form.Control
//                 name="budgetAvailable"
//                 value={currentItem.budgetAvailable}
//                 disabled
//               />
//             </Form.Group>
//           </Col>
//           <Col className="d-flex align-items-end">
//             <Button variant="success" onClick={addItem} className="w-100">
//               Add Item
//             </Button>
//           </Col>
//           <Col>
//             <Form.Group>
//               <Form.Label>Created By</Form.Label>
//               <Form.Control
//                 name="createdBy"
//                 value={header.createdBy}
//                 onChange={onHeaderChange}
//               />
//             </Form.Group>
//           </Col>
//           <Col>
//             <Form.Group>
//               <Form.Label>Checked By</Form.Label>
//               <Form.Control
//                 name="checkedBy"
//                 value={header.checkedBy}
//                 onChange={onHeaderChange}
//               />
//             </Form.Group>
//           </Col>
//           <Col>
//             <Form.Group>
//               <Form.Label>Approved By</Form.Label>
//               <Form.Control
//                 name="approvedBy"
//                 value={header.approvedBy}
//                 onChange={onHeaderChange}
//               />
//             </Form.Group>
//           </Col>
//         </Row>

//         {/* items table */}
//         {items.length > 0 && (
//           <Table striped bordered hover size="sm" className="mb-3">
//             <thead>
//               <tr>
//                 <th>Item Name</th>
//                 <th>Item Code</th>
//                 <th>Specification</th>
//                 <th>UOM</th>
//                 <th>Currency</th>
//                 <th>Avg Price</th>
//                 <th>HSN Code</th>
//                 <th>Qty</th>
//                 <th>Value</th>
//                 <th>Budget</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {items.map((r) => (
//                 <tr key={r.id}>
//                   <td>{r.itemName}</td>
//                   <td>{r.itemCode}</td>
//                   <td>{r.specificationName}</td>
//                   <td>{r.uom}</td>
//                   <td>{r.currency}</td>
//                   <td>{r.avgPrice}</td>
//                   <td>{r.hsnCode}</td>
//                   <td>{r.qty}</td>
//                   <td>{r.value}</td>
//                   <td>{r.budgetAvailable}</td>
//                   <td>
//                     <Button
//                       size="sm"
//                       variant="danger"
//                       onClick={() => removeItem(r.id)}
//                     >
//                       ×
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         )}

//         {/* footer buttons */}
//         <div className="text-center">
//           <Button
//             type="submit"
//             variant="success"
//             className="mx-2 px-4"
//             disabled={submitLoading}
//           >
//             {submitLoading ? (
//               <>
//                 <Spinner animation="border" size="sm" className="me-1" />
//                 Saving...
//               </>
//             ) : (
//               "Submit"
//             )}
//           </Button>
//           <Button
//             type="button"
//             variant="secondary"
//             className="mx-2 px-4"
//             onClick={onCancel}
//             disabled={submitLoading}
//           >
//             Cancel
//           </Button>
//         </div>
//       </Form>
//     </div>
//   );
// }


// src/pages/MM/CreateManualPR.jsx
import { useEffect, useState } from "react";
import { Form, Row, Col, Button, Table, Alert, Spinner } from "react-bootstrap";
import { API_ENDPOINTS } from "../../config/apiconfig";

// ---------- helper functions ----------
async function safeJson(result) {
  if (result.status === "rejected") {
    console.warn("Fetch rejected:", result.reason);
    return null;
  }
  const res = result.value;
  if (!res.ok) {
    console.warn(`API failed (${res.status}): ${res.url}`);
    return null;
  }
  const contentType = res.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    console.warn("Non-JSON response:", res.url);
    return null;
  }
  try {
    return await res.json();
  } catch (error) {
    console.warn("JSON parse failed:", res.url, error);
    return null;
  }
}

async function getPRMasters() {
  try {
    const [dRes, eRes, iRes, sRes, cRes, uRes, ReqRes] = await Promise.allSettled([
      fetch(API_ENDPOINTS.Departments),
      fetch(API_ENDPOINTS.PR_Employees),
      fetch(API_ENDPOINTS.ItemList),
      fetch(API_ENDPOINTS.PR_Specifications),
      fetch(API_ENDPOINTS.PR_Currencies),
      fetch(API_ENDPOINTS.PR_UOM),
      fetch(API_ENDPOINTS.ReqRes),
    ]);

    return {
      departments: (await safeJson(dRes)) || [],
      employees: (await safeJson(eRes)) || [],
      items: (await safeJson(iRes)) || [],
      specs: (await safeJson(sRes)) || [],
      currencies: (await safeJson(cRes)) || [],
      uoms: (await safeJson(uRes)) || [],
      requisitions: (await safeJson(ReqRes)) || [],
    };
  } catch (error) {
    console.error("getPRMasters failed:", error);
    return {};
  }
}

async function getDeptBudget(deptCode) {
  if (!deptCode) return {};
  try {
    const res = await fetch(API_ENDPOINTS.PR_BudgetByDept(deptCode));
    if (!res.ok) return {};
    return await res.json();
  } catch {
    return {};
  }
}

async function getEmployee(empId) {
  if (!empId) return {};
  try {
    const res = await fetch(API_ENDPOINTS.PR_EmployeeDetails(empId));
    if (!res.ok) return {};
    return await res.json();
  } catch {
    return {};
  }
}

async function getItem(itemId) {
  if (!itemId) return {};
  try {
    const res = await fetch(API_ENDPOINTS.PR_ItemDetails(itemId));
    if (!res.ok) return {};
    return await res.json();
  } catch {
    return {};
  }
}

async function saveCreateManualPR(payload) {
  const res = await fetch(API_ENDPOINTS.CreateManualPR, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`HTTP ${res.status}: ${errorText}`);
  }
  return await res.json();
}

// ---------- empty models ----------
const emptyHeader = {
  plantName: "",
  plantLocation: "",
  departmentId: "",      // This stores the Department Name (as per your code logic)
  department_code: "", 
  budgetAllocated: "",
  budgetBalance: "",
  employeeId: "",
  employeeName: "",
  employeeCode: "",
  typeOfRequisition: "",
  createdBy: "",
  checkedBy: "",
  approvedBy: "",
};

const emptyItem = {
  id: "",
  itemId: "",           // Item ID
  itemName: "",
  specificationId: "",  // Grade ID
  specificationName: "",
  itemCode: "",
  uom: "",
  currency: "",
  avgPrice: "",
  requiredBy: "",
  hsnCode: "",
  qty: "",
  value: "",
  budgetAvailable: "",
};

// ---------- main component ----------
export default function CreateManualPR() {
  const [header, setHeader] = useState(emptyHeader);
  const [currentItem, setCurrentItem] = useState(emptyItem);
  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");

  // Master Data State
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [masterItems, setMasterItems] = useState([]);
  const [specs, setSpecs] = useState([]);
  const [requisitions, setRequisitions] = useState([]);

  // Load masters on mount
  useEffect(() => {
    getPRMasters()
      .then((masters) => {
        setDepartments(masters.departments || []);
        setEmployees(masters.employees || []);
        setMasterItems(masters.items || []);
        setSpecs(masters.specs || []);
        setRequisitions(masters.requisitions || []);
      })
      .catch((err) => {
        console.error("Masters load failed:", err);
        setError("Failed to load master data.");
      })
      .finally(() => setLoading(false));
  }, []);

  // --- HEADER HANDLER (Department & Employee) ---
  const onHeaderChange = async (e) => {
    const { name, value } = e.target;
    let updated = { ...header, [name]: value };

    // 1. Handle Department Selection
    if (name === "departmentId") {
      // Find the full department object based on the selected Name
      const selectedDept = departments.find((d) => d.departmentName === value);
      
      if (selectedDept) {
        // Set Department Code immediately
        updated.department_code = selectedDept.department_code || "";
        
        // Fetch Budget using the Code
        if (selectedDept.department_code) {
          try {
            const budgetData = await getDeptBudget(selectedDept.department_code);
            updated.budgetAllocated = budgetData.budgetAllocated || "0.00";
            updated.budgetBalance = budgetData.budgetBalance || "0.00";
          } catch (err) {
            console.error("Budget fetch error", err);
          }
        }
      } else {
        // Reset if no department selected
        updated.department_code = "";
        updated.budgetAllocated = "";
        updated.budgetBalance = "";
      }
    }

    // 2. Handle Employee Selection
    if (name === "employeeId") {
      // Fetch Employee Details to get the Code
      if (value) {
        try {
          const empData = await getEmployee(value);
          updated.employeeName = empData.employeeName || "";
          updated.employeeCode = empData.employeeCode || "";
        } catch (err) {
          console.error("Employee fetch error", err);
        }
      } else {
        updated.employeeName = "";
        updated.employeeCode = "";
      }
    }

    setHeader(updated);
  };

  // --- ITEM HANDLER (Item, Grade, Auto-fill) ---
  const onItemChange = async (e) => {
    const { name, value } = e.target;
    let updated = { ...currentItem, [name]: value };

    // 1. Handle Item Selection
    if (name === "itemId") {
      // Find Item Name for display
      const selectedMasterItem = masterItems.find(i => i.id.toString() === value.toString());
      updated.itemName = selectedMasterItem ? selectedMasterItem.name : "";

      // Fetch Item Details (Item Code, UOM, Price, etc.)
      if (value) {
        try {
          const itemData = await getItem(value);
          
          updated.itemCode = itemData.itemCode || "";
          updated.hsnCode = itemData.hsnCode || "";
          updated.uom = itemData.uom || "";
          updated.currency = itemData.currency || "INR";
          updated.avgPrice = itemData.avgPrice || 0;
          updated.budgetAvailable = itemData.budgetAvailable || "0.00"; // Assuming API returns this
        } catch (err) {
          console.error("Item details fetch error", err);
        }
      } else {
        // Clear fields if item unselected
        updated.itemCode = "";
        updated.hsnCode = "";
        updated.uom = "";
        updated.avgPrice = "";
        updated.budgetAvailable = "";
      }
    }

    // 2. Handle Grade (Specification) Selection
    if (name === "specificationId") {
       const selectedSpec = specs.find(s => s.id.toString() === value.toString());
       updated.specificationName = selectedSpec ? selectedSpec.name : "";
    }

    // 3. Auto-Calculate Value (Qty * Price)
    // Runs when Qty changes OR when Item (AvgPrice) loads
    const qty = name === "qty" ? (parseFloat(value) || 0) : (parseFloat(updated.qty) || 0);
    const price = name === "avgPrice" ? (parseFloat(value) || 0) : (parseFloat(updated.avgPrice) || 0);
    
    updated.value = (qty * price).toFixed(2);

    setCurrentItem(updated);
  };

  const addItem = () => {
    if (!currentItem.itemId || !currentItem.qty) {
      alert("Please select item and enter quantity");
      return;
    }
    setItems((prev) => [...prev, { ...currentItem, id: Date.now() }]);
    setCurrentItem(emptyItem); // Reset form
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((r) => r.id !== id));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!header.departmentId || items.length === 0) {
      alert("Please fill required fields and add at least one item");
      return;
    }

    try {
      setSubmitLoading(true);
      const payload = { ...header, items };
      await saveCreateManualPR(payload);
      alert("PR created successfully!");
      onCancel();
    } catch (err) {
      alert("Failed to create PR: " + err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const onCancel = () => {
    setHeader(emptyHeader);
    setCurrentItem(emptyItem);
    setItems([]);
    setError("");
  };

  if (loading) {
    return (
      <div className="p-5 text-center">
        <Spinner animation="border" role="status" className="me-2" />
        <strong>Loading data...</strong>
      </div>
    );
  }

  return (
    <div className="p-3">
      <h3 className="mb-4">Create Manual Purchase Request</h3>
      
      {error && <Alert variant="warning" className="mb-3">{error}</Alert>}

      <Form onSubmit={onSubmit}>
        {/* Header Section */}
        <Row className="mb-3">
          <Col md={3}>
            <Form.Group>
              <Form.Label>Plant Name/No</Form.Label>
              <Form.Control name="plantName" value={header.plantName} onChange={onHeaderChange} required />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Plant Location</Form.Label>
              <Form.Control name="plantLocation" value={header.plantLocation} onChange={onHeaderChange} />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Department Name</Form.Label>
              <Form.Select name="departmentId" value={header.departmentId} onChange={onHeaderChange} required>
                <option value="">SELECT DEPARTMENT</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.departmentName}>{d.departmentName}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Department Code</Form.Label>
              <Form.Control value={header.department_code} disabled placeholder="Auto-filled" />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={3}>
            <Form.Group>
              <Form.Label>Budget Allocated</Form.Label>
              <Form.Control value={header.budgetAllocated} disabled placeholder="Auto-filled" />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Budget Balance</Form.Label>
              <Form.Control value={header.budgetBalance} disabled placeholder="Auto-filled" />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Employee Name</Form.Label>
              <Form.Select name="employeeId" value={header.employeeId} onChange={onHeaderChange}>
                <option value="">SELECT EMPLOYEE</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Employee Code</Form.Label>
              <Form.Control value={header.employeeCode} disabled placeholder="Auto-filled" />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
           <Col md={3}>
            <Form.Group>
              <Form.Label>Type Of Requisition</Form.Label>
              <Form.Select name="typeOfRequisition" value={header.typeOfRequisition} onChange={onHeaderChange}>
                <option value="">SELECT TYPE</option>
                {requisitions.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <hr />
        
        {/* Item Details Section */}
        <h5>ITEM DETAILS</h5>
        <Row className="mb-3">
          <Col md={3}>
            <Form.Group>
              <Form.Label>Item Name</Form.Label>
              <Form.Select name="itemId" value={currentItem.itemId} onChange={onItemChange}>
                <option value="">SELECT ITEM</option>
                {masterItems.map((i) => (
                  <option key={i.id} value={i.id}>{i.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Grade / Specification</Form.Label>
              <Form.Select name="specificationId" value={currentItem.specificationId} onChange={onItemChange}>
                <option value="">SELECT GRADE</option>
                {specs.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Item Code</Form.Label>
              <Form.Control value={currentItem.itemCode} disabled placeholder="Auto-filled" />
            </Form.Group>
          </Col>
          <Col md={3}>
             <Form.Group>
              <Form.Label>UOM</Form.Label>
              <Form.Control value={currentItem.uom} disabled />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={3}>
             <Form.Group>
              <Form.Label>Currency</Form.Label>
              <Form.Control value={currentItem.currency} disabled />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Average Price</Form.Label>
              <Form.Control value={currentItem.avgPrice} disabled />
            </Form.Group>
          </Col>
          <Col md={3}>
             <Form.Group>
              <Form.Label>HSN Code</Form.Label>
              <Form.Control value={currentItem.hsnCode} disabled />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Budget Available</Form.Label>
              <Form.Control value={currentItem.budgetAvailable} disabled />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={3}>
            <Form.Group>
              <Form.Label>Required By Date</Form.Label>
              <Form.Control type="date" name="requiredBy" value={currentItem.requiredBy} onChange={onItemChange} />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Required Qty</Form.Label>
              <Form.Control type="number" name="qty" value={currentItem.qty} onChange={onItemChange} />
            </Form.Group>
          </Col>
           <Col md={3}>
            <Form.Group>
              <Form.Label>Total Value</Form.Label>
              <Form.Control value={currentItem.value} disabled placeholder="Qty * Price" />
            </Form.Group>
          </Col>
           <Col md={3} className="d-flex align-items-end">
            <Button variant="success" onClick={addItem} className="w-100">Add Item</Button>
          </Col>
        </Row>

        {/* List of Added Items */}
        {items.length > 0 && (
          <Table striped bordered hover size="sm" className="mb-3 mt-4">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Grade</th>
                <th>Code</th>
                <th>UOM</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Value</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id}>
                  <td>{r.itemName}</td>
                  <td>{r.specificationName}</td>
                  <td>{r.itemCode}</td>
                  <td>{r.uom}</td>
                  <td>{r.avgPrice}</td>
                  <td>{r.qty}</td>
                  <td>{r.value}</td>
                  <td>
                    <Button size="sm" variant="danger" onClick={() => removeItem(r.id)}>Remove</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        <hr />
        
        {/* Footer Actions */}
        <Row className="mt-4 mb-5">
            <Col md={4}><Form.Control placeholder="Created By" name="createdBy" value={header.createdBy} onChange={onHeaderChange}/></Col>
            <Col md={4}><Form.Control placeholder="Checked By" name="checkedBy" value={header.checkedBy} onChange={onHeaderChange}/></Col>
            <Col md={4}><Form.Control placeholder="Approved By" name="approvedBy" value={header.approvedBy} onChange={onHeaderChange}/></Col>
        </Row>

        <div className="text-center pb-5">
          <Button type="submit" variant="success" className="mx-2 px-5" disabled={submitLoading}>
            {submitLoading ? "Saving..." : "Submit PR"}
          </Button>
          <Button variant="secondary" className="mx-2 px-5" onClick={onCancel}>Cancel</Button>
        </div>
      </Form>
    </div>
  );
}