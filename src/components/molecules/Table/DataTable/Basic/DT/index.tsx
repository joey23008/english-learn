import React, { forwardRef } from 'react';
import classNames from 'classnames';
import styles from './styles.module.scss';


type BasicDTProps = {
  className?: string,
  children: React.ReactNode,
  [key: string]: any, // eslint-disable-line @typescript-eslint/no-explicit-any
}
const BasicDT = forwardRef<any, BasicDTProps>(({ className, children, ...props }, ref) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  const classes = classNames(styles.table, className);
  return <table className={classes} ref={ref} {...props}>{children}</table>;
});
BasicDT.displayName = 'BasicDT';
export default BasicDT;