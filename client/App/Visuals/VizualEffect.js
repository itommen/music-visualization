import React from 'react';

// TODO: change from hard coded pixels position to relative centered position
export default ({ id, opacity, borderRadius, visable, flipped }) => <canvas className='centered' style={{
  opacity: visable ? opacity : 0, 
  borderRadius, 
  zIndex: 1,
transform: flipped ? 'scale(-1)' : 'scaleY(1)',
left:'362px'}} id={id} />;