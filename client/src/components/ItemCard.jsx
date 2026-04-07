import React from 'react';
import { Link } from 'react-router-dom';

const ItemCard = ({ item }) => {
  const isLost = item.type === 'lost';

  return (
    <div className="glass-card !p-0 overflow-hidden flex flex-col h-full group">
      <div className="h-56 overflow-hidden relative">
        <img 
          src={item.imageUrl || item.image || '/placeholder-artifact.png'} 
          alt={item.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => { 
            if (!e.target.dataset.tried) {
              e.target.dataset.tried = "true";
              e.target.src = 'https://via.placeholder.com/800x600?text=Artifact+Image'; 
            }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
           <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.1em] border ${
            isLost 
              ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' 
              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
          }`}>
            {item.type}
          </div>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-black mb-3 line-clamp-1 group-hover:text-indigo-400 transition-colors">
          {item.title}
        </h3>
        
        <div className="space-y-3 mb-6 text-xs font-bold text-muted flex-grow">
          <div className="flex items-center gap-2">
            <span className="text-lg grayscale group-hover:grayscale-0 transition-opacity">📍</span>
            <span className="truncate">{item.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg grayscale group-hover:grayscale-0 transition-opacity">📅</span>
            <span>{new Date(item.dateTime || item.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>

        <Link 
          to={`/items/${item._id}`} 
          className="btn-primary !py-2.5 !rounded-xl text-center text-sm font-bold tracking-wide"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ItemCard;
