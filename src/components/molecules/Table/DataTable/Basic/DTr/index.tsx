import React from 'react';

const BasicDTr = ({ children, ...props }: DammyComponentType) => <tr {...props}>{children}</tr>;
BasicDTr.displayName = 'BasicDTr';
export default BasicDTr;