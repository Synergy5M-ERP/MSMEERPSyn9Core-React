import React from "react";

const buttonStyle = {
  margin: "0 5px",
  padding: "8px 14px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "500",
  transition: "all 0.3s ease",
  border: "1px solid #ddd",
  backgroundColor: "white",
  color: "#333",
  boxShadow: "none",
};

const activeButtonStyle = {
  ...buttonStyle,
  border: "2px solid #0066cc",
  backgroundColor: "#007bff",
  color: "white",
  fontWeight: "700",
  boxShadow: "0 0 8px rgba(0,123,255,0.5)",
};

const navButtonBaseStyle = {
  padding: "8px 16px",
  borderRadius: "6px",
  border: "1px solid #0066cc",
  fontWeight: "600",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
};

const disabledNavButtonStyle = {
  ...navButtonBaseStyle,
  backgroundColor: "#e0e0e0",
  color: "#999",
  cursor: "not-allowed",
};

const enabledNavButtonStyle = {
  ...navButtonBaseStyle,
  backgroundColor: "#e6a61e",
  color: "white",
};

function Pagination({ totalRecords, recordsPerPage, currentPage, onPageChange }) {
  // If no records or records are 4 or fewer, do not show pagination
  if (totalRecords === 0 || totalRecords <= 4) return null;

  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  if (totalPages <= 1) return null;

  const goToPage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    onPageChange(pageNumber);
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div style={{ marginTop: 20, textAlign: "center", userSelect: "none" }}>
      {/* Previous Button */}
      <button
        disabled={currentPage === 1}
        onClick={() => goToPage(currentPage - 1)}
        style={currentPage === 1 ? disabledNavButtonStyle : enabledNavButtonStyle}
        onMouseEnter={(e) => {
          if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = "#ca9519";
        }}
        onMouseLeave={(e) => {
          if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = "#e6a61e";
        }}
        aria-label="Previous Page"
      >
        ⏪
      </button>

      {/* Page Number Buttons */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => goToPage(page)}
          style={currentPage === page ? activeButtonStyle : buttonStyle}
          onMouseEnter={(e) => {
            if (currentPage !== page) {
              e.currentTarget.style.backgroundColor = "#e9f0fb";
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== page) {
              e.currentTarget.style.backgroundColor = "white";
            }
          }}
          aria-current={currentPage === page ? "page" : undefined}
          aria-label={`Page ${page}`}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => goToPage(currentPage + 1)}
        style={currentPage === totalPages ? disabledNavButtonStyle : enabledNavButtonStyle}
        onMouseEnter={(e) => {
          if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = "#ca9519";
        }}
        onMouseLeave={(e) => {
          if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = "#e6a61e";
        }}
        aria-label="Next Page"
      >
        ⏩
      </button>
    </div>
  );
}

export default Pagination;
