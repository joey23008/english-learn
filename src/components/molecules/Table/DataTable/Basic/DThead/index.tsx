import React from 'react';

const BasicDThead = ({ children, ...props }: DammyComponentType) => <thead {...props}>{children}</thead>;
BasicDThead.displayName = 'BasicDThead';
export default BasicDThead;