import React, { Component } from 'react';

import { Flex } from 'reflexbox';
import Dialog, { DialogTitle, DialogContent } from 'material-ui/Dialog';
import Typography from 'material-ui/Typography';
import Tabs, { Tab } from 'material-ui/Tabs';

import FilterFramesIcon from 'material-ui-icons/FilterFrames';
import BubbleChartIcon from 'material-ui-icons/BubbleChart';
import PermCameraMicIcon from 'material-ui-icons/PermCameraMic';

import FrameSetting from './Frame';
import VisualizersSetting from './Visualizers';
import OtherSetting from './OtherSetting';

import 'react-input-range/lib/css/index.css';

export default class Setting extends Component {
  constructor() {
    super();

    this.state = {
      index: 0
    }

    this.handleChangeIndex = this.handleChangeIndex.bind(this);
  }

  handleChangeIndex(event, index) {
    this.setState({ index });
  };

  render() {
    const { onUpdate, children, isOpen, onClose, setting } = this.props;
    const { index } = this.state;

    return <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Setting</DialogTitle>
      <DialogContent style={{
        flex: '1 1 auto',
      }}>
        <Tabs
          value={index}
          scrollable
          scrollButtons="on"
          onChange={this.handleChangeIndex}
          indicatorColor="primary"
          textColor="primary"
          fullWidth>
          <Tab label="Layout" icon={<FilterFramesIcon />} />
          <Tab label="Visuals" icon={<BubbleChartIcon />} />
          <Tab label="Inputs" icon={<PermCameraMicIcon />} />
        </Tabs>
        <Flex auto column>
          {index === 0 ? <FrameSetting key='frame' setting={setting} onUpdate={onUpdate} /> : null}
          {index === 1 ? <VisualizersSetting key='vizualize' setting={setting} onUpdate={onUpdate} /> : null}
          {index === 2 ? <OtherSetting key='other' children={children} /> : null}
        </Flex>
      </DialogContent>
    </Dialog >
  }
};
