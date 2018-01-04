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
    this.loadAudioStream = this.loadAudioStream.bind(this);
    this.loadVideoStream = this.loadVideoStream.bind(this);
    this.sourceChanged = this.sourceChanged.bind(this);
  }

  componentWillMount() {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const audioSources = devices
          .filter(x => x.kind === 'audioinput')
          .map(({ deviceId, label }) => ({ deviceId, label }));
        const videoSources = devices
          .filter(x => x.kind === 'videoinput')
          .map(({ deviceId, label }) => ({ deviceId, label }));

        this.setState(state => ({ ...state, audioSources, videoSources }));
      });
  }

  componentDidMount() {
    this.loadAudioStream();
    this.loadVideoStream();
  }

  componentDidUpdate(prevProps, prevState) {
    const { videoSourceId, audioSourceId, audioStream } = this.state;
    const audio = document.getElementById('Audio');

    if (videoSourceId !== prevState.videoSourceId) {
      this.loadVideoStream();
    }

    if (audioSourceId !== prevState.audioSourceId) {
      audio.srcObject = audioStream;
    }
  }

  loadAudioStream() {
    this.loadStream('audio');
  }

  loadVideoStream() {
    this.loadStream('video');
  }

  loadStream(streamTypeName) {
    const sourceId = this.state[`${streamTypeName}SourceId`];

    navigator.mediaDevices.getUserMedia({
      audio: {
        optional: [{ sourceId }]
      }
    })
      .then((stream) => {
        this.setState(state => ({ ...state, [`${streamTypeName}Stream`]: stream }));
      })
      .catch(() => {
        // debugger;
      });
  }

  sourceChanged(sourceName) {
    return ({ target: { value } }) => {
      this.setState(state => ({
        ...state,
        [sourceName]: value
      }));
    };
  }

  render() {
    const { audioStream, videoStream, videoSources, videoSourceId } = this.state;

    if (!audioStream || !videoStream) {
      return <div>There is no audio stream around</div>;
    }

    return <Flex id='root' column auto>
      <Flex>
        <audio id='Audio' controls autoPlay />
        <SourceSelect sources={videoSources}
          selectedSource={videoSourceId}
          sourceChanged={this.sourceChanged('videoSourceId')} />
      </Flex>
      <Flex auto>
        <Visulizer audioStream={audioStream}
          videoStream={videoStream}
          videoSource={videoSourceId} />
      </Flex>
    </Flex>;
  }
}
