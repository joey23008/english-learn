import React, { forwardRef } from 'react';
import MuiButton from '@mui/material/Button';
import type { ButtonProps } from '@mui/material/Button';

export type Props = ButtonProps;

const Button = forwardRef(({ ...props }: Props, ref: React.ForwardedRef<any>) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  return <MuiButton ref={ref} {...props} />;
});
Button.displayName = 'Button';

export default Button;