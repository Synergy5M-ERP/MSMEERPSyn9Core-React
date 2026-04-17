import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Email, ArrowBack } from "@mui/icons-material";
import { API_ENDPOINTS } from "../../config/apiconfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error("Username is required");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        API_ENDPOINTS.ForgotPassword,
        {
          username: username.trim(),
        }
      );

      toast.success(
        response.data?.message || "Reset link sent successfully ✅"
      );

      setUsername("");

    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong ❌");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <Email style={{ fontSize: 50, color: "#4e73df" }} />

        <h2 style={styles.title}>Forgot Password</h2>
        <p style={styles.subtitle}>
          Enter your Username
        </p>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          
          {/* Username */}
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div style={{ marginTop: "20px" }}>
          <Link to="/login" style={styles.backLink}>
            <ArrowBack style={{ fontSize: 16, marginRight: 5 }} />
            Back to Login
          </Link>
        </div>
      </div>

      {/* ✅ Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

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
    background: "white",
    padding: "40px",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "420px",
    textAlign: "center",
    boxShadow: "0 15px 40px rgba(0,0,0,0.2)",
  },
  title: {
    marginTop: "15px",
    marginBottom: "5px",
    fontWeight: "700",
  },
  subtitle: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(135deg, #4e73df, #1cc88a)",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontWeight: "600",
    fontSize: "16px",
    cursor: "pointer",
  },
  backLink: {
    fontSize: "14px",
    color: "#4e73df",
    textDecoration: "none",
    fontWeight: "500",
    display: "inline-flex",
    alignItems: "center",
  },
};

export default ForgotPassword;