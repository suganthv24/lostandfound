import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="glass-card" style={{ maxWidth: '600px' }}>
      <h1>Welcome, {user.name} 👋</h1>
      <p className="subtitle">You have successfully authenticated</p>

      <div className="info-box">
        <h3 style={{ marginBottom: '1rem', color: 'var(--accent)' }}>Your Profile</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem' }}>
          <div style={{ fontWeight: 500, color: 'var(--text-muted)' }}>Role:</div>
          <div style={{ textTransform: 'capitalize' }}>{user.role}</div>

          <div style={{ fontWeight: 500, color: 'var(--text-muted)' }}>Email:</div>
          <div>{user.email}</div>

          <div style={{ fontWeight: 500, color: 'var(--text-muted)' }}>College ID:</div>
          <div style={{ fontSize: '0.85rem', wordBreak: 'break-all' }}>{user.collegeId}</div>
        </div>
      </div>

      <button className="btn btn-secondary mt-4" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
