import React from 'react';

const Footer = () => (
  <footer style={{ 
    background: '#007bff', 
    color: '#fff', 
    padding: '15px', 
    textAlign: 'center',
    position: 'relative',
    bottom: 0,
    width: '100%'
  }}>
    <p style={{ margin: 0 }}>© 2025 ZvertexAI. All rights reserved.</p>
    <p style={{ margin: '5px 0' }}>
      <a href="/contact" style={{ color: '#fff', textDecoration: 'none', margin: '0 10px' }}>Contact Us</a> |{' '}
      <a href="/privacy" style={{ color: '#fff', textDecoration: 'none', margin: '0 10px' }}>Privacy Policy</a>
    </p>
  </footer>
);

export default Footer;