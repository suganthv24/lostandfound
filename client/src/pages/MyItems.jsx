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
    if (window.confirm('Are you sure you want to delete this item?')) {
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
    <div className="flex justify-center py-40">
      <Loader />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Your <span className="glow-text">Reports</span></h1>
          <p className="text-muted text-lg">Manage the items you've posted to the community.</p>
        </div>
        <Link 
          to="/create" 
          className="btn-primary flex items-center gap-2 group"
        >
          <span className="text-xl transition-transform group-hover:rotate-90">+</span> Report New Item
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="glass-card text-center py-20 animate-slide-up max-w-2xl mx-auto">
          <div className="text-6xl mb-6 opacity-80">📝</div>
          <h3 className="text-2xl font-bold mb-3">No reports yet</h3>
          <p className="text-muted max-w-sm mx-auto mb-8">Items you report will appear here. Start by reporting something you've found or lost.</p>
          <Link to="/create" className="btn-outline inline-block">Start Now</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {items.map((item, index) => (
            <div 
              key={item._id} 
              className="glass-card !p-0 overflow-hidden flex flex-col md:flex-row animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-full md:w-64 h-48 md:h-auto shrink-0 relative">
                <img 
                  src={item.image || 'https://via.placeholder.com/400x400?text=No+Image'} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
              </div>
              <div className="p-8 flex-grow flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-4 max-w-md">
                  <div className="flex items-center gap-4 flex-wrap">
                    <h3 className="text-2xl font-bold">{item.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      item.status === 'resolved' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                    }`}>
                      {item.status || 'active'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 text-muted font-medium">
                    <div className="flex items-center gap-2">
                      <span className="opacity-60">📍</span> {item.location}
                    </div>
                    <div className="flex items-center gap-2 text-xs opacity-60">
                      <span className="">📅</span> Posted on {new Date(item.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap md:flex-nowrap gap-3 shrink-0">
                  <button 
                    onClick={() => handleStatusUpdate(item._id, item.status)}
                    className={`flex-1 md:flex-none px-6 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95 border ${
                      item.status === 'resolved' 
                        ? 'bg-transparent border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10' 
                        : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/20'
                    }`}
                  >
                    {item.status === 'resolved' ? 'Re-activate' : 'Mark Resolved'}
                  </button>
                  <div className="flex gap-3 w-full md:w-auto">
                    <button 
                      onClick={() => handleDelete(item._id)}
                      className="flex-1 md:flex-none px-6 py-3 rounded-2xl font-bold text-sm bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 transition-all active:scale-95"
                    >
                      Delete
                    </button>
                    <Link 
                      to={`/items/${item._id}`}
                      className="flex-1 md:flex-none btn-outline !py-3 !px-8 text-center text-sm font-bold"
                    >
                      View
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

