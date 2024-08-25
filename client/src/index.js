import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './pages/Layout';
import { Auth0Provider } from '@auth0/auth0-react';

const auth0Config = {
  domain: process.env.REACT_APP_AUTH0_DOMAIN,
  clientId: process.env.REACT_APP_CLIENT_ID,
  authorizationParams: {
    redirect_uri: process.env.REACT_APP_REDIRECT_URI,
  },
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Auth0Provider {...auth0Config}>
    <App />
  </Auth0Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
