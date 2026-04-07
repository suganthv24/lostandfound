import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto w-full group animate-slide-up">
      <input
        type="text"
        placeholder="Search for items (e.g. 'blue wallet', 'iphone 13')..."
        className="input-field pl-12 pr-32 py-4 rounded-2xl text-lg"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-indigo-400 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary !py-2.5 !px-6 !rounded-xl active:scale-95"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
