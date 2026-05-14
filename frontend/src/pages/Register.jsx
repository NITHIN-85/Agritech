import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [role, setRole] = useState('FARMER');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, location, role }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Email already exists or registration failed' }));
        throw new Error(errorData.message || 'Registration failed');
      }

      const { token, user } = await response.json();
      setSuccess('Registration successful! Logging you in...');
      
      setTimeout(() => {
        login(user, token);
        if (user.role === 'FARMER') {
          navigate('/farmer-dashboard');
        } else {
          navigate('/buyer-dashboard');
        }
      }, 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '50px' }}>
      <h2>Sign Up</h2>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: '10px' }}>{success}</div>}
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-control"
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            placeholder="Jane Doe"
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            placeholder="jane@farm.com"
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            placeholder="password"
          />
        </div>
        <div>
          <label>Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="form-control"
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            placeholder="City, State"
          />
        </div>
        <div>
          <label>Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="form-control"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          >
            <option value="FARMER">Farmer</option>
            <option value="BUYER">Buyer</option>
          </select>
        </div>
        <button type="submit" className="btn btn-outline" style={{ marginTop: '10px' }}>
          Sign Up
        </button>
      </form>
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p>Already have an account? <Link to="/login" style={{ color: '#10B981', textDecoration: 'none', fontWeight: 'bold' }}>Sign In</Link></p>
      </div>
    </div>
  );
};

export default Register;
