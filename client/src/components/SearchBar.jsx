import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto w-full group">
      <input
        type="text"
        placeholder="Search for items (e.g. 'blue wallet', 'iphone 13')..."
        className="w-full p-4 pl-12 pr-28 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-gray-700 bg-white shadow-sm group-hover:shadow-md"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors shadow-lg active:scale-95"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
