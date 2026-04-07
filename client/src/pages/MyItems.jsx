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
      // Filter items belonging to the current user
      // In a real app, the API would handle this (e.g. GET /items/me)
      const myItems = allItems.filter(item => item.owner === user?.id || item.userId === user?.id);
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

  if (loading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Your Reports</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage the items you've posted to the community.</p>
        </div>
        <Link 
          to="/create" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-2xl transition-all shadow-lg shadow-blue-200 text-center active:scale-95"
        >
          + Report New Item
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border-2 border-dashed border-gray-200">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-bold text-gray-800">No reports yet</h3>
          <p className="text-gray-500 mt-2">Items you report will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {items.map((item) => (
            <div key={item._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow">
              <div className="w-full md:w-48 h-48">
                <img 
                  src={item.image || 'https://via.placeholder.com/200x200?text=No+Image'} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 flex-grow flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                      item.status === 'resolved' ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {item.status || 'active'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 flex items-center">
                    <span className="mr-2">📍</span> {item.location}
                  </p>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider italic">
                    Posted on {new Date(item.date).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => handleStatusUpdate(item._id, item.status)}
                    className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 border-2 ${
                      item.status === 'resolved' 
                        ? 'bg-white border-blue-600 text-blue-600 hover:bg-blue-50' 
                        : 'bg-green-600 border-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {item.status === 'resolved' ? 'Re-activate' : 'Mark Resolved'}
                  </button>
                  <button 
                    onClick={() => handleDelete(item._id)}
                    className="px-6 py-2.5 rounded-xl font-bold text-sm bg-white border-2 border-red-500 text-red-500 hover:bg-red-50 transition-all active:scale-95"
                  >
                    Delete
                  </button>
                  <Link 
                    to={`/items/${item._id}`}
                    className="px-6 py-2.5 rounded-xl font-bold text-sm bg-gray-800 text-white hover:bg-gray-900 transition-all active:scale-95 shadow-lg"
                  >
                    View
                  </Link>
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

