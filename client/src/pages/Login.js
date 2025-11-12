import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css'; // optional styling

export default function Login() {
  const [email, setEmail] = useState('sasi@example.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      // Login successful
      navigate('/dashboard/hiring-manager');
    } else {
      // Show error message (e.g., wrong password or not hiring manager)
      setError(result.error || 'Login failed');
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <div className="login-error">{error}</div>}

      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
