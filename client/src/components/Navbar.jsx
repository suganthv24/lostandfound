import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/home' },
    { name: 'Report Item', path: '/create', protected: true },
    { name: 'My Items', path: '/my-items', protected: true },
    { name: 'Dashboard', path: '/dashboard', protected: true },
  ];

  const filteredLinks = navLinks.filter(link => !link.protected || user);

  return (
    <nav className="sticky top-0 z-50 w-full px-6 py-4 animate-slide-down">
      <div className="max-w-7xl mx-auto glass-card !p-3 !rounded-[2rem] flex items-center justify-between border-white/10 shadow-2xl shadow-indigo-500/10">
        <Link to="/" className="flex items-center gap-3 pl-4 group">
          <div className="w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/40 group-hover:rotate-12 transition-transform">
            <span className="text-white text-xl">🔍</span>
          </div>
          <span className="text-xl font-black tracking-tighter glow-text">Lost<span className="text-slate-200">And</span>Found</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {filteredLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path}
              className={`px-6 py-2 rounded-2xl text-sm font-bold transition-all ${
                location.pathname === link.path 
                  ? 'bg-white/10 text-white' 
                  : 'text-muted hover:text-white hover:bg-white/5'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4 pr-2">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] font-black text-muted uppercase tracking-widest leading-none mb-1">Authenticated</span>
                <span className="text-sm font-bold text-slate-200">{user.name}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="btn-outline !py-2 !px-4 text-xs font-bold border-rose-500/20 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/40"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              to="/login"
              className="btn-primary !py-2 !px-6 text-xs font-bold"
            >
              Sign In
            </Link>
          )}
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className={`w-5 h-0.5 bg-white transition-all relative ${isMenuOpen ? 'rotate-45' : ''}`}>
              <div className={`absolute w-5 h-0.5 bg-white transition-all ${isMenuOpen ? 'opacity-0' : 'top-1.5'}`}></div>
              <div className={`absolute w-5 h-0.5 bg-white transition-all ${isMenuOpen ? '-rotate-90' : '-top-1.5'}`}></div>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 animate-fadeIn">
          <div className="glass-card flex flex-col gap-2 !p-4">
            {filteredLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path}
                className={`p-4 rounded-xl text-lg font-bold ${
                  location.pathname === link.path ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-300'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

