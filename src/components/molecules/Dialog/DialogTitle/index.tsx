import React, { forwardRef } from 'react';
import MuiDialogTitle from '@mui/material/DialogTitle';
import type { DialogTitleProps } from '@mui/material/DialogTitle';
import styles from './styles.module.scss';

const DialogTitle = forwardRef(({ ...props }: DialogTitleProps, ref: React.ForwardedRef<any>) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  return <MuiDialogTitle
    className={styles['dialog-title']}
    ref={ref}
    {...props}
  />;
});
DialogTitle.displayName = 'DialogTitle';

export default DialogTitle;