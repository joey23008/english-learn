import React, { forwardRef } from 'react';
import MuiPopper from '@mui/material/Popper';
import type { PopperProps } from '@mui/material/Popper';

export type Props = PopperProps;

const Popper = forwardRef(({ ...props }: Props, ref: React.ForwardedRef<any>) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  return <MuiPopper ref={ref} {...props} />;
});
Popper.displayName = 'Popper';

export default Popper;