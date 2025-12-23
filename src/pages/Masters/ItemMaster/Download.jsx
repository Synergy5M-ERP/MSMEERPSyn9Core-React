import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Download() {
  const handleDownload = async () => {
    try {
      const response = await fetch('http://localhost:49980/Item/DownloadTemplate', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Item_Template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("✅ Template downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("❌ Failed to download template.");
    }
  };

  return (
    <>
         <style jsx>{`
         body{
          font-size: 14px;
        letter-spacing: 0.01em;
         }
         `}</style>
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{
          minHeight: "80vh",
          background: "linear-gradient(135deg, #e3f2fd, #fff)",
        }}
      >
        <div
          className="p-5 shadow rounded text-center"
          style={{
            backgroundColor: "#ffffff",
            maxWidth: "1000px",
            maxHeight:"1000px",
            border: "1px solid #e0e0e0",

          }}
        >
          <h1 className="text-primary mb-4 " style={{fontWeight:"20px"}}>
            Download Excel Template
          </h1>
          <h3 className="text-muted mb-4">
            Click the button below to get the latest version of the item template.
          </h3>
          <button
            className="btn btn-success p-4 p-2"
            onClick={handleDownload}
            style={{
              fontWeight: "bold",
              letterSpacing: "0.5px",
              transition: "all 0.3s ease",
              fontWeight:"18px", width: "50%",
                  fontSize: "14px"
            }}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor = "#218838")
            }
            onMouseOut={(e) =>
              (e.target.style.backgroundColor = "#28a745")
            }
          >
            Download Excel Template
          </button>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default Download;
