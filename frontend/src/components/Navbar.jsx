import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  }

  return (
    <header className="header-container">
      <div className="header-content">
        <Link to="/" className="header-logo">ReWear</Link>
        <nav className="header-nav">
          <Link to="/browse" className="header-link">Browse Items</Link>
          {user && <Link to="/add-item" className="header-link">List Item</Link>}
        </nav>
        <div className="header-user">
          {user ? (
            <>
              <span className="header-points">{user.points} points</span>
              <Link to="/dashboard" className="header-btn">Dashboard</Link>
              <Link to="/add-item" className="header-btn green">Add Item</Link>
              {user.isAdmin && <Link to="/admin" className="header-btn blue">Admin</Link>}
              <button onClick={handleLogout} className="header-btn red">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="header-link">Login</Link>
              <Link to="/signup" className="header-btn green">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
