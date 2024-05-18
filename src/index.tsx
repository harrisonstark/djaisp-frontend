import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import axios from 'axios';
import App from './App';
import Redirect from './Redirect';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

axios.defaults.headers.common['HSTOKEN'] = process.env.HSTOKEN;
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/redirect" element={<Redirect />} />
    </Routes>
  </Router>,
  // document.getElementById("root")
);

reportWebVitals();