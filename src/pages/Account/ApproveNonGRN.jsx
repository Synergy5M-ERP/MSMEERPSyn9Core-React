import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Eye } from "lucide-react";
import { API_ENDPOINTS } from "../../config/apiconfig";
import "./ApprovedPayable.css";

const ApproveNonGrn = () => {

const [type,setType] = useState("");
const [buyers,setBuyers] = useState([]);
const [selectedBuyer,setSelectedBuyer] = useState("");
const [grnData,setGrnData] = useState([]);
const [approveList,setApproveList] = useState([]);

const [showItemModal,setShowItemModal] = useState(false);
const [selectedItem,setSelectedItem] = useState(null);


/////////////////////////////////////////////////////////////
// GROUP BY INVOICE NUMBER
/////////////////////////////////////////////////////////////

const groupedInvoices = Object.values(
grnData.reduce((acc,item)=>{

const key = item.grN_NO;

if(!acc[key]){
acc[key] = {
invoiceNo:item.grN_NO,
invoiceDate:item.invoiceDate,
ledgerName:item.ledgerName,
description:item.description,
items:[]
};
}

acc[key].items.push(item);

return acc;

},{})

);


/////////////////////////////////////////////////////////////
// FETCH SELLERS
/////////////////////////////////////////////////////////////

const fetchSeller = async(type)=>{
try{

const res = await axios.get(API_ENDPOINTS.GetApproveSellerNonGrnSo,{
params:{type:type}
});

setBuyers(res.data.data || []);

}catch(err){
console.log(err);
Swal.fire("Error loading sellers");
}
};


/////////////////////////////////////////////////////////////
// FETCH GRN DETAILS
/////////////////////////////////////////////////////////////

const fetchGrnDetails = async(buyer)=>{

if(!buyer || !type) return;

try{

const res = await axios.get(API_ENDPOINTS.GetGrnInvoiceDetails,{
params:{
seller:buyer,
checkval:type
}
});

if(res.data.success){
setGrnData(res.data.grnDetails || []);
setApproveList([]);
}else{
setGrnData([]);
Swal.fire(res.data.message);
}

}catch(err){
console.log(err);
Swal.fire("Error fetching invoice details");
}

};


/////////////////////////////////////////////////////////////
// VIEW MODAL
/////////////////////////////////////////////////////////////

const handleView = (item)=>{
setSelectedItem(item);
setShowItemModal(true);
};


/////////////////////////////////////////////////////////////
// APPROVE CHECKBOX
/////////////////////////////////////////////////////////////

const handleApproveChange = (id,checked)=>{

setApproveList(prev => {

let updated = [...prev];

let exist = updated.find(x=>x.nonGrnInvoiceId === id);

if(exist){
exist.approveNonGRNInvoice = checked;
}else{
updated.push({
nonGrnInvoiceId:id,
approveNonGRNInvoice:checked
});
}

return updated;

});

};


/////////////////////////////////////////////////////////////
// SAVE APPROVAL
/////////////////////////////////////////////////////////////

const handleSave = async()=>{

if(approveList.length === 0){
Swal.fire("No Invoice selected");
return;
}

try{

const res = await axios.post(
API_ENDPOINTS.ApproveGrnInvoice,
approveList
);

if(res.data.success){
Swal.fire("Success",res.data.message,"success");
}else{
Swal.fire("Error",res.data.message,"error");
}

}catch(err){
console.log(err);
Swal.fire("Error saving approval");
}

};



/////////////////////////////////////////////////////////////
// UI
/////////////////////////////////////////////////////////////

return(

<div className="approved-payable-app">
<div className="container-fluid">


{/* TYPE + BUYER */}

<div className="row align-items-end mb-4">

  <div className="col-md-4">
    <label className="label-color">Select Type</label>
    <div className="d-flex gap-4">
      <div>
        <input
          type="radio"
          value="NonGRN"
          checked={type === "NonGRN"}
          onChange={(e) => {
            const val = e.target.value;
            setType(val);
            fetchSeller(val);
          }}
        /> NON GRN
      </div>
      <div>
        <input
          type="radio"
          value="NonSO"
          checked={type === "NonSO"}
          onChange={(e) => {
            setType(e.target.value);
            setSelectedBuyer("");
            setGrnData([]);
            fetchSeller(e.target.value);
          }}
        /> NON SALES
      </div>
    </div>
  </div>

  <div className="col-md-4">
    <label className="label-color">Select Buyer</label>
    <select
  className="select-field-style"
  value={selectedBuyer}
  onChange={(e) => {
    const buyer = e.target.value;
    setSelectedBuyer(buyer);
    fetchGrnDetails(buyer);
  }}
>
  <option value="">Choose Buyer...</option>

  {buyers.map((b) => (
    <option key={b.vendorId || b.VendorId} value={b.vendorId || b.VendorId}>
      {b.company_Name || b.vendorName}
    </option>
  ))}

</select>
  </div>

  {/* Conditional Save Button */}
  {grnData.length > 0 && (
    <div className="col-md-4 d-flex align-items-end justify-content-end">
      <button
        className="btn btn-primary"
        onClick={handleSave}
      >
        Save 
      </button>
    </div>
  )}

</div>

{/* ================= INVOICE CARDS ================= */}

{groupedInvoices.length > 0 && (

<div className="row g-3">

{groupedInvoices.map((inv,index)=>{

return(

<div key={index} className="col-md-6">

<div className="grn-card">

{/* HEADER */}

<div className="grn-header">

<div className="grn-header-row">

<div className="grn-header-left">
<div><strong>Invoice No:</strong> {inv.invoiceNo}</div>
<div><strong>Description:</strong> {inv.description}</div>
</div>

<div className="grn-header-right">
<div><strong>Date:</strong> {new Date(inv.invoiceDate).toLocaleDateString()}</div>
<div><strong>Ledger:</strong> {inv.ledgerName || "-"}</div>
</div>

</div>

</div>


{/* BODY */}

<div className="grn-body">

<table className="table table-bordered text-center mb-0">

<thead className="table-light">
<tr>
  <th>Description</th>
<th>Qty</th>
<th>Amount</th>
<th>Total</th>
<th>View</th>
</tr>
</thead>

<tbody>

{inv.items.map((item,i)=>{

const approved =
approveList.find(x=>x.nonGrnInvoiceId === item.nonGrnInvoiceId)?.approveNonGRNInvoice
?? item.approveNonGRNInvoice;

return(

<tr key={i}>
<td>{item.description}</td>
<td>{item.qty}</td>

<td>
₹ {(item.basicAmount || 0).toLocaleString("en-IN")}
</td>

<td className="fw-bold text-success">
₹ {(item.totalValue || 0).toLocaleString("en-IN")}
</td>

<td>

<button
className="btn btn-sm btn-outline-primary"
onClick={()=>handleView(item)}
>
<Eye size={16}/> 
</button>

</td>



</tr>

)

})}

</tbody>

</table>

</div>


{/* FOOTER */}

<div className="grn-footer">

<div>
<strong>Total Value</strong>

<div className="total-amount">
₹ {inv.items
.reduce((sum,x)=>sum+(x.totalValue || 0),0)
.toLocaleString("en-IN")}
</div>
</div>


{/* APPROVE ALL */}

<div className="approve-section">

<label>Bill Approve</label>

<input
type="checkbox"
className="form-check-input ms-2"

checked={
inv.items.every(item =>
approveList.find(x=>x.nonGrnInvoiceId===item.nonGrnInvoiceId)?.approveNonGRNInvoice
?? item.approveNonGRNInvoice
)
}

onChange={(e)=>{

inv.items.forEach(item => {

handleApproveChange(
item.nonGrnInvoiceId,
e.target.checked
);

});

}}

 />

</div>

</div>
</div>

</div>

)

})}

</div>

)}

{/* ================= ITEM DETAIL MODAL ================= */}
{showItemModal && selectedItem && (
  <div
    className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex align-items-center justify-content-center p-3"
    style={{ zIndex: 1060 }}
    onClick={() => setShowItemModal(false)}
  >
    <div
      className="bg-white rounded-4 shadow-lg border-0 animate__animated animate__fadeInUp"
      style={{
        width: "min(90vw, 700px)",
        maxHeight: "90vh",
        maxWidth: "700px",
        overflow: "hidden",
        marginTop: "65px",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div
        className="p-4 border-bottom d-flex justify-content-between align-items-center"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        }}
      >
        <div className="d-flex align-items-center">
          <Eye className="me-3" size={24} />
          <div>
            <h5 className="mb-0">{selectedItem.description || "Item Details"}</h5>
            <small>Complete item information</small>
          </div>
        </div>
        <button
          className="btn-close btn-close-white"
          onClick={() => setShowItemModal(false)}
          style={{ fontSize: "1.5rem" }}
        />
      </div>

      {/* Body */}
      <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
        <div className="row g-0">
          {/* Financial Details */}
          <div className="col-md-6 p-4 border-end">
            <h6 className="fw-bold text-primary mb-4 text-center pb-2 border-bottom">
              💰 Financial Details
            </h6>

            <div className="metric-card mb-3 p-3 bg-light rounded-3">
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted small">Total Tax Value</span>
                <span className="fw-bold text-danger">
                  ₹{(selectedItem.totalTaxValue || 0).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="metric-card mb-3 p-3 bg-light rounded-3">
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted small">Total Net Value</span>
                <span className="fw-bold text-info">
                  ₹{(selectedItem.netAmount || 0).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            
          </div>

          {/* Item Details */}
          <div className="col-md-6 p-4">
            <div className="table-responsive">
              <table className="table table-borderless table-sm">
                <tbody>
                  <tr>
                    <th className="text-muted small w-50">Description</th>
                    <td className="fw-semibold">{selectedItem.description || "N/A"}</td>
                  </tr>
                  <tr>
                    <th className="text-muted small w-50">Qty</th>
                    <td className="fw-semibold">{selectedItem.qty || 0}</td>
                  </tr>
                   <tr>
                    <th className="text-muted small w-50"> BasicAmt</th>
                    <td className="fw-semibold">₹{(selectedItem.basicAmount || 0).toLocaleString("en-IN")}</td>
                  </tr> <tr>
                    <th className="text-muted small w-50">Totalitemvalue</th>
                    <td className="fw-semibold"> ₹{(selectedItem.totalValue || 0).toLocaleString("en-IN")}</td>
                  </tr>
                  <tr>
                    <th className="text-muted small w-50">Ledger Name</th>
                    <td className="fw-semibold">{selectedItem.ledgerName || "N/A"}</td>
                  </tr>
                  <tr>
                    <th className="text-muted small w-50">Invoice No</th>
                    <td className="fw-semibold">{selectedItem.invoiceNo || "N/A"}</td>
                  </tr>
                  <tr>
                    <th className="text-muted small w-50">Approved</th>
                    <td className={`fw-bold ${selectedItem.approveNonGRNInvoice ? "text-success" : "text-warning"}`}>
                      {selectedItem.approveNonGRNInvoice ? "APPROVED" : "PENDING"}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Tax Breakdown */}
              <h6 className="fw-bold text-warning mt-4 mb-3">Tax Breakdown</h6>
              <div className="row g-2 text-center">
                <div className="col-4">
                  <small className="text-muted">CGST</small>
                  <div className="fw-semibold text-success">{(selectedItem.cgst || 0).toFixed(2)}%</div>
                </div>
                <div className="col-4">
                  <small className="text-muted">SGST</small>
                  <div className="fw-semibold text-success">{(selectedItem.sgst || 0).toFixed(2)}%</div>
                </div>
                <div className="col-4">
                  <small className="text-muted">IGST</small>
                  <div className="fw-semibold text-success">{(selectedItem.igst || 0).toFixed(2)}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="p-4 bg-gradient border-top d-flex justify-content-between align-items-center"
          style={{ background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)" }}
        >
          <div className="text-muted small">
            Total Value: <strong>₹{(selectedItem.totalValue || 0).toLocaleString("en-IN")}</strong>
          </div>
          <span
            className={`badge fs-5 px-4 py-2 fw-bold ${
              selectedItem.approveNonGRNInvoice ? "bg-success shadow-lg" : "bg-warning shadow-lg border"
            }`}
          >
            {selectedItem.approveNonGRNInvoice ? "✅ APPROVED" : "⏳ PENDING"}
          </span>
        </div>
      </div>
    </div>
  </div>
)}

</div>
</div>

);

};

export default ApproveNonGrn;