import { useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    console.log(API);
    try {
      const res = await axios.post(`${API}/login`, {
        email,
        password
      });

      localStorage.setItem('token', res.data.token);
      onLogin();
    } 
    catch (err) {
        setError(err.response?.data?.error || 'Login failed');
    }
  };

    return (
        <div className="card">
            <h2>Admin Login</h2>

        <div className="form-group">
            <label>Email</label>
            <input
                type="text"
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
        </div>

        <div className="form-group" style={{ position: 'relative' }}>
            <label>Password</label>

            <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: '40px' }}
            />

            <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                    position: 'absolute',
                    right: '12px',
                    top: '38px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    opacity: 0.7
                }}
            >
                {showPassword ? 'Hide' : 'Show'}
            </span>
        </div>

        <button className="submit-btn" onClick={handleLogin}>
            Login
        </button>
        {error && <p className="error">{error}</p>}
    </div>
    );
}

export default Login;