import React, { useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, XCircle, Loader } from 'lucide-react';

function UploadExcel() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.name.match(/\.(xlsx|xls)$/)) {
        setFile(selectedFile);
        setMessage("");
        setStatus("");
      } else {
        setMessage("Please select a valid Excel file (.xlsx or .xls)");
        setStatus("error");
        setFile(null);
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.match(/\.(xlsx|xls)$/)) {
        setFile(droppedFile);
        setMessage("");
        setStatus("");
      } else {
        setMessage("Please drop a valid Excel file (.xlsx or .xls)");
        setStatus("error");
      }
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setMessage("Please select a file.");
      setStatus("error");
      return;
    }

    const formData = new FormData();
    formData.append("UploadedFile", file);

    setStatus("loading");
    setMessage("Uploading...");

    try {
      const response = await fetch("http://localhost:49980/Item/UploadExcel", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("✅ File uploaded successfully!");
        setStatus("success");
        setFile(null);
      } else {
        setMessage("❌ Upload failed. Please try again.");
        setStatus("error");
      }
    } catch (error) {
      setMessage("❌ Upload failed: " + (error.message || "Network error"));
      setStatus("error");
    }
  };

  const removeFile = () => {
    setFile(null);
    setMessage("");
    setStatus("");
  };

  const triggerFileInput = () => {
    document.getElementById('fileInput').click();
  };

  return (
 <>
       <style jsx>{`
         body{
          font-size: 14px;
        letter-spacing: 0.01em;
         }
         `}</style>
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e0f2fe 0%, #ffffff 50%, #fae8ff 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '4rem',
            height: '4rem',
            background: 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)',
            borderRadius: '50%',
            marginBottom: '1rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
          }}>
            <FileSpreadsheet style={{ width: '2rem', height: '2rem', color: 'white' }} />
          </div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
            Upload Excel File
          </h1>
          <p style={{ color: '#6b7280' }}>Import your data with ease</p>
        </div>

        {/* Upload Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          padding: '2rem',
          marginBottom: '1.5rem'
        }}>
          {/* Drag & Drop Zone */}
          <div
            style={{
              position: 'relative',
              border: dragActive ? '2px dashed #3b82f6' : '2px dashed #d1d5db',
              borderRadius: '0.75rem',
              padding: '3rem',
              textAlign: 'center',
              transition: 'all 0.3s',
              backgroundColor: dragActive ? '#eff6ff' : '#ffffff',
              cursor: 'pointer'
            }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
            <input
              id="fileInput"
              type="file"
              name="uploadedFile"
              accept=".xlsx,.xls"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            <Upload style={{ width: '4rem', height: '4rem', margin: '0 auto 1rem', color: '#9ca3af' }} />
            
            {!file ? (
              <>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Drop your Excel file here
                </h3>
                <p style={{ color: '#6b7280', marginBottom: '1rem' }}>or click to browse</p>
                <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Supports: .xlsx, .xls</p>
              </>
            ) : (
              <div style={{
                background: 'linear-gradient(to right, #eff6ff 0%, #fae8ff 100%)',
                borderRadius: '0.5rem',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <FileSpreadsheet style={{ width: '2rem', height: '2rem', color: '#2563eb' }} />
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ fontWeight: '600', color: '#1f2937' }}>{file.name}</p>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                  style={{
                    color: '#ef4444',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#dc2626'}
                  onMouseLeave={(e) => e.target.style.color = '#ef4444'}
                >
                  <XCircle style={{ width: '1.5rem', height: '1.5rem' }} />
                </button>
              </div>
            )}
          </div>

          {/* Upload Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!file || status === "loading"}
            style={{
              width: '100%',
              marginTop: '1.5rem',
              padding: '1rem',
              borderRadius: '0.75rem',
              fontWeight: '600',
              color: 'white',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              border: 'none',
              cursor: !file || status === "loading" ? 'not-allowed' : 'pointer',
              background: !file || status === "loading" 
                ? '#d1d5db' 
                : 'linear-gradient(to right, #3b82f6 0%, #9333ea 100%)',
              boxShadow: !file || status === "loading" ? 'none' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              transform: 'translateY(0)'
            }}
            onMouseEnter={(e) => {
              if (file && status !== "loading") {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (file && status !== "loading") {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
              }
            }}
          >
            {status === "loading" ? (
              <>
                <Loader style={{ width: '1.25rem', height: '1.25rem', animation: 'spin 1s linear infinite' }} />
                Uploading...
              </>
            ) : (
              <>
                <Upload style={{ width: '1.25rem', height: '1.25rem' }} />
                Upload File
              </>
            )}
          </button>
        </div>

        {/* Status Message */}
        {message && (
          <div style={{
            borderRadius: '0.75rem',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            animation: 'fadeIn 0.3s ease-out',
            backgroundColor: status === "success" ? '#f0fdf4' : status === "error" ? '#fef2f2' : '#eff6ff',
            border: status === "success" ? '2px solid #bbf7d0' : status === "error" ? '2px solid #fecaca' : '2px solid #bfdbfe'
          }}>
            {status === "success" && <CheckCircle style={{ width: '1.5rem', height: '1.5rem', color: '#16a34a', flexShrink: 0 }} />}
            {status === "error" && <XCircle style={{ width: '1.5rem', height: '1.5rem', color: '#dc2626', flexShrink: 0 }} />}
            {status === "loading" && <Loader style={{ width: '1.5rem', height: '1.5rem', color: '#2563eb', flexShrink: 0, animation: 'spin 1s linear infinite' }} />}
            
            <p style={{
              fontWeight: '500',
              color: status === "success" ? '#166534' : status === "error" ? '#991b1b' : '#1e40af'
            }}>
              {message}
            </p>
          </div>
        )}

        {/* Instructions */}
        <div style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, #fae8ff 100%)',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          marginTop: '1.5rem'
        }}>
          <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileSpreadsheet style={{ width: '1.25rem', height: '1.25rem', color: '#2563eb' }} />
            Instructions
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.5rem' }}>
              <span style={{ color: '#2563eb', marginTop: '0.125rem' }}>•</span>
              <span>Ensure your Excel file is in .xlsx or .xls format</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.5rem' }}>
              <span style={{ color: '#2563eb', marginTop: '0.125rem' }}>•</span>
              <span>The file should contain proper headers starting from row 1</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', color: '#4b5563', marginBottom: '0.5rem' }}>
              <span style={{ color: '#2563eb', marginTop: '0.125rem' }}>•</span>
              <span>Maximum file size: 10MB</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', color: '#4b5563' }}>
              <span style={{ color: '#2563eb', marginTop: '0.125rem' }}>•</span>
              <span>Duplicate entries will be automatically skipped</span>
            </li>
          </ul>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
 </>
  );
}

export default UploadExcel;