import React, { useCallback } from 'react';
import { useRouter } from 'next/router';
import styles from './searchInput.module.scss';

const SearchInput: React.FC<{
  placeholder?: string;
}> = ({ placeholder }) => {
  const router = useRouter();
  const onSearch = useCallback((_e: any) => {
    const searchInput = document.getElementById(
      'searchApplication',
    ) as HTMLInputElement;
    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          searchTerm: searchInput.value,
        },
      },
      undefined,
      { scroll: false },
    );
  }, []);

  return (
    <input
      className={styles.search}
      placeholder={placeholder || 'Search'}
      defaultValue={router.query.searchTerm}
      type="search"
      id="searchApplication"
      onChange={(e) => onSearch(e)}
    />
  );
};

export default SearchInput;
