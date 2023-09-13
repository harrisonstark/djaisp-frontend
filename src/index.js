import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Redirect from './Redirect';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/redirect" element={<Redirect />} />
    </Routes>
  </Router>,
  document.getElementById('root')
);

reportWebVitals();