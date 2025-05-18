body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f5f5f5;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}

a {
  text-decoration: none;
  color: #ff6d00;
}

a:hover {
  text-decoration: underline;
}

/* Enhanced Responsive Design */
@media (max-width: 600px) {
  .MuiContainer-root {
    padding-left: 8px;
    padding-right: 8px;
  }

  .MuiTypography-h3 {
    font-size: 1.5rem;
  }

  .MuiTypography-h4 {
    font-size: 1.2rem;
  }

  .MuiTypography-h5 {
    font-size: 1rem;
  }

  .MuiButton-root {
    padding: 6px 12px;
    font-size: 0.75rem;
    min-width: 100%; /* Full-width buttons on mobile */
  }

  .MuiGrid-item {
    padding: 6px;
  }

  .MuiTextField-root {
    font-size: 0.875rem;
  }

  .MuiSelect-root {
    font-size: 0.875rem;
  }

  .MuiTableCell-root {
    font-size: 0.75rem;
    padding: 8px;
  }

  /* Ensure form inputs are touch-friendly */
  input, select, button {
    min-height: 44px; /* Minimum touch target size */
  }
}