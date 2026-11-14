import React, { forwardRef } from 'react';
import MuiAlert from '@mui/material/Alert';
import type { AlertProps } from '@mui/material/Alert';

const Alert = forwardRef(({ ...props }: AlertProps, ref: React.ForwardedRef<any>) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  return <MuiAlert ref={ref} {...props} />;
});
Alert.displayName = 'Alert';

export default Alert;