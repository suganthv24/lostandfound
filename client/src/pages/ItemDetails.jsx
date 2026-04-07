import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItemById, contactFound } from '../services/itemApi';
import Loader from '../components/Loader';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await getItemById(id);
        setItem(data);
      } catch (err) {
        setError('Item not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleContact = async () => {
    try {
      setContactLoading(true);
      await contactFound(id);
      setContactSuccess(true);
    } catch (err) {
      alert('Failed to send contact info. Please try again.');
    } finally {
      setContactLoading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-40">
      <Loader />
    </div>
  );

  if (error) return (
    <div className="max-w-md mx-auto py-40 px-4 text-center animate-fade-in">
      <div className="glass-card">
        <div className="text-5xl mb-4 text-rose-500">⚠️</div>
        <h2 className="text-2xl font-bold mb-6">{error}</h2>
        <button onClick={() => navigate('/')} className="btn-outline w-full">Back to Home</button>
      </div>
    </div>
  );

  const isLost = item.type === 'lost';

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 animate-fade-in">
      <button 
        onClick={() => navigate('/')}
        className="mb-8 flex items-center gap-2 text-muted hover:text-indigo-400 transition-colors font-medium group"
      >
        <span className="text-xl transition-transform group-hover:-translate-x-1">←</span> Back to Feed
      </button>

      <div className="glass-card !p-0 overflow-hidden flex flex-col lg:flex-row">
        <div className="lg:w-1/2 h-[400px] lg:h-auto overflow-hidden relative group">
          <img 
            src={item.image || 'https://via.placeholder.com/800x600?text=No+Image'} 
            alt={item.title} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-8">
             <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] border shadow-lg ${
                isLost 
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' 
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              }`}>
                {item.type}
              </div>
          </div>
        </div>
        
        <div className="lg:w-1/2 p-8 lg:p-14 flex flex-col">
          <div className="flex justify-between items-start mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              {item.title}
            </h1>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <div className="p-5 bg-input-bg/40 border border-glass-border rounded-2xl">
              <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-2">Location</p>
              <div className="flex items-center gap-3">
                <span className="text-2xl">📍</span>
                <p className="font-bold text-lg">{item.location}</p>
              </div>
            </div>
            <div className="p-5 bg-input-bg/40 border border-glass-border rounded-2xl">
              <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-2">Date Reported</p>
              <div className="flex items-center gap-3">
                <span className="text-2xl">📅</span>
                <p className="font-bold text-lg">{new Date(item.date).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-4">Description</p>
            <div className="bg-indigo-500/5 p-8 rounded-3xl border-l-4 border-indigo-500/50">
              <p className="text-lg text-slate-300 leading-relaxed italic">
                "{item.description}"
              </p>
            </div>
          </div>

          <div className="mt-auto">
            {contactSuccess ? (
              <div className="bg-emerald-500/10 text-emerald-400 p-6 rounded-2xl font-bold text-center border border-emerald-500/30 animate-bounce">
                <span className="text-2xl mr-2">🎉</span>
                Contact notification sent to the owner!
              </div>
            ) : (
              <button
                onClick={handleContact}
                disabled={contactLoading}
                className="w-full btn-primary py-5 text-lg flex items-center justify-center gap-3 group"
              >
                {contactLoading ? (
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span className="text-2xl transition-transform group-hover:scale-125">✉️</span>
                    <span>I Found This! Contact Owner</span>
                  </>
                )}
              </button>
            )}
            <p className="text-center text-[10px] text-muted mt-6 font-bold uppercase tracking-widest opacity-40">
              ID: {item._id}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;

