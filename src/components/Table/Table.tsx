import React, { Ref } from 'react';
import { composeClasses } from '../../libs/utils';
import styles from './table.module.scss';

const Table: React.FC<{
  className?: string;
  id?: string;
  ref?: Ref<HTMLTableCellElement>;
  data: any[];
  setOrder?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  loading?: boolean;
  headers:
    | {
        className?: string;
        name?: string;
        id: number;
        label: string | JSX.Element;
        order?: string;
      }[]
    | any[];
  renderRow: (row: any, index: number) => any;
  isScrollable?: boolean;
}> = ({
  className,
  id,
  data = [],
  headers = [],
  renderRow,
  setOrder,
  loading,
  isScrollable,
}) => {
  const table = (
    <table
      cellSpacing="0"
      cellPadding="0"
      className={composeClasses(className, styles.table)}
      id={id}
    >
      <thead style={isScrollable ? { position: 'sticky', top: '0' } : {}}>
        <tr>
          {headers.map((header) => (
            <th key={header.id} className={composeClasses(header.className)}>
              {header.id !== 0 ? (
                <>
                  <span onClick={setOrder}>{header.label}</span>
                </>
              ) : (
                <span>{header.label}</span>
              )}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {(Array.isArray(data) &&
          data.length &&
          data.map((rowItem: any, index: number) =>
            renderRow(rowItem, index),
          )) || (
          <tr>
            <td colSpan={headers.length}>
              <h3 style={{ textAlign: 'center' }}>No record found</h3>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );

  return isScrollable ? (
    <div style={{ height: '200px', overflow: 'scroll' }}>{table}</div>
  ) : (
    table
  );
};

export default Table;
