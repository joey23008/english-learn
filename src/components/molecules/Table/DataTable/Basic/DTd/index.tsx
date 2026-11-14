import React, { forwardRef } from 'react';

const BasicDTd = forwardRef<any, DammyComponentType>(({ children, ...props }, ref) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
  <td {...props} ref={ref}>{children}</td>
));
BasicDTd.displayName = 'BasicDTd';
export default BasicDTd;