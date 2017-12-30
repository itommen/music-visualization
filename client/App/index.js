import React, { Component } from 'react';

import { Flex } from 'reflexbox';

import Visulizer from './Visualizer';
import SourceSelect from './SourceSelect';

import './style.less';

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      audioSourceId: 'default',
      videoSourceId: 'default'
    };

    this.loadStream = this.loadStream.bind(this);
  }

  componentWillMount() {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const audioSources = devices.filter(x => x.kind === 'audioinput').map(({ deviceId, label }) => ({ deviceId, label }));
        const videoSources = devices.filter(x => x.kind === 'videoinput').map(({ deviceId, label }) => ({ deviceId, label }));

        this.setState(state => ({ ...state, audioSources, videoSources }));
      });
  }

  componentDidMount() {
    this.loadStream();
  }

  loadStream() {
    const { videoSourceId, audioSourceId } = this.state;

    navigator.mediaDevices.getUserMedia({
      audio: {
        optional: [{ sourceId: audioSourceId }]
      },
      video: {
        optional: [{ sourceId: videoSourceId }]
      }
    })
      .then((stream) => {
        this.setState(state => ({ ...state, stream }));
      })
      .catch(error => {
        debugger;
      })
  }

  componentDidUpdate() {
    const audio = document.getElementById('Audio');
    const { stream } = this.state;

    if (stream) {
      audio.srcObject = stream;
    }
  }

  render() {
    const { stream, audioSources, videoSources } = this.state;

    if (!stream) {
      return <div>There is no audio stream around</div>
    }

    return <Flex id='root' column auto>
      <Flex>
        <audio id="Audio" controls autoPlay></audio>
        <SourceSelect sources={videoSources} />
      </Flex>
      <Flex auto>
        <Visulizer stream={stream} />
      </Flex>
    </Flex>;
  }
}