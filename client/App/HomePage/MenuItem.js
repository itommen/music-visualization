import React from 'react';

import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { Flex } from 'reflexbox';

export default ({ data: { title, background, icon, setting }, onNext }) => <Button variant='raised'
  style={{
    width: '200px',
    height: '200px',
    margin: '35px',
      background:`url(Images/${background})`,
      boxShadow: '2px 2px 12px black',
      backgroundSize: 'cover'
  }}
  onClick={() => onNext({
    activeState: 1,
    ...setting
  })}>
  <Flex
    align='center'
    justify='center'
    column
    auto
  >
    {icon}
    <span className='menu-item-button-description' variant='headline'>
      {title}
    </span>
  </Flex>
</Button>;
