import React, { forwardRef } from 'react';
import MuiRadio from '@mui/material/Radio';
import type { RadioProps as MuiRadioProps } from '@mui/material/Radio';

type RadioProps = MuiRadioProps

export const Radio = forwardRef<any, RadioProps>(({ ...props }, ref) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  return (
    <MuiRadio
      sx={{
        padding: '0'
      }}
      {...props}
      ref={ref}
    />
  );
});
Radio.displayName = 'Radio';