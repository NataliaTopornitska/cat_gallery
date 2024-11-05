import React, { useState, useEffect, useRef } from 'react';
import { Cat, Breed } from './types';
import CatDetail from './CatDetail';
import Favorites from './Favorites';
import './App.css';

const API_KEY =
  'live_kVP7z70R1hzCexygnoGDeK581LzCtaamZULWHCW53C9qJHCeTrTDNunxmLniGne5';
const BASE_URL = 'https://api.thecatapi.com/v1';

const App: React.FC = () => {
  const [cats, setCats] = useState<Cat[]>([]);
  const [selectedCat, setSelectedCat] = useState<Cat | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedBreed, setSelectedBreed] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favoriteCats, setFavoriteCats] = useState<Cat[]>([]);
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const catsPerPage = 12;
  const [showFavorites, setShowFavorites] = useState<boolean>(false);

  const debounceTimeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const fetchBreeds = async () => {
      const response = await fetch(`${BASE_URL}/breeds`, {
        headers: {
          'x-api-key': API_KEY,
        },
      });
      const data = await response.json();

      const breedsWithImages = data.filter((breed: any) =>
        cats.some(cat => cat.breeds.some(catBreed => catBreed.id === breed.id)),
      );

      const fetchedBreeds: Breed[] = breedsWithImages.map((item: any) => ({
        id: item.id,
        name: item.name,
      }));

      setBreeds(fetchedBreeds);
    };

    fetchBreeds();
  }, [cats]);

  const toggleFavoriteCat = (cat: Cat) => {
    setFavoriteCats(prevFavorites =>
      prevFavorites.some(fav => fav.id === cat.id)
        ? prevFavorites.filter(fav => fav.id !== cat.id)
        : [...prevFavorites, cat],
    );
  };

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favoriteCats');

    if (storedFavorites) {
      setFavoriteCats(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favoriteCats', JSON.stringify(favoriteCats));
  }, [favoriteCats]);

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const breed = params.get('breed') || 'All';
      const page = parseInt(params.get('page') || '1', 10);
      const catId = params.get('cat');
      const search = params.get('search') || '';

      setSelectedBreed(breed);
      setCurrentPage(page);
      setSearchQuery(search);
      setShowFavorites(params.get('showFavorites') === 'true');

      if (catId) {
        const fetchcatById = async () => {
          try {
            const response = await fetch(
              `https://www.thecatdb.com/api/json/v1/1/lookup.php?i=${catId}`,
            );
            const data = await response.json();

            setSelectedCat(data.Cats ? data.Cats[0] : null);
          } catch (error) {}
        };

        fetchcatById();
      } else {
        setSelectedCat(null);
      }
    };

    handlePopState();
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    const fetchCats = async () => {
      setLoading(true);
      try {
        const storedCats = localStorage.getItem('catsWithBreeds');

        if (storedCats) {
          setCats(JSON.parse(storedCats));
          setLoading(false);

          return;
        }

        const response = await fetch(
          `${BASE_URL}/images/search?limit=100&has_breeds=1`,
          {
            headers: {
              'x-api-key': API_KEY,
            },
          },
        );
        const data = await response.json();
        const catsWithBreeds = data.filter(
          (cat: Cat) => cat.breeds && cat.breeds.length > 0,
        );

        setCats(catsWithBreeds);
        localStorage.setItem('catsWithBreeds', JSON.stringify(catsWithBreeds));
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    const performFetchCats = () => {
      if (searchQuery === '') {
        fetchCats();
      } else {
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = window.setTimeout(() => {
          fetchCats();
        }, 300);
      }
    };

    performFetchCats();

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const filteredCats = cats.filter(cat => {
    const hasBreeds = cat.breeds && cat.breeds.length > 0;

    if (!hasBreeds) {
      return false;
    }

    const matchesBreed =
      selectedBreed === 'All' ||
      (cat.breeds && cat.breeds[0].name === selectedBreed);

    const matchesSearch =
      searchQuery === '' ||
      (cat.breeds &&
        cat.breeds[0].name.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesBreed && matchesSearch;
  });

  const totalPages = Math.ceil(filteredCats.length / catsPerPage);

  const currentCats = filteredCats.slice(
    (currentPage - 1) * catsPerPage,
    currentPage * catsPerPage,
  );

  const updateURLParams = (
    breed: string,
    page: number,
    catId?: string,
    search?: string,
    showFavoritesFlag?: boolean,
  ) => {
    const params = new URLSearchParams();

    params.set('breed', breed);
    params.set('page', page.toString());
    if (catId) {
      params.set('cat', catId);
    }

    if (search) {
      params.set('search', search);
    }

    if (showFavoritesFlag !== undefined) {
      params.set('showFavorites', showFavorites.toString());
    }

    window.history.pushState({}, '', `?${params.toString()}`);
  };

  const handleCatselect = (cat: Cat) => {
    setSelectedCat(cat);
    updateURLParams(selectedBreed, currentPage, cat.id, searchQuery);
  };

  const handleBreedChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const breed = event.target.value;

    setSelectedBreed(breed);
    setSelectedCat(null);
    setCurrentPage(1);
    setSearchQuery('');
    setShowFavorites(false);
    updateURLParams(breed, 1);

    localStorage.setItem('selectedBreed', breed);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURLParams(selectedBreed, page, undefined, searchQuery, showFavorites);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;

    setSearchQuery(query);
    setCurrentPage(1);
    updateURLParams(selectedBreed, 1, undefined, query);
  };

  const renderPagination = () => {
    if (selectedBreed !== 'All' && cats.length <= catsPerPage) {
      return null;
    }

    const paginationItems = [];
    const maxVisiblePages = 7;

    if (totalPages <= 1) {
      return null;
    }

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        paginationItems.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={currentPage === i ? 'active' : ''}
          >
            {i}
          </button>,
        );
      }
    } else {
      for (let i = 1; i <= 3; i++) {
        paginationItems.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={currentPage === i ? 'active' : ''}
          >
            {i}
          </button>,
        );
      }

      if (currentPage > 4) {
        paginationItems.push(<span key="ellipsis-start">...</span>);
      }

      for (
        let i = Math.max(4, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        paginationItems.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={currentPage === i ? 'active' : ''}
          >
            {i}
          </button>,
        );
      }

      if (currentPage < totalPages - 3) {
        paginationItems.push(<span key="ellipsis-end">...</span>);
      }

      paginationItems.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={currentPage === totalPages ? 'active' : ''}
        >
          {totalPages}
        </button>,
      );
    }

    return (
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &#60;
        </button>
        {paginationItems}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &#62;
        </button>
      </div>
    );
  };

  useEffect(() => {
    const storedBreed = localStorage.getItem('selectedBreed');

    if (storedBreed) {
      setSelectedBreed(storedBreed);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedBreed', selectedBreed);
  }, [selectedBreed]);

  const handleRemoveFavorite = (catToRemove: Cat) => {
    setFavoriteCats(prevCats => {
      const updatedCats = prevCats.filter(cat => cat.id !== catToRemove.id);

      localStorage.setItem('favoriteCats', JSON.stringify(updatedCats));

      return updatedCats;
    });
  };

  return (
    <div className="App">
      <h1>Cats App</h1>

      <nav>
        <button
          className="button-style"
          onClick={() => {
            setSelectedCat(null);
            setShowFavorites(false);
            setSelectedBreed('All');
            setCurrentPage(1);
            setSearchQuery('');
            updateURLParams('All', 1);
          }}
        >
          All Cats
        </button>
        <button
          className="button-style"
          onClick={() => {
            setSelectedCat(null);
            setShowFavorites(true);
            setCurrentPage(1);
            updateURLParams(selectedBreed, 1, undefined, undefined, true);
          }}
        >
          Favorites
        </button>
        <p className="selected-cats-count">
          Number of Selected Cats: {favoriteCats.length}
        </p>{' '}
      </nav>

      {selectedCat ? (
        <div>
          <CatDetail
            cat={selectedCat}
            onBack={() => setSelectedCat(null)}
            numberOfSelectedCats={favoriteCats.length}
            isFavorites={showFavorites}
          />
          <button
            className={`favorite-button ${
              favoriteCats.some(fav => fav.id === selectedCat.id)
                ? 'remove-button'
                : 'add-button'
            }`}
            onClick={() => toggleFavoriteCat(selectedCat)}
          >
            {favoriteCats.some(fav => fav.id === selectedCat.id)
              ? 'Remove from Favorites'
              : 'Add to Favorites'}
          </button>
        </div>
      ) : (
        <>
          {!showFavorites && (
            <div className="search-filter-container">
              <label htmlFor="breed-select">Select Breeds:</label>
              <select
                id="breed-select"
                value={selectedBreed}
                onChange={handleBreedChange}
              >
                <option value="All">All</option>
                {breeds.map(breed => (
                  <option key={breed.id} value={breed.name}>
                    {breed.name}
                  </option>
                ))}
              </select>

              <label htmlFor="search-input">Search:</label>
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search Cats..."
              />
            </div>
          )}

          {loading ? (
            <p>Loading...</p>
          ) : showFavorites ? (
            <Favorites
              favoriteCats={favoriteCats}
              onCatSelect={handleCatselect}
              onRemoveFavorite={handleRemoveFavorite}
            />
          ) : (
            <div className="cat-container">
              {currentCats.map(cat => (
                <div
                  key={cat.id}
                  onClick={() => handleCatselect(cat)}
                  className="cat-card-preview"
                >
                  <img src={cat.url} alt={cat.strcat} />
                  <h2>{cat.strcat}</h2>
                  <p
                    className={`breed-text ${cat.breeds && cat.breeds.length > 0 ? 'known-breed' : 'unknown-breed'}`}
                  >
                    Breed:{' '}
                    {cat.breeds &&
                    Array.isArray(cat.breeds) &&
                    cat.breeds.length > 0
                      ? cat.breeds[0].name
                      : 'Unknown'}
                  </p>
                  <button
                    className={`favorite-button ${
                      favoriteCats.some(fav => fav.id === cat.id)
                        ? 'remove-button'
                        : 'add-button'
                    }`}
                    onClick={e => {
                      e.stopPropagation();
                      toggleFavoriteCat(cat);
                    }}
                  >
                    {favoriteCats.some(fav => fav.id === cat.id)
                      ? 'Remove from Favorites'
                      : 'Add to Favorites'}
                  </button>
                </div>
              ))}
            </div>
          )}
          {!loading && !showFavorites && renderPagination()}
        </>
      )}
    </div>
  );
};

export default App;
