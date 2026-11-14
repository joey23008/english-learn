import React, { forwardRef } from 'react';
import MuiPagination from '@mui/material/Pagination';
import styles from './styles.module.scss';
import type { PaginationProps } from '@mui/material/Pagination';
import classNames from 'classnames';

const Pagination = forwardRef(({ className, ...props }: PaginationProps, ref: React.ForwardedRef<any>) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  return <MuiPagination className={classNames(className, styles.pagination)} ref={ref} {...props} />;
});
Pagination.displayName = 'Pagination';

export default Pagination;