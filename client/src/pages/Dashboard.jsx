import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="page-container max-w-4xl">
      <header className="mb-16 animate-fade-in">
        <h1 className="main-title mb-4">
          Identity <br />
          <span className="glow-text">Verification</span>
        </h1>
        <p className="text-xl text-muted font-medium mb-12">Review your secure credentials and university association protocol.</p>
      </header>

      <div className="space-y-12 animate-slide-up">
        <section className="space-y-6">
           <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></span>
              <h3 className="text-xs font-black text-muted uppercase tracking-[0.2em]">Authorized Personnel</h3>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-card !p-10 group hover:border-indigo-500/30 transition-all !rounded-[2rem]">
                 <div className="flex items-start justify-between mb-8">
                   <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                      {user.role[0].toUpperCase()}
                   </div>
                   <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Active Session
                   </span>
                 </div>
                 <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Assigned Designation</p>
                 <h4 className="text-2xl font-black tracking-tight capitalize">{user.role}</h4>
              </div>

              <div className="glass-card !p-10 group hover:border-indigo-500/30 transition-all !rounded-[2rem]">
                 <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">
                    ✉️
                 </div>
                 <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Communication Channel</p>
                 <h4 className="text-2xl font-black tracking-tight truncate">{user.email}</h4>
              </div>
           </div>
        </section>

        <section className="space-y-6">
           <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></span>
              <h3 className="text-xs font-black text-muted uppercase tracking-[0.2em]">Institutional Association</h3>
           </div>
           
           <div className="sidebar-card !p-10 !rounded-[2.5rem] border-white/10 group hover:bg-white/[0.04]">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-muted uppercase tracking-widest">College Identification ID</p>
                  <p className="text-xl font-bold text-indigo-300 tracking-wider font-mono">{user.collegeId}</p>
                </div>
                <span className="text-4xl opacity-20 group-hover:opacity-60 transition-opacity">🆔</span>
              </div>
           </div>
        </section>

        <div className="pt-16 border-t border-white/5">
          <button 
            className="w-full btn-outline py-6 !rounded-[2rem] text-rose-400 border-rose-500/10 hover:bg-rose-500/5 hover:border-rose-500/30 font-black uppercase tracking-[0.3em] text-xs transition-all active:scale-[0.98]" 
            onClick={logout}
          >
            Terminate Secure Session
          </button>
        </div>
      </div>

      <footer className="mt-32 text-center opacity-20">
         <p className="text-[10px] font-black text-muted uppercase tracking-[0.5em]">Identity Verification Layer V2.4 — Status: Nominal</p>
      </footer>
    </div>
  );
};

export default Dashboard;
