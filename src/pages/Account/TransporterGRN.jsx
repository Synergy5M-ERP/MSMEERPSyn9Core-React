import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Select, { components } from "react-select";
import { API_ENDPOINTS } from "../../config/apiconfig";

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
});
const TransporterGRN = () => {
    // 1. Core State
     
    const [formData, setFormData] = useState({
        VendorId: "",
        TransporterInvoiceNo: "",
        InvoiceDate: new Date().toISOString().split('T')[0],
        Price: 0,
        Qty: 0,
        TaxType: "", 
        IGSTRate: 0,
        SGSTRate: 0,
        CGSTRate: 0,
        Payment_Due_Date: new Date().toISOString().split('T')[0],
    CheckTransportation: false,   // ✅ ADD THIS
    ledgerIds: []   // ✅ replace ledgerId
    });
       const [ledgers, setLedgers] = useState([]);
const [transporters, setTransporters] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
const ledgerOptions = ledgers.map(l => ({
  value: l.accountLedgerId,
  label: l.accountLedgerName
}));

    const [totals, setTotals] = useState({
        NetAmount: "0.00",
        IGSTAmount: "0.00",
        SGSTAmount: "0.00",
        CGSTAmount: "0.00",
        TotalTax: "0.00",
        GrandTotal: "0.00"
    });

    
useEffect(() => {
  if (ledgers.length > 0) {
    const defaultLedgers = ledgers
      .filter(l =>
        l.accountLedgerName.toLowerCase().includes("igst") ||
        l.accountLedgerName.toLowerCase().includes("cgst") ||
        l.accountLedgerName.toLowerCase().includes("sgst")
      )
      .map(l => l.accountLedgerId);

    setFormData(prev => ({
      ...prev,
      ledgerIds: defaultLedgers
    }));
  }
}, [ledgers]);
    // ✅ FIXED: Better date formatting to handle "12-02-2026" or "/Date()/"
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        
        // If it's the C# format /Date(123...)/
        if (typeof dateStr === 'string' && dateStr.includes("/Date")) {
            const timestamp = parseInt(dateStr.replace(/\D/g, ""));
            return new Date(timestamp).toLocaleDateString();
        }
        
        // If it's a standard string like "12-02-2026"
        return dateStr; 
    };
const Option = (props) => {
  return (
    <components.Option {...props}>
      <input
        type="checkbox"
        checked={props.isSelected}
        onChange={() => null}
        style={{ marginRight: "8px" }}
      />
      {props.label}
    </components.Option>
  );
};
    // 2. Fetch Initial Data
    useEffect(() => {
        const init = async () => {
            try {
                const [transRes, ledgerRes] = await Promise.all([
                    axios.get(API_ENDPOINTS.GetTransporter),
                    axios.get(API_ENDPOINTS.GetLedger)
                ]);
                setTransporters(transRes.data.data || []);
                setLedgers(ledgerRes.data.data || ledgerRes.data || []);
            } catch (err) {
                console.error("Initialization Error", err);
Toast.fire({
    icon: "error",
    title: "Could not load initial setup data"
});            }
        };
        init();
    }, []);
