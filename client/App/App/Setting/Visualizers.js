import React from 'react';

import { FormGroup, FormControl, FormControlLabel } from 'material-ui/Form';
import Switch from 'material-ui/Switch';

const visualsVisablity = [
  { label: 'Bars', prop: 'barsVisiable' },
  { label: 'Wave', prop: 'waveVisiable' },
  { label: 'Bubles', prop: 'bublesVisiable' }
];

export default ({ setting, onUpdate }) => <FormGroup>
  {
    visualsVisablity.map(({ label, prop }) => <FormControlLabel key={prop}
      control={
        <Switch
          checked={setting[prop]}
          onChange={(_, x) => onUpdate(prop, x)}
        />
      }
      label={label}
    />)
  }
</FormGroup>;