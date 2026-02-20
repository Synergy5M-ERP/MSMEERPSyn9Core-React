import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff, Lock } from "@mui/icons-material";
import axios from "axios";
import { API_ENDPOINTS } from "../config/apiconfig";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
 
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!username || !password) {
    setIsError(true);
    setMessage("Username and Password are required");
    return;
  }

  try {
    setLoading(true);

    const response = await axios.post(API_ENDPOINTS.LOGIN, {
      username: username.trim(),
      password: password.trim(),
    });

  if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

      setIsError(false);
      setMessage("Login successful 🎉");

      // ✅ Navigate WITHOUT reload
      navigate("/dashboard");

    } else {
      setIsError(true);
      setMessage("Invalid username or password");
    }

  } catch (error) {
    setIsError(true);
    setMessage(error.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};
  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <Lock style={{ fontSize: 50, color: "#4e73df" }} />

        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Login to your account</p>

        {message && (
          <div
            style={{
              ...styles.message,
              backgroundColor: isError ? "#ffdddd" : "#ddffdd",
              color: isError ? "#d8000c" : "#2e7d32",
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          {/* Username */}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            required
          />

          {/* Password */}
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </span>
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Optional Forgot Password Link */}
        <p
          style={{ marginTop: "15px", cursor: "pointer", color: "#4e73df" }}
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password?
        </p>
      </div>
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
    background: "rgba(255, 255, 255, 0.95)",
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
    outline: "none",
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
  eyeIcon: {
    position: "absolute",
    right: "10px",
    top: "10px",
    cursor: "pointer",
    color: "#777",
  },
  message: {
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "15px",
    fontSize: "14px",
  },
};

export default Login;
