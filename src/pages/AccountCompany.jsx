import React, { useState, useEffect } from 'react';
import { Eye, Save, Trash2, Loader2 } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { API_ENDPOINTS } from "../config/apiconfig"

function AccountCompany() {
  const [CompanyName, setCompanyName] = useState('');
  const [StartDate, setStartDate] = useState('');
  const [EndDate, setEndDate] = useState('');
  const [Address, setAddress] = useState('');
  const [PhoneNo, setPhoneNo] = useState('');
  const [Email, setEmail] = useState('');
  const [Logo, setLogo] = useState('');
  const [Companys, setCompanys] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [errors, setErrors] = useState({ phone: '', email: '' });

const phoneRegex = /^(?:\+91|0)?[6-9]\d{9}$/;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    fetchCompanys();
  }, []);

  const fetchCompanys = async () => {
    setFetchLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.Comapny}/Company-names`);
      if (!response.ok) throw new Error('Failed to fetch Companys');
      const { data } = await response.json();
      setCompanys(data || []);
    } catch (error) {
      toast.error(`Fetch Error: ${error.message}`);
    } finally {
      setFetchLoading(false);
    }
  };

  const validateFields = () => {
    let isValid = true;
    const newErrors = { phone: '', email: '' };

    if (!phoneRegex.test(PhoneNo)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number.';
      isValid = false;
    }
    if (!emailRegex.test(Email)) {
      newErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }
    if (!CompanyName.trim() || !StartDate.trim() || !EndDate.trim() || !Address.trim() || !Logo) {
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateFields()) {
      toast.error('Please fill all fields correctly before saving!');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        CompanyName: CompanyName.trim(),
        StartDate: StartDate.trim(),
        EndDate: EndDate.trim(),
        Address: Address.trim(),
        PhoneNo: PhoneNo.trim(),
        Email: Email.trim(),
        Logo,
      };

      let response;
      if (editingId) {
        response = await fetch(`${API_ENDPOINTS.Comapny}/Company-types/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(`${API_ENDPOINTS.Comapny}/Company-types`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) throw new Error(await response.text());

      const result = await response.json();
      if (result.success) {
        toast.success(editingId ? 'Company updated successfully!' : 'Company added successfully!');
        await fetchCompanys();
        handleCancel();
      } else {
        throw new Error(result.message || 'API Error');
      }
    } catch (error) {
      toast.error(`Save Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setCompanyName('');
    setStartDate('');
    setEndDate('');
    setAddress('');
    setPhoneNo('');
    setEmail('');
    setLogo('');
    setEditingId(null);
    setErrors({ phone: '', email: '' });
    toast.info('Action canceled');
  };

  const handleEdit = (Company) => {
    setCompanyName(Company.CompanyName);
    setStartDate(Company.StartDate);
    setEndDate(Company.EndDate);
    setAddress(Company.Address);
    setPhoneNo(Company.PhoneNo);
    setEmail(Company.Email);
    setLogo(Company.Logo);
    setEditingId(Company.id);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Delete this Company?',
      html: '<small class="text-danger">This action cannot be undone.</small>',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      reverseButtons: true,
      focusCancel: true,
      backdrop: true,
    });

    if (!confirm.isConfirmed) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.Comapny}/Company-types/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(await response.text());

      const result = await response.json();
      if (result.success) {
        setCompanys(Companys.filter(acc => acc.id !== id));
        await Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Company removed successfully.', timer: 1500, showConfirmButton: false });
      } else {
        throw new Error(result.message || 'Delete failed');
      }
    } catch (error) {
      Swal.fire('Error', `Delete Error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

 // Loading Spinner Component
const LoadingSpinner = () => (
  <div
    className="d-flex justify-content-center align-items-center"
    style={{
      height: "100vh",
      width: "100vw",
      position: "fixed",
      top: 0,
      left: 0,
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      zIndex: 2000,
    }}
  >
    <div className="text-center">
      <div className="custom-ring-loader"></div>
      <p className="mt-2 fw-semibold text-dark">Loading...</p>
    </div>
    {/* Inline styles or place below CSS in your stylesheet */}
    <style>
      {`
        .custom-ring-loader {
          display: inline-block;
          width: 64px;
          height: 64px;
        }
        .custom-ring-loader:after {
          content: " ";
          display: block;
          width: 48px;
          height: 48px;
          margin: 8px;
          border-radius: 50%;
          border: 6px solid #007bff;
          border-color: #007bff transparent #007bff transparent;
          animation: ring-spin 1.2s linear infinite;
        }
        @keyframes ring-spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
      `}
    </style>
  </div>
);


  if (fetchLoading) return <LoadingSpinner />;

  const isSaveDisabled = !CompanyName.trim() || !StartDate.trim() || !EndDate.trim() || !Address.trim() || !PhoneNo.trim() || !Email.trim() || !Logo || errors.phone || errors.email;

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', padding: '20px' }}>
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="container-fluid">
          <div style={{ padding: '5px 5px', borderRadius: '5px' }}>
          <h4 style={{ color: '#0066cc', margin: '15px', fontSize: '30px', fontWeight: '600' }}>Create Company</h4>
        </div>

        <div className="row">
          {/* Left Form Column */}
          <div className="col-lg-5 mb-4">
            <div style={{ background: 'white', padding: '25px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              {/* Company Name */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ textAlign:'left', display: 'block', color: '#0066cc', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                  Company Name  <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="text" value={CompanyName} onChange={e => setCompanyName(e.target.value)} disabled={loading} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '18px' }} />
              </div>

              {/* Dates */}
              <div className='row'>
                <div className='col-5 m-2 p-2'>
                  <label style={{textAlign:'left', display: 'block', color: '#0066cc', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>StartDate <span style={{ color: 'red' }}>*</span></label>
                  <input type='date' value={StartDate} onChange={e => setStartDate(e.target.value)} disabled={loading} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '18px' }} />
                </div>
                <div className='col-5 m-2 p-2'>
                  <label style={{textAlign:'left', display: 'block', color: '#0066cc', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>EndDate <span style={{ color: 'red' }}>*</span></label>
                  <input type='date' value={EndDate} onChange={e => setEndDate(e.target.value)} disabled={loading} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '18px' }} />
                </div>
              </div>

              {/* Address */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{textAlign:'left', display: 'block', color: '#0066cc', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Address <span style={{ color: 'red' }}>*</span></label>
                <textarea value={Address} onChange={e => setAddress(e.target.value)} rows="3" disabled={loading} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '18px' }} />
              </div>

              {/* Phone & Email */}
              <div className="row" style={{marginBottom: '20px' }}>
                <div className="col-6">
                  <label style={{textAlign:'left', display: 'block', color: '#0066cc', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Phone No:<span style={{ color: 'red' }}>*</span></label>
                  <input type="text" value={PhoneNo} onChange={e => { setPhoneNo(e.target.value); validateFields(); }} disabled={loading} style={{ width: '100%', padding: '10px', border: errors.phone ? '1px solid red' : '1px solid #ddd', borderRadius: '4px', fontSize: '18px' }} />
                  {errors.phone && <span style={{ color: 'red', fontSize: '14px' }}>{errors.phone}</span>}
                </div>
                <div className="col-6">
                  <label style={{textAlign:'left', display: 'block', color: '#0066cc', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Email:<span style={{ color: 'red' }}>*</span></label>
                  <input type="text" value={Email} onChange={e => { setEmail(e.target.value); validateFields(); }} disabled={loading} style={{ width: '100%', padding: '10px', border: errors.email ? '1px solid red' : '1px solid #ddd', borderRadius: '4px', fontSize: '18px' }} />
                  {errors.email && <span style={{ color: 'red', fontSize: '14px' }}>{errors.email}</span>}
                </div>
              </div>

           {/* Logo */}
<div style={{ marginBottom: '20px' }}>
  <label style={{textAlign:'left',display: 'block', color: '#0066cc', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
    Logo:<span style={{ color: 'red' }}>*</span>
  </label>
<div className='row'> 
<div className='col-8'> 
  
  <input
    type="file"
    accept="image/*"
    onChange={e => setLogo(e.target.files[0] || null)} // store the file object
    disabled={loading}
    style={{ width: '100%', padding: '10px', border: '2px dashed #0066cc', borderRadius: '10px', cursor: 'pointer' }}
  />
  </div>
<div className='col-2'> {/* Preview */}
  {Logo && typeof Logo !== 'string' && (
    <div style={{ marginBottom: '10px' }}>
      <img
        src={URL.createObjectURL(Logo)}
        alt="Logo Preview"
        style={{ width: '100px', height: '100px', objectFit: 'contain', border: '1px solid #ddd', borderRadius: '5px' }}
      />
    </div>
  )}

  
  </div>
</div>

 
</div>


              {/* Buttons */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleSave} disabled={loading || isSaveDisabled} style={{ width: '120px', fontSize: '18px', padding: '10px 15px', background: loading || isSaveDisabled ? '#ccc' : '#0066cc', color: 'white', border: 'none', borderRadius: '4px', display: 'flex', alignItems: 'left', justifyContent: 'left', gap: '8px' }}>
                  {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  {editingId ? 'Update' : 'Save'}
                </button>
                <button onClick={handleCancel} disabled={loading} style={{ width: '120px', fontSize: '18px', padding: '10px 15px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>Cancel</button>
              </div>
            </div>
          </div>

          {/* Right Table Column */}
          <div className="col-lg-7 mb-4">
            <div style={{ background: 'white', padding: '25px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <div style={{ overflowX: 'auto' }}>
                {loading && <LoadingSpinner />}
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #0066cc' }}>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#0066cc', fontSize: '18px', fontWeight: '600' }}>CompanyName</th>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#0066cc', fontSize: '18px', fontWeight: '600' }}>StartDate</th>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#0066cc', fontSize: '18px', fontWeight: '600' }}>EndDate</th>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#0066cc', fontSize: '18px', fontWeight: '600' }}>Edit</th>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#0066cc', fontSize: '18px', fontWeight: '600' }}>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Companys.map((Company) => (
                      <tr key={Company.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ fontSize: '14px', color: 'black', textAlign: 'left', padding: '12px' }}>{Company.CompanyName}</td>
                        <td style={{ fontSize: '14px', color: '#666', textAlign: 'left', padding: '12px' }}>{Company.StartDate}</td>
                        <td style={{ fontSize: '14px', color: '#666', textAlign: 'left', padding: '12px' }}>{Company.EndDate}</td>
                        <td style={{ padding: '12px', display: 'flex', gap: '8px' }}>
                          <button onClick={() => handleEdit(Company)} disabled={loading} style={{ padding: '6px 12px', background: '#0066cc', color: 'white', borderRadius: '4px', display: 'flex', alignItems: 'left', gap: '4px' }}>
                            <Eye size={14} /> Edit
                          </button>
                          <button onClick={() => handleDelete(Company.id)} disabled={loading} style={{ padding: '6px 12px', background: '#dc3545', color: 'white', borderRadius: '4px', display: 'flex', alignItems: 'left', gap: '4px' }}>
                            <Trash2 size={14} /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {Companys.length === 0 && !loading && <div style={{ textAlign: 'left', padding: '30px', color: '#929090ff', fontSize: '25px' }}>No Company Data found.</div>}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AccountCompany;






