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
        setError('Artifact not found or failed to load.');
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
      alert('Failed to initiate contact sequence. Please try again.');
    } finally {
      setContactLoading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-60">
      <Loader />
    </div>
  );

  if (error) return (
    <div className="page-container flex items-center justify-center">
      <div className="glass-card text-center py-20 bg-rose-500/5 border-rose-500/20 max-w-lg mx-auto !rounded-3xl">
        <div className="text-5xl mb-6 text-rose-500">⚠️</div>
        <h2 className="text-2xl font-black mb-8">{error}</h2>
        <button onClick={() => navigate('/home')} className="btn-outline !rounded-2xl">Return to Gallery</button>
      </div>
    </div>
  );

  const isLost = item.type === 'lost';

  return (
    <div className="page-container">
      <header className="mb-12 animate-fade-in">
        <button 
          onClick={() => navigate('/home')}
          className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-muted hover:text-white transition-all"
        >
          <span className="text-xl group-hover:-translate-x-2 transition-transform">←</span> Return to Repository
        </button>
      </header>

      <div className="flex flex-col lg:flex-row gap-16 xl:gap-24 items-start">
        {/* Left: Artifact Visualization */}
        <div className="w-full lg:w-[55%] animate-slide-up">
           <div className="glass-card !p-0 overflow-hidden !rounded-[3rem] shadow-2xl relative group">
              <img 
                src={item.imageUrl || item.image || 'https://via.placeholder.com/800x600?text=No+Image'} 
                alt={item.title} 
                className="w-full h-full object-cover min-h-[500px] lg:min-h-[700px] group-hover:scale-105 transition-transform duration-1000"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/800x600?text=Image+Unavailable'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
              
              <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
                <div className="space-y-4">
                  <div className={`inline-block px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border backdrop-blur-md shadow-lg ${
                    isLost 
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' 
                      : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {item.type} artifact
                  </div>
                  <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-none">
                    {item.title}
                  </h1>
                </div>
                <div className="text-white/40 text-[10px] font-black uppercase tracking-widest hidden md:block pb-2">
                  System ID: {item._id.slice(-8).toUpperCase()}
                </div>
              </div>
           </div>
        </div>
        
        {/* Right: Metadata & Actions */}
        <div className="w-full lg:w-[45%] space-y-12 animate-fade-in delay-200">
          <section className="space-y-6">
             <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></span>
                <h3 className="text-xs font-black text-muted uppercase tracking-[0.2em]">Provenance Details</h3>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="sidebar-card !p-8 border-white/10 group hover:bg-white/[0.04] transition-colors">
                  <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-4">Location Matrix</p>
                  <div className="flex items-center gap-4">
                    <span className="text-3xl filter grayscale group-hover:grayscale-0 transition-all">📍</span>
                    <p className="font-black text-xl tracking-tight">{item.location}</p>
                  </div>
                </div>
                <div className="sidebar-card !p-8 border-white/10 group hover:bg-white/[0.04] transition-colors">
                  <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-4">Discovery Date</p>
                  <div className="flex items-center gap-4">
                    <span className="text-3xl filter grayscale group-hover:grayscale-0 transition-all">📅</span>
                    <p className="font-black text-xl tracking-tight">{new Date(item.dateTime || item.date).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>
             </div>
          </section>

          <section className="space-y-6">
             <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></span>
                <h3 className="text-xs font-black text-muted uppercase tracking-[0.2em]">Contextual Record</h3>
             </div>
             <div className="bg-indigo-500/[0.03] p-10 rounded-[2.5rem] border border-indigo-500/10 min-h-[200px] flex items-center">
                <p className="text-2xl text-slate-200 leading-relaxed font-medium italic opacity-90">
                  "{item.description}"
                </p>
             </div>
          </section>

          <section className="pt-12 space-y-8">
            {contactSuccess ? (
              <div className="bg-emerald-500/10 text-emerald-400 p-8 rounded-[2.5rem] font-black text-center border border-emerald-500/20 animate-slide-up shadow-[0_15px_30px_rgba(16,185,129,0.1)]">
                <div className="text-4xl mb-4">🎉</div>
                <h4 className="text-xl mb-2">Protocol Initiated</h4>
                <p className="text-sm opacity-80 uppercase tracking-widest">Contact notification transmitted to primary owner</p>
              </div>
            ) : (
              <div className="space-y-6 text-center">
                <button
                  onClick={handleContact}
                  disabled={contactLoading}
                  className="w-full btn-primary !py-8 !rounded-[2rem] text-xl font-black uppercase tracking-[0.1em] flex items-center justify-center gap-4 group hover:scale-[1.02] shadow-[0_20px_40px_rgba(99,102,241,0.3)]"
                >
                  {contactLoading ? (
                     <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="text-3xl transition-transform group-hover:rotate-12 group-hover:scale-125">✉️</span>
                      <span>Initiate Recovery Protocol</span>
                    </>
                  )}
                </button>
                <p className="text-[10px] text-muted font-bold uppercase tracking-[0.3em] opacity-40">
                  Secure encrypted transmission via University Network
                </p>
              </div>
            )}
          </section>
        </div>
      </div>

      <footer className="mt-32 pt-12 border-t border-white/5 text-center">
         <p className="text-[10px] font-black text-muted uppercase tracking-[0.5em] opacity-20">University Artifact Verification System — {item._id.toUpperCase()}</p>
      </footer>
    </div>
  );
};

export default ItemDetails;

