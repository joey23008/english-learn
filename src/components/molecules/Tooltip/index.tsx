import React from 'react';
import MuiTooltip from '@mui/material/Tooltip';
import type { TooltipProps as MuiTooltipProps } from '@mui/material/Tooltip';

type TooltipProps = MuiTooltipProps

export const Tooltip = ({ ...props }: TooltipProps) => {
  return (
    <MuiTooltip
      placement="top-start"
      slotProps={{
        popper: {
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, -14],
              },
            },
          ],
        },
      }}
      {...props}
    />
  );
};
Tooltip.displayName = 'Tooltip';