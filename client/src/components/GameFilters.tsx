import React, { memo } from 'react';

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
  setShowFilters: (show: boolean) => void;
}

const GameFilters: React.FC<GameFiltersProps> = memo(({
  showFilters,
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
    <div className={`filters-container ${showFilters ? 'show' : ''}`}>
      <div className="filters">
        <h3>Providers</h3>
        <div className="filter-buttons">
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
        <h3>Groups</h3>
        <div className="filter-buttons">
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
});

export default GameFilters;
