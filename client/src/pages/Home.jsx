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
    <div className="space-y-8 animate-fade-in">
      <header className="text-center space-y-4 py-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
          Find what you <span className="text-blue-600">lost</span>, return what you <span className="text-green-600">found</span>.
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          The community-driven lost and found platform. Search through reported items or report a new one to help others.
        </p>
        <div className="pt-4">
          <SearchBar onSearch={handleSearch} />
        </div>
      </header>

      <main>
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 font-medium text-lg">{error}</p>
            <button 
              onClick={() => fetchItems()} 
              className="mt-4 text-blue-600 hover:underline font-bold"
            >
              Try Again
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border-2 border-dashed border-gray-200">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-800">No items found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or report a new item.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {items.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;

