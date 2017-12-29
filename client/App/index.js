import React, { Component } from 'react';

import { Flex } from 'reflexbox';

import Visulizer from './Visualizer';

import './style.less';

export default class App extends Component {
  constructor() {
    super();

    this.state = {};
  }

  componentWillMount() {
    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      .then((stream) => {        
        this.setState(state => ({ ...state, stream }));
      })
      .catch(error => {
        // debugger;
      });
  }

  componentDidUpdate() {
    const audio = document.getElementById('Audio');
    const { stream } = this.state;

    if (stream) {
      audio.srcObject = stream;
    }
  }

  render() {
    const { stream } = this.state;

    if (!stream) {
      return <div>There is no audio stream around</div>
    }

    return <Flex id='root' column auto>
      <audio id="Audio" controls autoPlay></audio>
      <Flex auto>
        <Visulizer stream={stream} />
      </Flex>
    </Flex>;
  }
}