import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto w-full animate-fade-in">
      <div className="glass-card">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold mb-3">Welcome, <span className="glow-text">{user.name}</span> 👋</h1>
          <p className="text-muted italic">You have successfully authenticated</p>
        </header>

        <div className="space-y-6">
          <h3 className="text-xs font-black text-muted uppercase tracking-[0.2em] mb-4 pl-1">Your Profile Information</h3>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group hover:border-indigo-500/30 transition-colors">
              <div>
                <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Account Role</p>
                <p className="text-lg font-bold capitalize text-slate-200">{user.role}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold group-hover:scale-110 transition-transform">
                {user.role[0].toUpperCase()}
              </div>
            </div>

            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group hover:border-indigo-500/30 transition-colors">
              <div>
                <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Email Address</p>
                <p className="text-lg font-bold text-slate-200">{user.email}</p>
              </div>
              <span className="text-xl opacity-30">✉️</span>
            </div>

            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group hover:border-indigo-500/30 transition-colors">
              <div>
                <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">College Identification</p>
                <p className="text-sm font-bold text-indigo-300 break-all">{user.collegeId}</p>
              </div>
              <span className="text-xl opacity-30">🆔</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5">
          <button className="btn-outline w-full py-4 text-rose-400 border-rose-500/20 hover:bg-rose-500/10 hover:border-rose-500/40" onClick={logout}>
            Sign Out Securely
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
