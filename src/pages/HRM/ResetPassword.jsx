import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { Visibility, VisibilityOff, LockReset } from "@mui/icons-material";
import { API_ENDPOINTS } from "../../config/apiconfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();

  const [userId, setUserId] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Get userid + token from URL
  useEffect(() => {
    const empcodeFromUrl = searchParams.get("empcode");
    const tokenFromUrl = searchParams.get("token");

    if (tokenFromUrl) setResetToken(tokenFromUrl);

    if (empcodeFromUrl) {
      axios
        .get(
          `${API_ENDPOINTS.GetUserDetails}?empcode=${encodeURIComponent(
            empcodeFromUrl
          )}`
        )
        .then((res) => {
          const data = res.data;
          console.log("API Response:", data);
          setUserId(data.userName || data.UserName);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Invalid reset link");
        });
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(API_ENDPOINTS.ResetPassword, {
        Userid: userId,
        Password: password,
        ResetToken: resetToken,
      });

      toast.success(
        response.data?.message || "Password updated successfully 🎉"
      );

      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const firstError =
          Object.values(error.response.data.errors)[0][0];
        toast.error(firstError);
      } else {
        toast.error("Invalid or expired reset link");
      }
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <LockReset style={{ fontSize: 50, color: "#4e73df" }} />

        <h2 style={styles.title}>Reset Password</h2>
        <p style={styles.subtitle}>Create your new secure password</p>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          {/* Username (readonly) */}
          <input
            type="text"
            value={userId}
            readOnly
            style={{ ...styles.input, backgroundColor: "#f2f2f2" }}
          />

          {/* New Password */}
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
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

          {/* Confirm Password */}
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.input}
            required
          />

          <button type="submit" style={styles.button}>
            Reset Password
          </button>
        </form>
      </div>

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
};

export default ResetPassword;