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
    <div className="page-container">
      <header className="mb-16 max-w-3xl">
        <h1 className="main-title">
          Explore the University <br />
          <span className="glow-text">Artifact Gallery</span>
        </h1>
        <p className="sub-title">
          The community-driven lost and found platform. Search through reported items or report a new one to maintain the integrity of our campus ecosystem.
        </p>
        <div className="max-w-xl">
          <SearchBar onSearch={handleSearch} />
        </div>
      </header>

      <main>
        {loading ? (
          <div className="flex justify-center py-40">
            <Loader />
          </div>
        ) : error ? (
          <div className="glass-card text-center py-20 bg-rose-500/5 border-rose-500/20 max-w-lg mx-auto !rounded-3xl">
             <span className="text-5xl block mb-6 animate-bounce">⚠️</span>
            <p className="text-rose-400 font-bold text-xl mb-8">{error}</p>
            <button 
              onClick={() => fetchItems()} 
              className="btn-outline border-rose-500/30 hover:bg-rose-500/10"
            >
              Retry Connection
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="sidebar-card text-center py-32 animate-fade-in !rounded-[3rem] border-dashed border-2 border-white/5">
            <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
               <span className="text-5xl">🔍</span>
            </div>
            <h3 className="text-3xl font-black mb-4">No artifacts detected</h3>
            <p className="text-muted max-w-md mx-auto text-lg leading-relaxed mb-10">
              Our sensors haven't picked up any items matching your criteria. Try widening your search parameters.
            </p>
            <button 
              onClick={() => fetchItems()} 
              className="btn-primary !px-10"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-12">
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

