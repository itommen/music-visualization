import React from 'react';

import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';

export default ({ sources }) => <Select value={sources[0].deviceId}>
    {sources.map(({ deviceId, label }) => <MenuItem key={deviceId} value={deviceId}>{label}</MenuItem>)}
</Select>;