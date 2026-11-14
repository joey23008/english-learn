import React, { forwardRef } from 'react';
import MuiDialogContent from '@mui/material/DialogContent';
import type { DialogContentProps } from '@mui/material/DialogContent';
import styles from './styles.module.scss';
import classNames from 'classnames';

const DialogContent = forwardRef(({ className, ...props }: DialogContentProps, ref: React.ForwardedRef<any>) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  return (
    <MuiDialogContent
      className={classNames(className, styles['dialog-content'])}
      dividers
      ref={ref}
      {...props}
    />
  );
});
DialogContent.displayName = 'DialogContent';

export default DialogContent;