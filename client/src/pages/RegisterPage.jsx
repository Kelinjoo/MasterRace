// Registration form that submits new user data to /api/register
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import '../styles/RegisterPage.css';


function RegisterPage() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/register', formData);
      navigate('/login'); // Redirect to login after successful registration
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div className="login-container">
      <h2 className="mb-4">Register</h2>
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input className="form-control" required onChange={e => setFormData({ ...formData, username: e.target.value })} />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" required onChange={e => setFormData({ ...formData, email: e.target.value })} />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" required onChange={e => setFormData({ ...formData, password: e.target.value })} />
        </div>
        {error && <div className="text-danger">{error}</div>}
        <button type="submit" className="btn btn-success w-100">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;