const handleLedgerToggle = (id) => {
    setFormData(prev => ({
        ...prev,
        ledgerIds: prev.ledgerIds.includes(id)
            ? prev.ledgerIds.filter(l => l !== id)   // remove
            : [...prev.ledgerIds, id]                // add
    }));
};
    // 3. Calculation Logic
    useEffect(() => {
        const basicAmt = parseFloat(formData.Price) || 0;
        const qty = parseFloat(formData.Qty) || 0;
        const net = basicAmt * qty;

        let igst = 0, sgst = 0, cgst = 0;

        if (formData.TaxType === "IGST") {
            igst = (net * (parseFloat(formData.IGSTRate) || 0)) / 100;
        } else if (formData.TaxType === "CGST_SGST") {
            sgst = (net * (parseFloat(formData.SGSTRate) || 0)) / 100;
            cgst = (net * (parseFloat(formData.CGSTRate) || 0)) / 100;
        }

        const totalTax = igst + sgst + cgst;
        const grand = net + totalTax;

        setTotals({
            NetAmount: net.toFixed(2),
            IGSTAmount: igst.toFixed(2),
            SGSTAmount: sgst.toFixed(2),
            CGSTAmount: cgst.toFixed(2),
            TotalTax: totalTax.toFixed(2),
            GrandTotal: grand.toFixed(2)
        });
    }, [formData.Price, formData.Qty, formData.TaxType, formData.IGSTRate, formData.SGSTRate, formData.CGSTRate]);

    // 4. Handlers
   const handleTransporterChange = async (name) => {
        setFormData(prev => ({ ...prev, VendorId: name }));
        setSelectedRows([]); 
        if (!name) { setTableData([]); return; }
        
        try {
            const res = await axios.get(`${API_ENDPOINTS.GetTransporterDetails}?transporter=${encodeURIComponent(name)}`);
            // Set data from res.data.data as per your JSON structure
            setTableData(res.data.data || []);
        } catch (err) {
Toast.fire({
    icon: "error",
    title: "Failed to load transporter GRN details"
});        }
    };

    const toggleRow = (id) => {
        setSelectedRows(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };
const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedRows.length === 0) {
        return Toast.fire({
    icon: "warning",
    title: "Please select at least one LR"
});
    }
        const firstRow = tableData.find(r => r.grnId === selectedRows[0]);

  const headerDate = firstRow?.date
        ? (typeof firstRow.date === "string" && firstRow.date.includes("/Date")
            ? new Date(parseInt(firstRow.date.replace(/\D/g, ""))).toISOString()
            : new Date(firstRow.date).toISOString())
        : null;
 const payload = {
    TransporterInvoiceNo: formData.TransporterInvoiceNo,
    InvoiceDate: formData.InvoiceDate,
            Date: headerDate,

    Qty: formData.Qty,
    Price: formData.Price,

    NetAmount: parseFloat(totals.NetAmount),
    TaxAmount: parseFloat(totals.TotalTax),
    TotalAmount: parseFloat(totals.GrandTotal),

    IGSTAmount: parseFloat(totals.IGSTAmount),
    SGSTAmount: parseFloat(totals.SGSTAmount),
    CGSTAmount: parseFloat(totals.CGSTAmount),
    CheckTransportation: formData.CheckTransportation,

    Payment_Due_Date: formData.Payment_Due_Date,

    // ✅ FIXES
LedgerIds: formData.ledgerIds.map(id => parseInt(id)),   SellerName: formData.VendorId,
 // ✅ MUST SEND THIS
       // ✅ THIS IS THE MAIN FIX
    Details: selectedRows.map(id => {
        const row = tableData.find(r => r.grnId === id);
        return {
            GRNId: id,
            LRNo: row?.lrNo,
        IsLRPass: true   // ✅ THIS IS REQUIRED

    
        };
    })
};
   try {
    const res = await axios.post(API_ENDPOINTS.SaveTransportrationGRN, payload);
 if (res.data?.success) {
        Toast.fire({
            icon: 'success',
            title: res.data.message || 'Saved successfully'
        });

        // ✅ ADD RESET CODE HERE (AFTER SUCCESS)
        setSelectedRows([]);
        setTableData([]);
        setFormData({
            VendorId: "",
            TransporterInvoiceNo: "",
            InvoiceDate: new Date().toISOString().split('T')[0],
            Price: 0,
            Qty: 0,
            TaxType: "",
            IGSTRate: 0,
            SGSTRate: 0,
            CGSTRate: 0,
            Payment_Due_Date: new Date().toISOString().split('T')[0],
            CheckTransportation: false,
            ledgerIds: []
        });

    } else {
        Toast.fire({
            icon: 'error',
            title: res.data?.message || 'Save failed'
        });
    }

} catch (err) {
    Toast.fire({
        icon: 'error',
        title: 'API Failed'
    });
}

};

    return (
        <div className="main-content" style={{ padding: '20px' }}>
            <div className="custm-card" style={{ background: '#fff', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <h4 style={{ marginBottom: '20px', color: '#333' }}>Transporter GRN Entry</h4>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        
                        <div>
                            <label style={{ fontWeight: '600', display: 'block', marginBottom: '5px' }}>Vendor Name</label>
                            <select className="form-control" value={formData.VendorId} onChange={(e) => handleTransporterChange(e.target.value)} required>
                                <option value="">Select Vendor</option>
                                {transporters.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>

                       <div>
                            <label style={{ fontWeight: '600', display: 'block', marginBottom: '5px' }}>Transporter Invoice No</label>
                            <input type="text" className="form-control" value={formData.TransporterInvoiceNo} onChange={(e) => setFormData({...formData, TransporterInvoiceNo: e.target.value})} />
                        </div>
                        <div>
                           <label style={{ fontWeight: '600', display: 'block', marginBottom: '5px' }}>Invoice Date</label>
                            <input type="date" className="form-control" value={formData.InvoiceDate} onChange={(e) => setFormData({...formData, InvoiceDate: e.target.value})} />
                        </div>

                        <div>
                            <label style={{ fontWeight: '600', display: 'block', marginBottom: '5px' }}>Price (Rate)</label>
                            <input type="number" step="0.01" className="form-control" value={formData.Price} onChange={(e) => setFormData({...formData, Price: e.target.value})} />
                        </div>

                        <div>
                            <label style={{ fontWeight: '600', display: 'block', marginBottom: '5px' }}>Qty</label>
                            <input type="number" className="form-control" value={formData.Qty} onChange={(e) => setFormData({...formData, Qty: e.target.value})} />
                        </div>

                        <div>
                            <label style={{ fontWeight: '600', display: 'block', marginBottom: '5px' }}>Tax Type</label>
                            <select className="form-control" value={formData.TaxType} onChange={(e) => setFormData({...formData, TaxType: e.target.value})}>
                                <option value="">Select Tax</option>
                                <option value="IGST">IGST</option>
                                <option value="CGST_SGST">CGST & SGST</option>
                            </select>
                        </div>

                        {formData.TaxType === "IGST" && (
                            <div>
                                <label style={{ fontWeight: '600', display: 'block', marginBottom: '5px' }}>IGST %</label>
                                <select className="form-control" value={formData.IGSTRate} onChange={(e) => setFormData({...formData, IGSTRate: e.target.value})}>
                                    <option value="0">0%</option>
                                    <option value="5">5%</option>
                                    <option value="12">12%</option>
                                    <option value="18">18%</option>
                                </select>
                            </div>
                        )}

                        {formData.TaxType === "CGST_SGST" && (
                            <>
                                <div>
                                    <label style={{ fontWeight: '600', display: 'block', marginBottom: '5px' }}>SGST %</label>
                                    <select className="form-control" value={formData.SGSTRate} onChange={(e) => setFormData({...formData, SGSTRate: e.target.value})}>
                                        <option value="0">0%</option>
                                        <option value="2.5">2.5%</option>
                                        <option value="9">9%</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontWeight: '600', display: 'block', marginBottom: '5px' }}>CGST %</label>
                                    <select className="form-control" value={formData.CGSTRate} onChange={(e) => setFormData({...formData, CGSTRate: e.target.value})}>
                                        <option value="0">0%</option>
                                        <option value="2.5">2.5%</option>
                                        <option value="9">9%</option>
                                    </select>
                                </div>
                            </>
                        )}

                        <div>
 

   <div>
  <label style={{ fontWeight: '600', marginBottom: '5px' }}>
    Select Ledgers
  </label>

  <Select
    options={ledgerOptions}
    isMulti
    closeMenuOnSelect={false}
    hideSelectedOptions={false}
    components={{ Option }}
    placeholder="Select Ledger"
    
    value={ledgerOptions.filter(l =>
      formData.ledgerIds.includes(l.value)
    )}

    onChange={(selected) => {
      const values = selected ? selected.map(s => s.value) : [];

      setFormData(prev => ({
        ...prev,
        ledgerIds: values   // ✅ array store
      }));
    }}

    styles={{
      menu: (provided) => ({
        ...provided,
        zIndex: 9999
      })
    }}
  />
</div>
</div>
                        <div>
                           <label style={{ fontWeight: '600', display: 'block', marginBottom: '5px' }}>Payment Due Date</label>
                            <input type="date" className="form-control" value={formData.Payment_Due_Date} onChange={(e) => setFormData({...formData, Payment_Due_Date: e.target.value})} />
                        </div>
                    </div>

                    {/* Summary Display */}
                    <div style={{ marginTop: '25px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px', padding: '15px', background: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '8px' }}>
                        <div><small>Net Amount</small><br/><strong>{totals.NetAmount}</strong></div>
                        <div><small>IGST</small><br/><strong>{totals.IGSTAmount}</strong></div>
                        <div><small>SGST</small><br/><strong>{totals.SGSTAmount}</strong></div>
                        <div><small>CGST</small><br/><strong>{totals.CGSTAmount}</strong></div>
                        <div><small>Total Tax</small><br/><strong>{totals.TotalTax}</strong></div>
                        <div><small>Grand Total</small><br/><strong style={{ color: '#007bff', fontSize: '1.1em' }}>{totals.GrandTotal}</strong></div>
                    </div>

                    {/* Table Section */}
                    <div style={{ marginTop: '30px' }}>
                        <h5 style={{ marginBottom: '15px' }}>Pending LRs for {formData.VendorId || '...'}</h5>
                        <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #eee' }}>
                            <table className="table table-hover" style={{ width: '100%', marginBottom: 0 }}>
                                <thead style={{ position: 'sticky', top: 0, background: '#eee', zIndex: 1 }}>
                                    <tr>
                                        <th>Select</th>
                                        <th>LR No</th>
                                        <th>Date</th>
                                        <th>Seller Name</th>
                                        <th>Vehicle No</th>
                                    </tr>
                                </thead>
                              <tbody>
                                    {tableData.length > 0 ? (
                                        tableData.map((item, index) => (
                                            // Changed to grnId, lrNo, etc.
                                            <tr key={item.grnId || index} onClick={() => toggleRow(item.grnId)} style={{ cursor: 'pointer' }}>
                                                <td>
                                                    <input 
                                                        type="checkbox" 
                                                        checked={selectedRows.includes(item.grnId)} 
                                                        onChange={() => {}} 
                                                    />
                                                </td>
                                                <td>{item.lrNo}</td>
                                                <td>{formatDate(item.date)}</td>
                                                <td>{item.supplierName}</td>
                                                <td>{item.vehicleNo}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="5" className="text-center">No data found</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div style={{ marginTop: '25px', borderTop: '1px solid #eee', paddingTop: '20px', textAlign: 'center' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ cursor: 'pointer', fontSize: '15px' }}>
                            <input 
    type="checkbox"
    checked={formData.CheckTransportation || false}
    onChange={(e) => setFormData({
        ...formData,
        CheckTransportation: e.target.checked
    })}
/>
                                I verify and approve this bill for payment
                            </label>
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg" style={{ minWidth: '250px' }}>
                            Save Transporter Bill
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransporterGRN;