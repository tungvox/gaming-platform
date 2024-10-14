import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/GameList.scss';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import debounce from 'lodash/debounce';

interface Game {
  id: number;
  name: string;
  provider: number;
  cover: string;
  coverLarge: string;
  date: string;
}

interface GameGroup {
  id: number;
  name: string;
  games: number[];
}

interface Option {
  value: string | number;
  label: string;
}

interface Provider {
  id: number;
  name: string;
  logo: string;
}

const GameList: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [gameGroups, setGameGroups] = useState<GameGroup[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
  const [columns, setColumns] = useState(4);
  const [sorting, setSorting] = useState<'A-Z' | 'Z-A' | 'Newest'>('A-Z');
  const { token } = useAuth();
  const [providerOptions, setProviderOptions] = useState<Option[]>([]);
  const [groupOptions, setGroupOptions] = useState<Option[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [gamesPerPage] = useState(12);
  const [totalFilteredGames, setTotalFilteredGames] = useState<number>(0);
  const [allFilteredGames, setAllFilteredGames] = useState<Game[]>([]);

  const debouncedSetColumns = useMemo(
    () => debounce((value: number) => setColumns(value), 50),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSetColumns.cancel();
    };
  }, [debouncedSetColumns]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get('http://localhost:3001/games', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGames(response.data.games);
        setGameGroups(response.data.groups);
        
        const providerOptions = response.data.providers.map((provider: Provider): Option => ({ 
          value: provider.id.toString(), 
          label: provider.name 
        }));
        setProviderOptions(providerOptions);
        setGroupOptions(response.data.groups.map((group: GameGroup): Option => ({ value: group.id, label: group.name })));
      } catch (error) {
        console.error('Failed to fetch games', error);
      }
    };

    fetchGames();
  }, [token]);

  useEffect(() => {
    let filtered = games.filter((game) => {
      const nameMatch = game.name.toLowerCase().includes(searchTerm.toLowerCase());
      const providerMatch = selectedProviders.length === 0 || selectedProviders.includes(game.provider.toString());
      const groupMatch = selectedGroups.length === 0 || gameGroups.some(group => 
        selectedGroups.includes(group.id) && group.games.includes(game.id)
      );
      const belongsToAnyGroup = gameGroups.some(group => group.games.includes(game.id));
      return nameMatch && providerMatch && groupMatch && belongsToAnyGroup;
    });

    filtered.sort((a, b) => {
      if (sorting === 'A-Z') return a.name.localeCompare(b.name);
      if (sorting === 'Z-A') return b.name.localeCompare(a.name);
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    setAllFilteredGames(filtered);
    setTotalFilteredGames(filtered.length);
    setCurrentPage(0); 
  }, [games, searchTerm, selectedProviders, selectedGroups, gameGroups, sorting]);

  useEffect(() => {
    const offset = currentPage * gamesPerPage;
    setFilteredGames(allFilteredGames.slice(offset, offset + gamesPerPage));
  }, [allFilteredGames, currentPage, gamesPerPage]);

  const handleProviderToggle = (providerId: string) => {
    setSelectedProviders(prev => 
      prev.includes(providerId) 
        ? prev.filter(p => p !== providerId)
        : [...prev, providerId]
    );
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedProviders([]);
    setSelectedGroups([]);
    setSorting('A-Z');
    setColumns(4);
  };

  const handleGroupToggle = (groupId: number) => {
    setSelectedGroups(prev => 
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleColumnChange = (value: number) => {
    setColumns(value);
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  const memoizedGameGrid = useMemo(() => (
    <div className="game-grid-wrapper">
      <div className={`game-grid columns-${columns}`}>
        {filteredGames.map(game => (
          <div key={game.id} className="game-card">
            <img src={game.cover} alt={game.name} />
          </div>
        ))}
      </div>
    </div>
  ), [filteredGames, columns]);

  return (
    <div className="game-list-container">
      <div className="mobile-header">
        <div className="search-container">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search"
          />
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
        </div>
        <button 
          className="toggle-filters-button"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'Hide filters' : 'Show filters'}
        </button>
      </div>
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
      <div className="game-grid-section">
        {allFilteredGames.length > 0 ? (
          <>
            {memoizedGameGrid}
            {Math.ceil(allFilteredGames.length / gamesPerPage) > 1 && (
              <ReactPaginate
                previousLabel={'Previous'}
                nextLabel={'Next'}
                breakLabel={'...'}
                pageCount={Math.ceil(allFilteredGames.length / gamesPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageChange}
                containerClassName={'pagination'}
                activeClassName={'active'}
                forcePage={currentPage}
              />
            )}
          </>
        ) : (
          <div className="no-games-message">
            No games match your search. Please try different filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default GameList;
