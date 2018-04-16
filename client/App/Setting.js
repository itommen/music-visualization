import React from 'react';

import { Flex } from 'reflexbox';
import Dialog, { DialogTitle, DialogContent } from 'material-ui/Dialog';
import InputRange from 'react-input-range';

import 'react-input-range/lib/css/index.css';

export default ({ onUpdate, isOpen, onClose, setting: { opacity } }) => <Dialog open={isOpen} onClose={onClose}>
  <DialogTitle>Setting</DialogTitle>
  <DialogContent style={{
    width: '300px'
  }}>
    <Flex auto>
      <InputRange
        maxValue={100}
        minValue={0}
        value={opacity * 100}
        onChange={x => onUpdate('opacity', x / 100)} />
      <span>Opacity</span>
    </Flex>
  </DialogContent>
</Dialog>;
