import React, { forwardRef } from 'react';
import MuiTextField from '@mui/material/TextField';

export type Props = {
  [key: string]: any, // eslint-disable-line @typescript-eslint/no-explicit-any
}

const TextField = forwardRef(({ className, ...props }: Props, ref: React.ForwardedRef<any>) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  return <MuiTextField
    className={className}
    size='small'
    ref={ref}
    {...props}
  />;
});
TextField.displayName = 'TextField';

export default TextField;