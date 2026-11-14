import React from 'react';
import MuiCheckbox from '@mui/material/Checkbox';
import type { CheckboxProps as MuiCheckboxProps } from '@mui/material/Checkbox';

type CheckboxProps = MuiCheckboxProps

export const Checkbox = ({ ...props }: CheckboxProps) => {
  return (
    <MuiCheckbox
      sx={{
        padding: 0
      }}
      {...props}
    />
  );
};
Checkbox.displayName = 'Checkbox';