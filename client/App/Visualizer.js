import React, { Component } from 'react';

import getPixels from 'get-image-pixels';
import getColors from 'get-rgba-palette';

import { Flex } from 'reflexbox';

import { floor } from 'lodash';

const DEFAULT_FFT_SIZE = 256;

const style = {
  position: 'absolute',
  top: '10px',
  left: 0
};

const visualizeStyle = {
  zIndex: 1
};

export default class Visualizer extends Component {
  constructor() {
    super();

    this.state = {};

    this.extractAudioData = this.extractAudioData.bind(this);
    this.renderFrame = this.renderFrame.bind(this);
    this.setDimations = this.setDimations.bind(this);
    this.capturePicture = this.capturePicture.bind(this);
  }

  componentDidMount() {
    const { audioStream, videoStream } = this.props;

    const context = new AudioContext();
    const gain = context.createGain();
    gain.gain.setTargetAtTime(0, context.currentTime, 0);

    const analyser = context.createAnalyser();

    this.setDimations();

    const canvas = document.getElementById('music-container');
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
      colors: getColors(getPixels(document.getElementById('video-container')), 2)
    }));
  }

  setDimations() {
    const { videoStream } = this.props;
    const canvas = document.getElementById('music-container');
    const videoContainer = document.getElementById('video-container');

    const { width, height } = videoStream.getVideoTracks()[0].getSettings();
    canvas.width = width;
    canvas.height = height;

    videoContainer.height = height;
    videoContainer.width = width;
  }

  extractAudioData() {
    const { analyser } = this.state;

    const bufferLength = analyser.frequencyBinCount;

    const frequencyDataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(frequencyDataArray);    

    const waveDataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(waveDataArray);

    return [...waveDataArray, ...frequencyDataArray];
  }

  renderFrame() {
    const { width, height, analyser, colors } = this.state;
    const bufferLength = analyser.frequencyBinCount;

    requestAnimationFrame(this.renderFrame);
    if (!colors || !colors.length) {
      return;
    }

    const canvas = document.getElementById('music-container');

    const ctx = canvas.getContext('2d');
    let x = 0;

    const data = this.extractAudioData();

    const barWidth = width / data.length;

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < data.length; i = i + 1) {
      const barHeight = data[i];
      const colorPallete = colors[floor(i / bufferLength)];

      const red = colorPallete[0];
      const green = colorPallete[1];
      const blue = colorPallete[2];

      ctx.fillStyle = `rgb(${red},${green},${blue})`;      
      ctx.fillRect(x, height - barHeight, barWidth, barHeight);

      x = x + (barWidth);
    }
  }

  render() {
    const { video } = this.state;
    const { setting: { opacity } } = this.props;

    return <Flex column auto style={{
      position: 'relative'
    }}>
      <canvas style={{ ...style, opacity, ...visualizeStyle }} id='music-container' />
      <video style={style} id='video-container' autoPlay muted={true} />
    </Flex>;
  }
}
