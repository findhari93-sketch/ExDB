import React, { useRef, useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import './SearchToggle.css';

interface SearchToggleProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchToggle: React.FC<SearchToggleProps> = ({ value, onChange }) => {
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-expand if there is a pre-existing search value
  useEffect(() => {
    if (value) setExpanded(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Focus input when expanded
  useEffect(() => {
    if (expanded) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [expanded]);

  const handleCollapse = () => {
    if (!value) {
      setExpanded(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onChange('');
      setExpanded(false);
    }
  };

  const handleClear = () => {
    onChange('');
    setExpanded(false);
  };

  return (
    <div className={`search-toggle ${expanded ? 'search-toggle--expanded' : ''}`}>
      {expanded ? (
        <div className="search-toggle-field" onKeyDown={handleKeyDown}>
          <Search size={14} className="search-toggle-icon" />
          <input
            ref={inputRef}
            type="text"
            className="search-toggle-input"
            placeholder="Search supplier, ID..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={handleCollapse}
            aria-label="Search requests"
          />
          {value && (
            <button
              className="search-toggle-clear"
              onClick={handleClear}
              onMouseDown={(e) => e.preventDefault()}
              aria-label="Clear search"
            >
              <X size={12} />
            </button>
          )}
        </div>
      ) : (
        <button
          className="search-toggle-btn"
          onClick={() => setExpanded(true)}
          aria-label="Open search"
          title="Search"
        >
          <Search size={16} strokeWidth={2} />
        </button>
      )}
    </div>
  );
};

export default SearchToggle;
