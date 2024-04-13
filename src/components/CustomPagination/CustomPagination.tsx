import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';

const CustomPagination = ({
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
}: any) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const maxVisiblePages = 5;

  const renderPageNumbers = () => {
    const pageNumbers = [];
    let startPage = 1;
    let endPage = Math.min(totalPages, maxVisiblePages);

    if (currentPage > 3) {
      startPage = currentPage - 2;
      endPage = Math.min(currentPage + 2, totalPages);
    }

    if (currentPage > totalPages - 2) {
      startPage = Math.max(totalPages - 4, 1);
      endPage = totalPages;
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <li key={i} className={currentPage === i ? 'active' : ''}>
          <a href="#" onClick={() => onPageChange(i)}>
            {i}
          </a>
        </li>,
      );
    }

    return pageNumbers;
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        margin: '10px 0px',
      }}
    >
      <div className="pagination">
        <ChevronLeftIcon
          onClick={() => onPageChange(currentPage - 1)}
          className={
            currentPage === 1
              ? 'disabledPaginationArrow'
              : 'enablePaginationArrow'
          }
        />
        <ul>{renderPageNumbers()}</ul>
        <ChevronRightIcon
          onClick={() => onPageChange(currentPage + 1)}
          className={
            currentPage === totalPages
              ? 'disabledPaginationArrow'
              : 'enablePaginationArrow'
          }
        />
      </div>
      <div style={{ marginTop: '1rem' }}>
        <span
          style={{
            borderRadius: 'var(--3-px, 3px)',
            border: ' 1px solid var(--neutral-neutral-300, #CED5E5)',
            padding: ' 5px 10px',
          }}
        >
          {' '}
          {currentPage}
        </span>{' '}
        <span style={{ color: 'var(--neutral-neutral-400, #A7B1C5)' }}>
          of {totalPages}
        </span>
      </div>
    </div>
  );
};

export default CustomPagination;
