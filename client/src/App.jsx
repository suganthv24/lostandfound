import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

import SelectCollege from './pages/SelectCollege';
import ValidateEmail from './pages/ValidateEmail';
import VerifyOTP from './pages/VerifyOTP';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Item System Pages
import Home from './pages/Home';
import CreateItem from './pages/CreateItem';
import ItemDetails from './pages/ItemDetails';
import MyItems from './pages/MyItems';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow w-full block">
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />

              {/* Authentication Routes */}
              <Route path="/signup" element={<SelectCollege />} />
              <Route path="/signup/email" element={<ValidateEmail />} />
              <Route path="/signup/verify-otp" element={<VerifyOTP />} />
              <Route path="/signup/register" element={<Register />} />
              <Route path="/login" element={<Login />} />

              {/* Protected Protected Routes */}
              <Route path="/home" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/items/:id" element={
                <ProtectedRoute>
                  <ItemDetails />
                </ProtectedRoute>
              } />
              <Route path="/create" element={
                <ProtectedRoute>
                  <CreateItem />
                </ProtectedRoute>
              } />
              <Route path="/my-items" element={
                <ProtectedRoute>
                  <MyItems />
                </ProtectedRoute>
              } />

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;


