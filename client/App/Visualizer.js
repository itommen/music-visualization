import React, { Component } from 'react';

import Dialog, { DialogTitle, DialogContent } from 'material-ui/Dialog';

import FrequencyGraphEffect from './Visuals/FrequencyGraphEffect';
import WaveGraphEffect from './Visuals/WaveGraphEffect';
import BublesEffect from './Visuals/BublesEffect';

import getPixels from 'get-image-pixels';
import getColors from 'get-rgba-palette';

import { Flex } from 'reflexbox';

import { floor } from 'lodash';

const DEFAULT_FFT_SIZE = 256;

const videoStyle = {
  border: '3px solid darkgray',
  boxShadow: 'black 10px 10px 19px'
}

const subscribed = [];
const subscribe = update => {
  subscribed.push(update);
}

export default class Visualizer extends Component {
  constructor() {
    super();

    this.state = {};

    this.renderFrame = this.renderFrame.bind(this);
    this.setDimations = this.setDimations.bind(this);
    this.capturePicture = this.capturePicture.bind(this);
    this.initVisualistion = this.initVisualistion.bind(this);
    this.isContextReady = this.isContextReady.bind(this);
  }

  componentDidMount() {
    const context = new AudioContext();
    if (this.isContextReady(context)) {
      this.initVisualistion();
    }
  }

  initVisualistion() {
    const { audioStream, videoStream } = this.props;

    const context = new AudioContext();
    const gain = context.createGain();
    gain.gain.setTargetAtTime(0, context.currentTime, 0);

    const analyser = context.createAnalyser();

    this.setDimations();

    const canvas = document.getElementById('wave-graph');
    const videoContainer = document.getElementById('video-container');

    const { width, height } = videoStream.getVideoTracks()[0].getSettings();

    const source = context.createMediaStreamSource(audioStream);
    source.connect(analyser);

    analyser.fftSize = DEFAULT_FFT_SIZE;

    this.setState(state => ({ ...state, width, height, analyser, context }), this.renderFrame);

    videoContainer.srcObject = videoStream;
    setInterval(this.capturePicture, 1 * 1000);

    this.capturePicture();
  }

  componentDidUpdate(prevProps, prevState) {
    const { videoStream, audioStream } = this.props;
    const { analyser, context } = this.state;

    if (videoStream.id !== prevProps.videoStream.id) {

      const videoContainer = document.getElementById('video-container');

      videoContainer.srcObject = videoStream;

      const track = videoStream.getVideoTracks()[0];
    }
  }

  capturePicture() {
    const { videoStream } = this.props;

    this.setState(state => ({
      ...state,
      colors: getColors(getPixels(document.getElementById('video-container')), 5)
    }));
  }

  setDimations() {
    const { videoStream } = this.props;
    const waveGraphCanvas = document.getElementById('wave-graph');
    const frequencyGrpahCanvas = document.getElementById('frequency-graph');
    const flippedFrequencyGrpahCanvas = document.getElementById('flipped-frequency-graph');
    const videoContainer = document.getElementById('video-container');

    const { width, height } = videoStream.getVideoTracks()[0].getSettings();
    waveGraphCanvas.width = width;
    waveGraphCanvas.height = height;

    frequencyGrpahCanvas.width = width;
    frequencyGrpahCanvas.height = height;

      flippedFrequencyGrpahCanvas.width = width;
      flippedFrequencyGrpahCanvas.height = height;

    videoContainer.height = height;
    videoContainer.width = width;
  }

  renderFrame() {
    const { analyser, colors, context } = this.state;
    const bufferLength = analyser.frequencyBinCount;

    requestAnimationFrame(this.renderFrame);
    if (!colors || !colors.length) {
      return;
    }

    subscribed.forEach(update => update());
  }

  isContextReady(context) {
    return !!(context && context.state !== 'suspended');
  }

  render() {
    const { video, context, width, height, analyser, colors } = this.state;
    const { setting: { opacity, borderRadius, waveVisiable, barsVisiable, bublesVisiable, template } } = this.props;

    return <Flex auto align='center' style={{
      position: 'absolute',
      width: '100%',
      height: '100%'
    }}>
      {this.isContextReady(context) ? null : <Dialog open={true} onClose={() => this.initVisualistion()}>
        <DialogTitle>Just one thing to start</DialogTitle>
        <DialogContent>
          Click anywhere to start your vizualistion!
        </DialogContent>
      </Dialog>}
      <FrequencyGraphEffect subscribe={subscribe} width={width} height={height} analyser={analyser} colors={colors} borderRadius={borderRadius} visable={barsVisiable} id="flipped-frequency-graph" flipped={true}/>
      <WaveGraphEffect subscribe={subscribe} width={width} height={height} analyser={analyser} colors={colors} borderRadius={borderRadius} visable={waveVisiable} />
      <FrequencyGraphEffect subscribe={subscribe} width={width} height={height} analyser={analyser} colors={colors} borderRadius={borderRadius} visable={barsVisiable} id="frequency-graph"/>
      <BublesEffect subscribe={subscribe} width={width} height={height} analyser={analyser} colors={colors} borderRadius={borderRadius} visable={bublesVisiable} />
      <video className='centered' style={{ ...videoStyle, borderRadius }} id='video-container' autoPlay muted={true} />
      <img src={template ? `https://localhost:8081/client/App/Images/${template.image}` : ''} className={template ? template.class : ''}/>
    </Flex>;
  }
}
