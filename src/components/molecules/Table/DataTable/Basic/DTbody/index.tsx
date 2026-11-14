import React from 'react';

const BasicDTbody = ({ children, ...props }: DammyComponentType) => <tbody {...props}>{children}</tbody>;
BasicDTbody.displayName = 'BasicDTbody';
export default BasicDTbody;