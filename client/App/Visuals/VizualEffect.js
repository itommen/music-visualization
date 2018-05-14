import React from 'react';

export default ({ id, opacity, borderRadius, visable }) => <canvas className='centered' style={{ 
  opacity: visable ? opacity : 0, 
  borderRadius, 
  zIndex: 1 }} id={id} />;