import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <input
        type="text"
        placeholder="Search posts..."
        value={query}
        onChange={handleInputChange}
        style={{
          width: '100%',
          padding: '0.5rem',
          fontSize: '1rem',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
      />
    </div>
  );
};

export default SearchBar;
