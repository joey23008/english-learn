import React, { forwardRef } from 'react';
import MuiDialogActions from '@mui/material/DialogActions';
import type { DialogActionsProps } from '@mui/material/DialogActions';

const DialogActions = forwardRef(({ ...props }: DialogActionsProps, ref: React.ForwardedRef<any>) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  return <MuiDialogActions ref={ref} {...props} />;
});
DialogActions.displayName = 'DialogActions';

export default DialogActions;