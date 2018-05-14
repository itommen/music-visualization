import React, { Fragment } from 'react';

import { Flex } from 'reflexbox';
import Typography from 'material-ui/Typography';
import InputRange from 'react-input-range';

const frameTypeBaseStyle = (selected, value) => ({
  width: '30px',
  height: '30px',
  backgroundColor: 'gray',
  border: '2px solid',
  borderColor: selected === value ? 'green' : 'black'
});

const frameTypes = ['0', '10%', '0 20%', '100%'];
const backgroundColors = ['#4a4545', '#dfdfdf']

export default ({ setting, onUpdate }) => <Fragment>
  <Flex auto style={{ padding: '30px 0' }}>
    <span>Opacity</span>
    <InputRange
      maxValue={100}
      minValue={0}
      value={setting.opacity * 100}
      onChange={x => onUpdate('opacity', x / 100)} />
  </Flex>
  <Flex auto justify='space-between'>
    <Typography>Frame Type</Typography>
    {
      frameTypes.map(x => <div key={x} style={{ ...frameTypeBaseStyle(setting.borderRadius, x), borderRadius: x }} onClick={() => onUpdate('borderRadius', x)}></div>)
    }
  </Flex>
  <Flex auto justify='space-between' style={{ paddingTop: '30px' }}>
    <Typography>Background</Typography>
    {
      backgroundColors.map(x => <div key={x} style={{ ...frameTypeBaseStyle(setting.background, x), background: x }} onClick={() => onUpdate('background', x)}></div>)
    }
    <div style={{ ...frameTypeBaseStyle(setting.background, 'colorchange'), animation: 'colorchange 10s infinite' }} onClick={() => onUpdate('background', 'colorchange')}></div>
  </Flex>
</Fragment>;