import React, { Component } from 'react';

import getPixels from 'get-image-pixels';
import getColors from 'get-rgba-palette';

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

    this.renderFrame = this.renderFrame.bind(this);
    this.setDimations = this.setDimations.bind(this);
    this.capturePicture = this.capturePicture.bind(this);
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

    this.setState(state => ({ ...state, width, height, analyser, context }));

    videoContainer.srcObject = videoStream;

    setInterval(this.capturePicture, 1 * 1000);

    this.capturePicture();
    this.renderFrame();
  }

  componentDidUpdate(prevProps, prevState) {
    const { videoStream, audioStream } = this.props;
    const { analyser, context } = this.state;

    if (videoStream.id !== prevProps.videoStream.id) {

      const videoContainer = document.getElementById('video-container');

      videoContainer.srcObject = videoStream;
      context.createMediaStreamSource(audioStream).connect(analyser);

      const track = videoStream.getVideoTracks()[0];
    }
  }

  capturePicture() {
    const { videoStream } = this.props;

    this.setState(state => ({
      ...state,
      colors: getColors(getPixels(document.getElementById('video-container')), 1)
    }));
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

  renderFrame() {
    const { width, height, analyser, colors } = this.state;

    requestAnimationFrame(this.renderFrame);

    if (!colors || !colors.length) {
      return;
    }

    const canvas = document.getElementById('music-container');
    const bufferLength = analyser.frequencyBinCount;
    const barWidth = width / bufferLength * 2.5;

    const ctx = canvas.getContext('2d');
    let x = 0;

    const dataArray = new Uint8Array(bufferLength);

    analyser.getByteFrequencyData(dataArray);

    // ctx.fillStyle = "transparent";
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < bufferLength; i = i + 1) {
      const barHeight = dataArray[i];

      const red = colors[0][0];
      const green = colors[0][1];
      const blue = colors[0][2];

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
