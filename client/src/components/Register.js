import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    subscriptionPlan: 'Basic',
  });
  const [error, setError] = useState('');

  const { name, email, password, subscriptionPlan } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !subscriptionPlan) {
      setError('All fields are required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Invalid email format');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        { name, email, password, subscriptionPlan }
      );
      localStorage.setItem('token', res.data.token);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
      console.error(err);
    }
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '40px auto', 
      padding: '20px', 
      borderRadius: '8px', 
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      background: '#fff'
    }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Register</h2>
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Name</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={onChange}
            required
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ddd', 
              borderRadius: '4px' 
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ddd', 
              borderRadius: '4px' 
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ddd', 
              borderRadius: '4px' 
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Subscription Plan</label>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '10px' }}>
              <input
                type="radio"
                name="subscriptionPlan"
                value="Basic"
                checked={subscriptionPlan === 'Basic'}
                onChange={onChange}
                style={{ marginRight: '5px' }}
              />
              Basic ($69.99 after trial)
            </label>
            <label style={{ marginBottom: '10px' }}>
              <input
                type="radio"
                name="subscriptionPlan"
                value="Pro"
                checked={subscriptionPlan === 'Pro'}
                onChange={onChange}
                style={{ marginRight: '5px' }}
              />
              Pro ($149.99 after trial)
            </label>
            <label>
              <input
                type="radio"
                name="subscriptionPlan"
                value="Enterprise"
                checked={subscriptionPlan === 'Enterprise'}
                onChange={onChange}
                style={{ marginRight: '5px' }}
              />
              Enterprise ($249.99 after trial)
            </label>
          </div>
        </div>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <button 
          type="submit" 
          style={{ 
            width: '100%', 
            padding: '10px', 
            background: '#007bff', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;