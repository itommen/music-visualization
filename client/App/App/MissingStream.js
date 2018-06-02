import React from 'react';

import Typography from 'material-ui/Typography';
import SentimentVeryDissatisfiedIcon from 'material-ui-icons/SentimentVeryDissatisfied';

import { Flex } from 'reflexbox';

function getMissingStreams(stream) {
  if (!stream) {
    return ['video', 'audio'];
  }

  const missing = [];
  const tracks = stream.getTracks();

  if (!tracks.some(({ kind }) => kind == 'audio')) {
    missing.push('audio')
  }

  if (!tracks.some(({ kind }) => kind == 'video')) {
    missing.push('video')
  }

  return missing;
}

export default ({ stream }) => <Flex auto align='center' style={{
  background: 'lightblue'
}}>
  <Flex column auto align='center'>
    <SentimentVeryDissatisfiedIcon />
    <Typography type='title'>Ho No!</Typography>
    <Typography type='title'>missing streams: {getMissingStreams(stream).join(', ')}</Typography>
    <Typography type='caption'><i>try to realod page and add permission to video\audio usage</i></Typography>
  </Flex>
</Flex>;