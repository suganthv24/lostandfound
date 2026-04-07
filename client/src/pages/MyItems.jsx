import React, { useState, useEffect } from 'react';
import { getItems, deleteItem, updateStatus } from '../services/itemApi';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';

const MyItems = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyItems = async () => {
    try {
      setLoading(true);
      const allItems = await getItems();
      const myItems = allItems.filter(item => item.userId === user?.userId);
      setItems(myItems);
    } catch (err) {
      setError('Failed to fetch your items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchMyItems();
  }, [user]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this artifact?')) {
      try {
        await deleteItem(id);
        setItems(items.filter(item => item._id !== id));
      } catch (err) {
        alert('Failed to delete item.');
      }
    }
  };

  const handleStatusUpdate = async (id, currentStatus) => {
    const newStatus = currentStatus === 'resolved' ? 'active' : 'resolved';
    try {
      await updateStatus(id, newStatus);
      setItems(items.map(item => item._id === id ? { ...item, status: newStatus } : item));
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  if (loading) return (
    <div className="flex justify-center py-60">
      <Loader />
    </div>
  );

  return (
    <div className="page-container">
      <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-12">
        <div className="max-w-2xl">
          <h1 className="main-title mb-4">
            Legacy <br />
            <span className="glow-text">Curations</span>
          </h1>
          <p className="text-xl text-muted font-medium">Manage the items you've submitted to the university digital gallery.</p>
        </div>
        <Link 
          to="/create" 
          className="btn-primary !px-8 !py-4 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
        >
          <span className="text-2xl">+</span> Report New Artifact
        </Link>
      </header>

      {items.length === 0 ? (
        <div className="sidebar-card text-center py-32 animate-fade-in !rounded-[3rem] border-dashed border-2 border-white/5">
          <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
             <span className="text-5xl">📝</span>
          </div>
          <h3 className="text-3xl font-black mb-4">No curations yet</h3>
          <p className="text-muted max-w-sm mx-auto text-lg leading-relaxed mb-10">Items you report will appear here. Start by documenting something you've found or lost.</p>
          <Link to="/create" className="btn-outline inline-block !rounded-2xl">Create First Report</Link>
        </div>
      ) : (
        <div className="space-y-8 lg:space-y-12">
          {items.map((item, index) => (
            <div 
              key={item._id} 
              className="glass-card !p-0 overflow-hidden flex flex-col lg:flex-row animate-slide-up group hover:border-white/10 transition-all !rounded-[2.5rem]"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-full lg:w-80 h-72 lg:h-auto shrink-0 relative overflow-hidden">
                <img 
                  src={item.imageUrl || item.image || 'https://via.placeholder.com/400x400?text=No+Image'} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=Image+Unavailable'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
              </div>
              <div className="p-10 lg:p-12 flex-grow flex flex-col xl:flex-row xl:items-center justify-between gap-12">
                <div className="space-y-6 flex-grow">
                  <div className="flex items-center gap-6 flex-wrap">
                    <h3 className="text-3xl font-black tracking-tight">{item.title}</h3>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm ${
                      item.status === 'resolved' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                    }`}>
                      {item.status || 'active'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-muted font-bold text-sm">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg">📍</span> {item.location}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg">📅</span> {new Date(item.dateTime || item.date).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap lg:flex-nowrap gap-4 shrink-0 justify-end">
                  <button 
                    onClick={() => handleStatusUpdate(item._id, item.status)}
                    className={`flex-1 lg:flex-none px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 border ${
                      item.status === 'resolved' 
                        ? 'bg-transparent border-white/10 text-muted hover:text-white hover:bg-white/5' 
                        : 'bg-indigo-500 text-white border-indigo-400 hover:bg-indigo-400 shadow-xl shadow-indigo-500/20'
                    }`}
                  >
                    {item.status === 'resolved' ? 'Reactive Artifact' : 'Mark Resolved'}
                  </button>
                  <div className="flex gap-4 w-full lg:w-auto">
                    <button 
                      onClick={() => handleDelete(item._id)}
                      className="flex-1 lg:flex-none px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-rose-500/5 border border-rose-500/10 text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all active:scale-95"
                    >
                      Delete
                    </button>
                    <Link 
                      to={`/items/${item._id}`}
                      className="flex-1 lg:flex-none btn-outline !py-4 !px-10 text-center text-xs font-black uppercase tracking-widest !rounded-2xl"
                    >
                      Inspect
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyItems;

