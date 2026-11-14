import React, { memo } from 'react';
import MuiFade from '@mui/material/Fade';
import type { FadeProps } from '@mui/material/Fade';

export type Props = FadeProps;

const Fade = memo(({ ...props }: Props) => {
  return <MuiFade {...props} />;
});
Fade.displayName = 'Fade';

export default Fade;