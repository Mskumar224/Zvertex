import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

try {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
} catch (error) {
  // eslint-disable-next-line no-console
  console.error('Failed to render application:', error);
}