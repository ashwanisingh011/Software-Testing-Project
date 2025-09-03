// main.jsx (or index.js)

import React from 'react'; // <--- THIS IS THE FIX
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // This imports your Tailwind styles

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);