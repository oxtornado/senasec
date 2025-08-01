import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Lock, Cloud } from 'lucide-react';
import Login from './pages/Login';
import Register from './pages/Register';
import Inventory from './pages/Inventory';
import Loans from './pages/Loans';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<Layout />}>
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/loans" element={<Loans />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;