import { useState, useEffect } from 'react';

const usePagination = (totalItems: number, itemsPerPage: number) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const nextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [totalItems]);

  return {
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
  };
};

export default usePagination;
