import React, { useState, useEffect } from "react";
import axios from "axios";
import { Visibility, VisibilityOff, LockReset } from "@mui/icons-material";

const EmployeeCreatePassword = () => {
  const [empCodeSearch, setEmpCodeSearch] = useState("");
  const [employee, setEmployee] = useState({});
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const API_BASE = "https://msmeerpsyn9-core.azurewebsites.net/api/HRMAdminRegAPI";
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const empCode = params.get("Emp_Code");
    if (empCode) setEmpCodeSearch(empCode);
  }, []);

  const fetchEmployee = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/FetchEmployeeDetails?emp_Code=${empCodeSearch}`
      );

      if (res.data.success) {
        setEmployee(res.data.employee);
        setMessage("");
      } else {
        setEmployee({});
        setMessage(res.data.message);
      }
    } catch {
      setEmployee({});
      setMessage("Employee not found");
    }
  };

  const validatePassword = () => {
    if (
      password.length < 8 ||
      !/[a-z]/.test(password) ||
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[!#\$%\^&\*]/.test(password)
    ) {
      setMessage(
        "Password must be at least 8 characters\nMust contain lowercase, uppercase, number and special character (!# $ % ^ & *)"
      );
      return false;
    }

    if (password !== confirmPassword) {
      setMessage("Password and Confirm Password must be same");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    try {
      const res = await axios.post(`${API_BASE}/CreatePassword`, {
        Emp_Code: employee.emp_Code,
        UserName: employee.email,
        Password: password,
      });

      if (res.data.success) {
        alert(res.data.message);
        window.location.href = "/login";
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>

        {/* CENTER ICON */}
        <div style={styles.iconWrapper}>
          <LockReset style={{ fontSize: 55, color: "#4e73df" }} />
        </div>

        <h2 style={styles.title}>Employee Create Password</h2>
        
        {/* Search Section */}
        <div style={styles.searchSection}>
          <input
            type="text"
            placeholder="Enter Employee Code"
            value={empCodeSearch}
            onChange={(e) => setEmpCodeSearch(e.target.value)}
            style={styles.input}
          />
          <button onClick={fetchEmployee} style={styles.searchButton}>
            Search
          </button>
        </div>

        {employee.name && (
          <form onSubmit={handleSubmit}>

            <div style={styles.grid}>
              <Input label="Employee Code" value={employee.emp_Code} readOnly />
              <Input label="Name" value={employee.name} />

              <Input label="Email" value={employee.email} />
              <Input label="Contact No" value={employee.contact_NO} />

              <Input label="Address" value={employee.address} />
              <Input label="Permanent Address" value={employee.permanent_Address} />

              <Input label="Department" value={employee.department} />
              <Input label="Designation" value={employee.designation} />

              <Input label="Authority Level" value={employee.authorityLevel} />

              {/* Password */}
              <div style={{ position: "relative" }}>
                <label style={styles.label}>Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eye}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </span>
              </div>

              {/* Confirm Password */}
              <div style={{ position: "relative" }}>
                <label style={styles.label}>Confirm Password</label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={styles.input}
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eye}
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </span>
              </div>
            </div>

            {message && (
              <div style={styles.error}>{message}</div>
            )}

            {/* CENTER BUTTON */}
            <div style={styles.buttonWrapper}>
              <button type="submit" style={styles.submitButton}>
                Create Password
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
};

export default EmployeeCreatePassword;

/* COMPONENT */

const Input = ({ label, value, readOnly }) => (
  <div style={styles.field}>
    <label style={styles.label}>{label}</label>
    <input value={value || ""} readOnly={readOnly} style={styles.input} />
  </div>
);

/* STYLES */

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #4e73df 0%, #1cc88a 100%)",
    padding: "20px",
  },
  card: {
    background: "#fff",
    padding: "40px",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "950px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.2)",
  },
  iconWrapper: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "10px",
  },
  title: {
    textAlign: "center",
    fontWeight: "700",
  },
  subtitle: {
    textAlign: "center",
    fontSize: "14px",
    color: "#666",
    marginBottom: "20px",
  },
  searchSection: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontWeight: "600",
    marginBottom: "5px",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    width: "100%",
  },
  searchButton: {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    background: "#4e73df",
    color: "#fff",
    cursor: "pointer",
  },
  buttonWrapper: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
  },
  submitButton: {
    width: "300px",
    padding: "12px",
    background: "linear-gradient(135deg, #4e73df, #1cc88a)",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginTop: "10px",
    whiteSpace: "pre-line",
  },
  eye: {
    position: "absolute",
    right: "10px",
    top: "38px",
    cursor: "pointer",
    color: "#777",
  },
};
