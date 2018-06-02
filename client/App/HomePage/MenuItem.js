import React from 'react';

import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { Flex } from 'reflexbox';

export default ({ data: { title, icon, setting }, onNext }) => <Button variant='raised'
  style={{
    width: '200px',
    height: '200px',
    margin: '35px'
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
    <Typography variant='headline'>
      {title}
    </Typography>
  </Flex>
</Button>;
