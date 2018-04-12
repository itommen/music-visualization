import React, { Component } from 'react';

import { Flex } from 'reflexbox';

import Visulizer from './Visualizer';
import SourceSelect from './SourceSelect';

import './style.less';

const filterDevices = (devices, type) => devices
  .filter(({ kind }) => kind === type)
  .map(({ deviceId, label }) => ({ deviceId, label }));

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      audioSourceId: 'default',
      videoSourceId: '93bedd9f8d962d4dc8ddef5981fc14e2440556b84cbf29316c6f75a23724a1b4'
    };

    this.loadStream = this.loadStream.bind(this);
    this.sourceChanged = this.videoSourceChanged.bind(this);
    this.updateSourceSelection = this.updateSourceSelection.bind(this);
  }

  componentWillMount() {
    this.updateSourceSelection();
  }

  updateSourceSelection() {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const audioSources = filterDevices(devices, 'audioinput');
        const videoSources = filterDevices(devices, 'videoinput');

        this.setState(state => ({ ...state, audioSources, videoSources }));
      });
  }

  componentDidMount() {
    this.loadStream();
  }

  componentDidUpdate(prevProps, prevState) {
    const { videoSourceId, audioSourceId, audioStream } = this.state;
    const audio = document.getElementById('Audio');

    if (videoSourceId !== prevState.videoSourceId) {
      this.loadStream();
    }

    if (audioSourceId !== prevState.audioSourceId) {
      audio.srcObject = audioStream;
    }
  }

  loadStream() {
    const { videoSourceId, audioSourceId, stream } = this.state;

    if (stream) {
      stream.getTracks().forEach(x => {
        x.stop();
      });
    }

    navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: {
          exact: videoSourceId
        }
      },
      audio: {
        deviceId: {
          exact: audioSourceId
        }
      }
    })
      .then((stream) => {
        this.setState(state => ({ ...state, stream }));
      })
      .then(this.updateSourceSelection)
      .catch(ex => {
        debugger;
      });
  }

  videoSourceChanged({ target: { value } }) {
    this.setState(state => ({
      ...state,
      videoSourceId: value
    }), this.loadStream);
  }

  render() {
    const { stream, videoSources, videoSourceId } = this.state;

    if (!stream) {
      return <div>There is no audio stream around</div>;
    }

    return <Flex id='root' column auto>
      <Flex>
        <audio id='Audio' controls autoPlay />
        <SourceSelect sources={videoSources}
          selectedSource={videoSourceId}
          sourceChanged={x => this.videoSourceChanged(x)} />
      </Flex>
      <Flex auto>
        <Visulizer audioStream={stream}
          videoStream={stream}
          videoSource={videoSourceId} />
      </Flex>
    </Flex>;
  }
}
