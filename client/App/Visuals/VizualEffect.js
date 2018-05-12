import React from 'react';

const visualizeStyle = {
  zIndex: 1,
  borderRadius: '38px',
};

export default ({ id, opacity }) => <canvas className='centered' style={{ opacity, ...visualizeStyle }} id={id} />;