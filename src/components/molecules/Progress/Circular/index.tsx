import React, { forwardRef } from 'react';
import MuiCircularProgress from '@mui/material/CircularProgress';
import type { CircularProgressProps } from '@mui/material/CircularProgress';

export type Props = CircularProgressProps;

const CircularProgress = forwardRef(({ ...props }: Props, ref: React.ForwardedRef<any>) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  return <MuiCircularProgress ref={ref} {...props} />;
});
CircularProgress.displayName = 'CircularProgress';

export default CircularProgress;