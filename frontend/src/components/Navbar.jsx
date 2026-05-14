import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sprout, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar" style={{ background: 'white', border: 'none', padding: '1.5rem 0' }}>
      <div className="container nav-container" style={{ background: 'white', borderRadius: '100px', padding: '0.75rem 2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        <Link to="/" className="nav-logo" style={{ color: '#1e293b', fontSize: '1.25rem' }}>
          <div style={{ background: '#1e293b', color: 'white', padding: '5px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sprout size={20} />
          </div>
          Agritech
        </Link>
        
        <div className="nav-links" style={{ gap: '1.5rem' }}>
          <Link to="/marketplace" className="nav-link" style={{ color: '#64748b' }}>Marketplace</Link>
          
          {user && user.role === 'FARMER' && (
            <>
              <Link to="/farmer-dashboard" className="nav-link" style={{ color: '#64748b' }}>Farmer Dash</Link>
              <Link to="/harvest" className="nav-link" style={{ color: '#64748b' }}>Yields</Link>
              <Link to="/agrisync" className="nav-link" style={{ color: '#64748b' }}>AgriSync</Link>
            </>
          )}
          
          {user && user.role === 'BUYER' && (
            <Link to="/buyer-dashboard" className="nav-link" style={{ color: '#64748b' }}>Buyer Dash</Link>
          )}
          
          <Link to="/" className="nav-link" style={{ color: '#64748b' }}>About us</Link>
          <Link to="/" className="nav-link" style={{ color: '#64748b' }}>Contact</Link>
        </div>
        
        <div className="nav-actions" style={{ gap: '10px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user.name}</span>
              <button onClick={handleLogout} className="btn btn-primary" style={{ background: '#1e293b', padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>Logout</button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline" style={{ border: 'none', background: 'transparent', color: '#1e293b' }}>Sign in</Link>
              <Link to="/signup" className="btn btn-primary" style={{ background: '#1e293b', borderRadius: '12px', padding: '0.6rem 1.5rem' }}>Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
