import React, { forwardRef } from 'react';
import MuiDialog from '@mui/material/Dialog';
import type { DialogProps } from '@mui/material/Dialog';

const Dialog = forwardRef(({ ...props }: DialogProps, ref: React.ForwardedRef<any>) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  return <MuiDialog
    ref={ref}
    {...props}
    disableRestoreFocus // コンテンツ内のフォーカスを有効化する
    disableScrollLock
  />;
});
Dialog.displayName = 'Dialog';

export default Dialog;