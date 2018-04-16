import React from 'react';
import { render } from 'react-dom';

import injectTapEventPlugin from 'react-tap-event-plugin';

import App from './App';

// until material - ui bug would be fixed ..
injectTapEventPlugin();

render(
  <App />,
  document.getElementById('root')
);
