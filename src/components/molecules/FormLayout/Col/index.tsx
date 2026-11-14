import React from 'react';
import classNames from 'classnames';
import styles from './styles.module.scss';

const Col = ({ className, children, ...props }: DammyComponentType) => (
  <div
    className={classNames(className, styles.col)}
    {...props}
  >
    {children}
  </div>
);
Col.displayName = 'Col';
export default Col;