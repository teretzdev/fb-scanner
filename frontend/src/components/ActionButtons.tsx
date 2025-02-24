import React from 'react';

interface ActionButtonsProps {
  onRefresh: () => void;
  onScrape: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onRefresh, onScrape }) => {
  return (
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
      <button
        onClick={onRefresh}
        style={{
          padding: '0.5rem 1rem',
          fontSize: '1rem',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Refresh
      </button>
      <button
        onClick={onScrape}
        style={{
          padding: '0.5rem 1rem',
          fontSize: '1rem',
          backgroundColor: '#28a745',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Scrape
      </button>
    </div>
  );
};

export default ActionButtons;
