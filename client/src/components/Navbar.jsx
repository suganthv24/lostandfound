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
    { name: 'My Items', path: '/my-items', protected: true },
    { name: 'Report', path: '/create', protected: true },
  ];

  const filteredLinks = navLinks.filter(link => !link.protected || user);

  return (
    <nav className="w-full border-b border-white/5 bg-[#020617] sticky top-0 z-50">
      <div 
        className="mx-auto px-6 lg:px-12 py-5 flex items-center justify-between"
        style={{ maxWidth: '1280px', width: '100%' }}
      >
        <div className="flex items-center gap-12">
          <Link to="/" className="text-xl font-black tracking-tighter flex items-center gap-2">
            <span className="glow-text">Surya P</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {filteredLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path}
                className={`text-[10px] font-black uppercase tracking-[0.2rem] transition-all relative py-1 ${
                  location.pathname === link.path 
                    ? 'text-white' 
                    : 'text-muted hover:text-white'
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></span>
                )}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
               <Link 
                to="/dashboard" 
                className={`w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors ${
                  location.pathname === '/dashboard' ? 'bg-white/10 border-white/30' : ''
                }`}
              >
                <span className="text-lg">👤</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="text-[10px] font-black text-muted hover:text-rose-400 uppercase tracking-widest transition-colors"
              >
                Log Out
              </button>
            </div>
          ) : (
            <Link 
              to="/login"
              className="text-[10px] font-black text-white hover:text-indigo-400 uppercase tracking-widest transition-colors"
            >
              Sign In
            </Link>
          )}
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="text-2xl">{isMenuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#020617] border-b border-white/10 p-6 space-y-4 animate-fade-in">
          {filteredLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path}
              className={`block text-lg font-bold ${
                location.pathname === link.path ? 'text-white' : 'text-muted'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          {!user && (
            <Link 
              to="/login"
              className="block text-lg font-bold text-indigo-400"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

