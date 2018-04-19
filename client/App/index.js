import React, { Component } from 'react';

import { Flex } from 'reflexbox';

import SettingsIcon from 'material-ui-icons/Settings';

import Visulizer from './Visualizer';
import SourceSelect from './SourceSelect';
import Setting from './Setting';
import MissingStream from './MissingStream';

import './style.less';

const filterDevices = (devices, type) => devices
  .filter(({ kind }) => kind === type)
  .map(({ deviceId, label }) => ({ deviceId, label }));

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      audioSourceId: 'default',
      videoSourceId: 'default',
      isSettingDialogOpen: false,
      setting: {
        opacity: 0.4
      }
    };

    this.updateSetting = this.updateSetting.bind(this);
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
      })
      .catch(ex => {
        debugger
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

    const videoConstraint = videoSourceId === 'default'
      ? true
      : {
        deviceId: {
          exact: videoSourceId
        }
      };

    const audioConstraint = audioSourceId === 'default'
      ? true
      : {
        deviceId: {
          exact: audioSourceId
        }
      };

    navigator.mediaDevices.getUserMedia({
      video: videoConstraint,
      audio: audioConstraint
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

  updateSetting(name, value) {
    this.setState(state => ({
      ...state,
      setting: {
        ...state.setting,
        [name]: value
      }
    }));
  }

  render() {
    const { stream, videoSources, videoSourceId, setting, isSettingDialogOpen } = this.state;

    if (!stream || stream.getTracks().length < 2) {
      return <MissingStream stream={stream} />;
    }

    return <Flex id='root' column auto>
      <SettingsIcon style={{
        position: 'absolute',
        left: '10px',
        top: '10px'
      }}
        onClick={() => this.setState(state => ({ ...state, isSettingDialogOpen: true }))} />
      <Setting
        isOpen={isSettingDialogOpen}
        onClose={() => this.setState(state => ({ ...state, isSettingDialogOpen: false }))}
        onUpdate={this.updateSetting}
        setting={setting} />
      <Flex>
        <audio id='Audio' controls autoPlay />
        <SourceSelect sources={videoSources}
          selectedSource={videoSourceId}
          sourceChanged={x => this.videoSourceChanged(x)} />
      </Flex>
      <Flex auto>
        <Visulizer audioStream={stream}
          videoStream={stream}
          videoSource={videoSourceId}
          setting={setting} />
      </Flex>
    </Flex>;
  }
}
