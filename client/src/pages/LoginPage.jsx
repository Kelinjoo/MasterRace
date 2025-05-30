// Login form that sends credentials to /api/login and stores JWT on success
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import '../styles/LoginPage.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/login', { username, password });
      const token = res.data.token;

      // Decode payload from JWT token (base64 decode)
      const payload = JSON.parse(atob(token.split('.')[1]));
      login(token, payload.userId, payload.isAdmin, payload.username, payload.bio, payload.profile_picture); // Save to context
      navigate('/');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <h2 className="mb-4">Login to MasterRace</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input value={username} onChange={e => setUsername(e.target.value)} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="form-control" required />
        </div>
        {error && <div className="text-danger">{error}</div>}
        <button className="btn btn-primary w-100" type="submit">Login</button>
      </form>
      <p className="mt-3 text-center">
        Don’t have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default LoginPage;
