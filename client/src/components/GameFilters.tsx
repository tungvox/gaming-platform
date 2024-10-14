import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface Option {
  value: string | number;
  label: string;
}

interface GameFiltersProps {
  showFilters: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  providerOptions: Option[];
  selectedProviders: string[];
  handleProviderToggle: (providerId: string) => void;
  groupOptions: Option[];
  selectedGroups: number[];
  handleGroupToggle: (groupId: number) => void;
  sorting: 'A-Z' | 'Z-A' | 'Newest';
  setSorting: (sort: 'A-Z' | 'Z-A' | 'Newest') => void;
  columns: number;
  handleColumnChange: (value: number) => void;
  totalFilteredGames: number;
  resetFilters: () => void;
}

const GameFilters: React.FC<GameFiltersProps> = ({
  showFilters,
  searchTerm,
  setSearchTerm,
  providerOptions,
  selectedProviders,
  handleProviderToggle,
  groupOptions,
  selectedGroups,
  handleGroupToggle,
  sorting,
  setSorting,
  columns,
  handleColumnChange,
  totalFilteredGames,
  resetFilters,
}) => {
  return (
    <div className={`filters-overlay ${showFilters ? 'show' : ''}`}>
      <div className="filters">
        <div className="search-container">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search"
          />
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
        </div>
        <h3>Providers</h3>
        <div className="filter-buttons provider-buttons">
          {providerOptions.map(provider => (
            <button
              key={provider.value}
              onClick={() => handleProviderToggle(provider.value.toString())}
              className={selectedProviders.includes(provider.value.toString()) ? 'active' : ''}
            >
              {provider.label}
            </button>
          ))}
        </div>
        <h3>Game groups</h3>
        <div className="filter-buttons group-buttons">
          {groupOptions.map(group => (
            <button
              key={group.value}
              onClick={() => handleGroupToggle(group.value as number)}
              className={selectedGroups.includes(group.value as number) ? 'active' : ''}
            >
              {group.label}
            </button>
          ))}
        </div>
        <h3>Sorting</h3>
        <div className="filter-buttons sorting-buttons">
          {['A-Z', 'Z-A', 'Newest'].map(sort => (
            <button
              key={sort}
              onClick={() => setSorting(sort as 'A-Z' | 'Z-A' | 'Newest')}
              className={sorting === sort ? 'active' : ''}
            >
              {sort}
            </button>
          ))}
        </div>
        <h3>Columns</h3>
        <div className="columns-slider">
          <button 
            onClick={() => handleColumnChange(2)} 
            className={columns === 2 ? 'active' : ''}
          >
            2
          </button>
          <button 
            onClick={() => handleColumnChange(3)} 
            className={columns === 3 ? 'active' : ''}
          >
            3
          </button>
          <button 
            onClick={() => handleColumnChange(4)} 
            className={columns === 4 ? 'active' : ''}
          >
            4
          </button>
        </div>
        <div className="games-amount-reset">
          <span>Games amount: {totalFilteredGames}</span>
          <button onClick={resetFilters} className="reset-button">Reset</button>
        </div>
      </div>
    </div>
  );
};

export default GameFilters;
