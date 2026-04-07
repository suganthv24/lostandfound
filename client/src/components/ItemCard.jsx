import React from 'react';
import { Link } from 'react-router-dom';

const ItemCard = ({ item }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-gray-100 flex flex-col h-full">
      <div className="h-48 overflow-hidden relative">
        <img 
          src={item.image || 'https://via.placeholder.com/400x300?text=No+Image'} 
          alt={item.title} 
          className="w-full h-full object-cover"
        />
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
          item.type === 'lost' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
        }`}>
          {item.type}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{item.title}</h3>
        <div className="space-y-2 mb-4 text-sm text-gray-600 flex-grow">
          <p className="flex items-center">
            <span className="mr-2 italic">📍</span> {item.location}
          </p>
          <p className="flex items-center">
            <span className="mr-2 italic">📅</span> {new Date(item.date).toLocaleDateString()}
          </p>
        </div>
        <Link 
          to={`/items/${item._id}`} 
          className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-colors shadow-md"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ItemCard;
