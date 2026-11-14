import React, { useCallback } from 'react';
import classNames from 'classnames';
import { SortDirectionsValue } from 'ConstTypes';
import { SORT_DIRECTIONS, IDX_ORD_ASC, IDX_ORD_DESC } from '@/consts';
import styles from './styles.module.scss';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

export interface BasicDThProps extends DammyComponentType {
  sort?: {
    order: SortDirectionsValue | null,
    id: string,
  },
  onClick?: (id: string | null, nextOrder: SortDirectionsValue | null) => void,
}
const BasicDTh = ({ className, sort, onClick, children, ...props }: BasicDThProps) => {
  const classes = classNames(className, {
    [styles['sort-enable']]: Boolean(sort),
  });
  const activeClasses = classNames(styles['sort-icon'], styles['sort-active']);

  const handleOnClick = useCallback(() => {
    let id = null;
    let nextOrder = null;
    if (sort) {
      id = sort.id;
      nextOrder = sort.order === SORT_DIRECTIONS[IDX_ORD_ASC] ? SORT_DIRECTIONS[IDX_ORD_DESC] : SORT_DIRECTIONS[IDX_ORD_ASC];
    }
    if (onClick) {
      onClick(id, nextOrder);
    }
  }, [sort, onClick]);
  
  return (
    <th
      className={classes}
      onClick={handleOnClick}
      {...props}
    >
      <div className={styles['th-content-wrap']}>
        {children}
        { sort ? (
            !sort.order ? (
              <ArrowUpwardIcon className={classNames(styles['sort-icon-visibility'], styles['sort-icon'])} />
            ) :
            (
              sort.order === SORT_DIRECTIONS[IDX_ORD_ASC] ? <ArrowUpwardIcon className={activeClasses} /> : <ArrowDownwardIcon  className={activeClasses} />
            )
          ) : null }
      </div>
    </th>
  );
};
BasicDTh.displayName = 'BasicDTh';
export default BasicDTh;