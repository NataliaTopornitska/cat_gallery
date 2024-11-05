import React, { useState, useEffect, useMemo } from 'react';
import { Cat, FavoritesProps } from './types';
import usePagination from './usePagination';

const Favorites: React.FC<FavoritesProps> = ({
  favoriteCats: initialFavoriteCats,
  onCatSelect,
  onRemoveFavorite,
}) => {
  const [favoriteCats, setFavoriteCats] = useState<Cat[]>(initialFavoriteCats);
  const catsPerPage = 10;

  const { currentPage, totalPages, goToPage, nextPage, prevPage } =
    usePagination(favoriteCats.length, catsPerPage);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteCats');

    if (savedFavorites) {
      setFavoriteCats(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favoriteCats', JSON.stringify(favoriteCats));
  }, [favoriteCats]);

  const handleRemoveFavorite = (catToRemove: Cat) => {
    setFavoriteCats(prevCats =>
      prevCats.filter(cat => cat.id !== catToRemove.id),
    );
    onRemoveFavorite(catToRemove);
  };

  useEffect(() => {
    const savedPage = localStorage.getItem('currentPage');

    if (savedPage) {
      goToPage(parseInt(savedPage, 10));
    }
  }, [goToPage]);

  useEffect(() => {
    localStorage.setItem('currentPage', currentPage.toString());
  }, [currentPage]);

  const currentCats = useMemo(() => {
    const indexOfLastCat = currentPage * catsPerPage;
    const indexOfFirstCat = indexOfLastCat - catsPerPage;

    return favoriteCats.slice(indexOfFirstCat, indexOfLastCat);
  }, [favoriteCats, currentPage, catsPerPage]);

  if (favoriteCats.length === 0) {
    return <p>No favorite cats selected</p>;
  }

  return (
    <div className="favorites">
      <h2 className="favorites-head">Your Favorite Cats</h2>

      <div className="flex-container">
        <div className="cat-container">
          {currentCats.map(cat => (
            <div
              key={cat.id}
              onClick={() => onCatSelect(cat)}
              className="cat-card-preview"
            >
              <img src={cat.url} alt={cat.breeds[0]?.name || 'Unknown'} />
              <h2>{cat.breeds[0]?.name || 'Unknown'}</h2>
              <button
                className="remove-favorite-button"
                onClick={e => {
                  e.stopPropagation();
                  handleRemoveFavorite(cat);
                }}
              >
                Remove from Favorites
              </button>
            </div>
          ))}
        </div>
      </div>

      {favoriteCats.length > catsPerPage && (
        <div className="pagination">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}
          >
            &laquo;
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => goToPage(i + 1)}
              className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}
          >
            &raquo;
          </button>
        </div>
      )}
    </div>
  );
};

export default Favorites;
