import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold italic tracking-wider">Lost&Found</Link>
        <div className="flex items-center space-x-6">
          <Link to="/" className="hover:text-blue-200 transition">Home</Link>
          {user ? (
            <>
              <Link to="/create" className="hover:text-blue-200 transition">Report Item</Link>
              <Link to="/my-items" className="hover:text-blue-200 transition">My Items</Link>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium border-l pl-4 border-blue-400">Hi, {user.name}</span>
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded-lg text-sm font-semibold transition shadow-sm"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <button className="bg-green-500 hover:bg-green-600 px-4 py-1.5 rounded-lg text-sm font-semibold transition shadow-sm">
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

