import React, { useState } from 'react';
import './Login.css';
import Footer from '../components/Footer'; // Make sure path is correct
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError("⚠ Username and Password cannot be empty.");
      return;
    }

    try {
      const response = await fetch('https://localhost:7145/api/Login/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      // If API does not return JSON, handle gracefully
      if (!response.ok) {
        setError('⚠ Invalid username or password.');
        return;
      }

      const data = await response.json();

      if (data.success && data.token) {
        // ✅ Save token for future API calls
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', username);

        // ✅ Redirect to AccountTypePage
        navigate('/AccountTypePage');
      } else {
        setError(data.message || '⚠ Invalid username or password.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('⚠ Server error. Please ensure the backend is running.');
    }
  };

  return (
    <div className="login-wrapper">
      <form className="login-card" onSubmit={handleSubmit}>
        {/* Logo */}
        <img src="/SwamiSamarthlogo.png" alt="Logo" className="login-logo" />

        {error && <div className="alert alert-danger text-center">{error}</div>}

        <div className="form-group mb-3">
          <label>Username</label>
          <input
            type="text"
            className="form-control"
            placeholder="Type your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Type your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100 login-btn">
          LOGIN
        </button>
      </form>

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default Login;
