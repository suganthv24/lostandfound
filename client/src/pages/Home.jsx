import React, { useState, useEffect } from 'react';
import { getItems } from '../services/itemApi';
import ItemCard from '../components/ItemCard';
import SearchBar from '../components/SearchBar';
import Loader from '../components/Loader';

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = async (query = '') => {
    try {
      setLoading(true);
      const data = await getItems(query);
      setItems(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch items. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSearch = (query) => {
    fetchItems(query);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <header className="text-center mb-16 space-y-6">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Find what you <span className="glow-text">lost</span>,<br className="sm:hidden" /> return what you <span className="glow-text">found</span>.
        </h1>
        <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
          The community-driven lost and found platform. Search through reported items or report a new one to help others.
        </p>
        <div className="pt-8 px-4">
          <SearchBar onSearch={handleSearch} />
        </div>
      </header>

      <main>
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader />
          </div>
        ) : error ? (
          <div className="glass-card text-center py-16 max-w-lg mx-auto">
            <div className="text-5xl mb-4 text-rose-500">⚠️</div>
            <p className="text-rose-400 font-medium text-lg mb-6">{error}</p>
            <button 
              onClick={() => fetchItems()} 
              className="btn-outline"
            >
              Try Again
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="glass-card text-center py-20 animate-slide-up max-w-3xl mx-auto">
            <div className="relative inline-block mb-6">
              <span className="text-7xl">🔍</span>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-indigo-500 rounded-full animate-ping"></div>
            </div>
            <h3 className="text-2xl font-bold mb-3">No items found</h3>
            <p className="text-muted max-w-md mx-auto">
              We couldn't find anything matching your search. Try adjusting your keywords or be the first to report this item.
            </p>
            <div className="mt-8">
              <button 
                onClick={() => fetchItems()} 
                className="btn-outline text-sm"
              >
                View All Items
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {items.map((item, index) => (
              <div key={item._id} className="animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                <ItemCard item={item} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;

