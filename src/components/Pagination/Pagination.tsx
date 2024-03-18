import React from 'react';
import styles from './pagination.module.scss';
import { composeClasses } from '@/libs/utils';
import {
  CaretLeftIcon,
  CaretRightIcon,
  DotsHorizontalIcon,
} from '@radix-ui/react-icons';

export interface IPaginationType {
  limit: number;
  page: number;
  pages: number;
  total: number;
  setPageNo: Function;
  className?: string;
}

const Pagination: React.FC<IPaginationType> = ({
  setPageNo,
  page,
  pages,
  total,
  limit,
  className,
}) => {
  let pageNumbers: number[] = [];

  for (let p: number = 1; p <= Number(pages); p++) {
    pageNumbers.push(p);
  }
  return (
    <div className={composeClasses(styles.paginationContainer, className)}>
      {limit < total ? (
        <div className={styles.pagination}>
          {
            <span
              onClick={() => {
                setPageNo(page - 1);
              }}
              className={composeClasses(
                styles.navigation,
                page === 1 && styles.navDisabled,
              )}
              style={{ marginRight: '10px' }}
            >
              <CaretLeftIcon height={18} width={18} />
            </span>
          }{' '}
          &nbsp;
          {pageNumbers.map((pageNumber: number) => (
            <>
              {pages <= 7 ? (
                <>
                  &nbsp;&nbsp;
                  <span
                    onClick={() => setPageNo(pageNumber)}
                    className={composeClasses(
                      styles.navigation,
                      pageNumber === page && styles.highlightedPage,
                    )}
                    key={pageNumber}
                  >
                    <span>{pageNumber}</span>
                  </span>
                </>
              ) : (
                <>
                  {pageNumber <= 5 || pageNumber > Math.abs(pages - 1) ? (
                    <>
                      &nbsp;
                      <span
                        onClick={() => setPageNo(pageNumber)}
                        className={composeClasses(
                          styles.navigation,
                          styles.lastPage,
                          pageNumber === page && styles.highlightedPage,
                        )}
                        key={pageNumber}
                      >
                        {pageNumber}
                      </span>
                      &nbsp;
                    </>
                  ) : (
                    <>
                      {pageNumber > 5 && pageNumber < 7 ? (
                        <span className={styles.ellipse}>
                          <DotsHorizontalIcon height={6} width={24} />
                        </span>
                      ) : (
                        ''
                      )}
                    </>
                  )}
                </>
              )}
            </>
          ))}
          {
            <span
              onClick={() => {
                setPageNo(page + 1);
              }}
              className={composeClasses(
                styles.navigation,
                page === pages && styles.navDisabled,
              )}
              style={{ marginLeft: '10px' }}
            >
              <CaretRightIcon width={18} height={18} />
            </span>
          }
        </div>
      ) : (
        ''
      )}
      <span className={styles.paginationCount}>
        {total
          ? `${page * limit - limit + 1} - ${
              page === pages ? total : page * limit
            } of ${total}`
          : ''}
      </span>
    </div>
  );
};

export default Pagination;
