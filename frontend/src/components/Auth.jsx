import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

export default function AuthForm({ type }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = type === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = type === 'login'
        ? { email, password }
        : { email, password, name, location };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Invalid credentials. Try user@example.com / password');
        return;
      }

      // Store token and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/dashboard');
    } catch (err) {
      console.error('Auth error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-header">
        <Link to="/" className="auth-logo">ReWear</Link>
        <h2>{type === 'login' ? 'Sign in to your account' : 'Create your account'}</h2>
        <p>
          {type === 'login' ? (
            <>
              Don't have an account? <Link to="/signup" className="auth-link">Sign up</Link>
            </>
          ) : (
            <>
              Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
            </>
          )}
        </p>
      </div>

      <div className="auth-form-wrapper">
        {error && <div className="auth-error">{error}</div>}
        {type === 'login' && (
          <div className="auth-demo">Demo credentials: user@example.com / password</div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {type === 'signup' && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={e => setLocation(e.target.value)}
                required
              />
            </>
          )}
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading} className="auth-submit-btn">
            {loading ? 'Loading...' : type === 'login' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}
