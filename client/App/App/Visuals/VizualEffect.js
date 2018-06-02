import React from 'react';

export default ({ id, opacity, borderRadius, visable, flipped }) => <canvas className='centered' style={{
  opacity: visable ? opacity : 0, 
  borderRadius, 
  zIndex: 1,
transform: flipped ? 'scale(-1) translate(50%, 0)' : 'translate(-50%, 0'}} id={id} />;