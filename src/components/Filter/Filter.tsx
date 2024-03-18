'use client';
import React from 'react';
import styles from './filter.module.scss';

export interface ISearchComponentProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchComponent = ({
  searchQuery,
  setSearchQuery,
}: ISearchComponentProps) => {
  const handleSearchInputChange = (event: any) => {
    setSearchQuery(event.target.value);
  };

  // Render the component with the dropdowns and search input
  return (
    <div className={styles.container}>
      <input
        className={styles.customInput}
        type="text"
        value={searchQuery}
        onChange={handleSearchInputChange}
        placeholder="Search..."
      />
    </div>
  );
};

export default SearchComponent;
