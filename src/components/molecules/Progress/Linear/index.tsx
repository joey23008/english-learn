import React, { forwardRef } from 'react';
import MuiLinearProgress from '@mui/material/LinearProgress';
import type { LinearProgressProps } from '@mui/material/LinearProgress';

export type Props = LinearProgressProps;

const LinearProgress = forwardRef(({ ...props }: Props, ref: React.ForwardedRef<any>) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  return <MuiLinearProgress ref={ref} {...props} />;
});
LinearProgress.displayName = 'LinearProgress';

export default LinearProgress;