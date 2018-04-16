import React, { Component } from 'react';

import { Flex } from 'reflexbox';

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
  }

  componentDidMount() {
    const { audioStream, videoStream } = this.props;

    const context = new AudioContext();
    const analyser = context.createAnalyser();

    this.setDimations();

    const canvas = document.getElementById('music-container');
    const videoContainer = document.getElementById('video-container');

    const { width, height } = canvas.parentNode.getBoundingClientRect();

    context.createMediaStreamSource(audioStream).connect(analyser);
    analyser.connect(context.destination);

    analyser.fftSize = DEFAULT_FFT_SIZE;

    this.setState(state => ({ ...state, width, height, analyser, context }), this.renderFrame);

    videoContainer.srcObject = videoStream;
  }

  componentDidUpdate(prevProps, prevState) {
    const { videoStream, audioStream } = this.props;
    const { analyser, context } = this.state;

    if (videoStream.id !== prevProps.videoStream.id) {

      const videoContainer = document.getElementById('video-container');

      videoContainer.srcObject = videoStream;
      context.createMediaStreamSource(audioStream).connect(analyser);
    }
  }

  setDimations() {
    const canvas = document.getElementById('music-container');
    const videoContainer = document.getElementById('video-container');

    const { width, height } = canvas.parentNode.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;

    videoContainer.height = height;
    videoContainer.width = width;
  }

  extractAudioData() {
    const { analyser } = this.state;

    const bufferLength = analyser.frequencyBinCount;

    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    const data2Array = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(data2Array);

    return [...data2Array, ...dataArray];
  }

  renderFrame() {
    const { width, height, analyser } = this.state;

    requestAnimationFrame(this.renderFrame);
    const canvas = document.getElementById('music-container');

    const ctx = canvas.getContext('2d');
    let x = 0;

    const data = this.extractAudioData();

    // debugger;

    const barWidth = width / data.length;

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < data.length; i = i + 1) {
      const barHeight = data[i];

      const red = 50;
      const green = 250 * (i / data.length) + barHeight;
      const blue = barHeight + 25 * (i / data.length);

      ctx.fillStyle = `rgb(${red},${green},${blue})`;
      ctx.fillRect(x, height - barHeight, barWidth, barHeight);

      x = x + (barWidth + 1);
    }
  }

  render() {
    const { video } = this.state;
    const { setting: { opacity } } = this.props;

    return <Flex column auto style={{
      position: 'relative'
    }}>
      <canvas style={{ ...style, opacity, ...visualizeStyle }} id='music-container' />
      <video style={style} id='video-container' autoPlay />
    </Flex>;
  }
}
