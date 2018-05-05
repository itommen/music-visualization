import React, { Component } from 'react';

import getPixels from 'get-image-pixels';
import getColors from 'get-rgba-palette';

import { Flex } from 'reflexbox';

import { floor } from 'lodash';

const DEFAULT_FFT_SIZE = 256;

const style = {
  position: 'absolute',
  left: 0
};

const videoStyle = {
    top: '10px',
    left: 0,
    position: 'relative',
    height: '80%',
    width: '50%',
    top: '10px',
    margin: '0 auto',
    border: '3px solid darkgray',
    boxShadow: 'grey 10px 10px 19px',
    borderRadius: '38px',
}

const visualizeStyle = {
  zIndex: 1,
  width: '50%',
  position: 'absolute',
  top: '12px',
  height:'20%',
  left: '50%',
  margin: '0 auto',
  borderRadius: '38px',
  transform: 'translateX(-50%)'
};

const visualizeStyle3 = {
  zIndex: 1,
  width: '100%',
  position: 'absolute',
  top: '-5px',
  height:'20%',
};

const visualizeStyle2 = {
    zIndex: 1,
    width: '50%',
    position: 'absolute',
    bottom: '13%',
    height:'40%',
    left: '50%',
    margin: '0 auto',
    borderRadius: '38px',
    transform: 'translateX(-50%)'
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
      colors: getColors(getPixels(document.getElementById('video-container')), 2)
    }));
  }

  setDimations() {
    const { videoStream } = this.props;
    const waveGraphCanvas = document.getElementById('wave-graph');
    const waveGraphCanvas2 = document.getElementById('wave-graph2');
    const frequencyGrpahCanvas = document.getElementById('frequency-graph');
    const videoContainer = document.getElementById('video-container');

    const { width, height } = videoStream.getVideoTracks()[0].getSettings();
    waveGraphCanvas.width = width;
    waveGraphCanvas.height = height;

    waveGraphCanvas2.width = width;
    waveGraphCanvas2.height = height;

    frequencyGrpahCanvas.width = width;
    frequencyGrpahCanvas.height = height;

    videoContainer.height = height;
    videoContainer.width = width;
  }

  getWaveAudioData() {
      const { analyser } = this.state;

      const bufferLength = analyser.frequencyBinCount;

      const waveDataArray = new Uint8Array(bufferLength);
      analyser.getByteTimeDomainData(waveDataArray);

      return waveDataArray;
  }

  getFrequencyAudioData() {
      const { analyser } = this.state;

      const bufferLength = analyser.frequencyBinCount;

      const frequencyDataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(frequencyDataArray);

      return frequencyDataArray;
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

  renderWaveGraph()
  {
      const { width, height, analyser, colors } = this.state;

      const bufferLength = analyser.frequencyBinCount;
      const canvas = document.getElementById('wave-graph');

      const ctx = canvas.getContext('2d');
      let x = 0;

      const data = this.getWaveAudioData();

      const barWidth = width / data.length;

      ctx.fillStyle = 'rgb(200, 200, 200)';
      ctx.clearRect(0, 0, width, height);
      //ctx.fillRect(0, 0, width, height);

      ctx.lineWidth = 10;

      ctx.beginPath();

      let sliceWidth = width * 1.0 / bufferLength;

      for (let i = 0; i < bufferLength; i = i + 1) {
          const barHeight = data[i];

          let v = data[i] / 128.0;
          let y = v * height/2;

          if (i === 0)
          {
              ctx.moveTo(x, y);
          }
          else
          {
              ctx.lineTo(x, y);
          }

          const colorPallete = colors[floor(i / bufferLength)];

          //const red = colorPallete[0];
          //const green = colorPallete[1];
          //const blue = colorPallete[2];

          const red = 50;
          const green = 250 * (i / bufferLength) + barHeight;
          const blue = barHeight + 25 * (i / bufferLength);

          //ctx.strokeStyle = 'rgb(204, 50, 50)';
          ctx.strokeStyle = `rgb(${red},${green},${blue})`;

          x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height/2);
      ctx.stroke();
  }

    renderWaveGraph2()
    {
        const { width, height, analyser, colors } = this.state;

        const bufferLength = analyser.frequencyBinCount;
        const canvas = document.getElementById('wave-graph2');

        const ctx = canvas.getContext('2d');
        let x = 0;

        const data = this.getFrequencyAudioData();

        const barWidth = width / data.length;

        ctx.fillStyle = 'rgb(200, 200, 200)';
        ctx.clearRect(0, 0, width, height);
        //ctx.fillRect(0, 0, width, height);

        ctx.lineWidth = 5;
        ctx.strokeStyle = 'rgb(0, 0, 0)';

        ctx.beginPath();

        let sliceWidth = width * 1.0 / bufferLength;

        for (let i = 0; i < bufferLength; i = i + 1) {
            const barHeight = data[i];

            let v = data[i] / 128.0;
            let y = v * height/2;

            if (i === 0)
            {
                ctx.moveTo(x, y);
            }
            else
            {
                ctx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        ctx.lineTo(canvas.width, canvas.height/2);
        ctx.stroke();
    }

  renderFrequencyGraph()
  {
      const { width, height, analyser, colors } = this.state;
      const bufferLength = analyser.frequencyBinCount;

      //requestAnimationFrame(this.renderFrame);

      const canvas = document.getElementById('frequency-graph');

      const ctx = canvas.getContext('2d');
      let x = 0;

      const data = this.getFrequencyAudioData();

      const barWidth = width / data.length;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < bufferLength; i = i + 1) {
          const barHeight = data[i];
          const colorPallete = colors[floor(i / bufferLength)];

          //const red = colorPallete[0];
          //const green = colorPallete[1];
          //const blue = colorPallete[2];

          const red = 50;
          const green = 250 * (i / bufferLength) + barHeight;
          const blue = barHeight + 25 * (i / bufferLength);

          ctx.fillStyle = `rgb(${red},${green},${blue})`;

          ctx.fillRect(x, height - barHeight, barWidth, barHeight);

          x = x + (barWidth);
      }
  }

    renderFrame() {
        const { width, height, analyser, colors } = this.state;
        const bufferLength = analyser.frequencyBinCount;

        requestAnimationFrame(this.renderFrame);
        if (!colors || !colors.length) {
            return;
        }

        this.renderWaveGraph();
        //this.renderWaveGraph2();
        this.renderFrequencyGraph();
    }

  render() {
    const { video } = this.state;
    const { setting: { opacity } } = this.props;

    return <Flex column auto style={{
      position: 'relative'
    }}>
      <canvas style={{ ...style, opacity, ...visualizeStyle }} id='wave-graph' />
      <canvas style={{ ...style, opacity, ...visualizeStyle3 }} id='wave-graph2' />
      <video style={{...style, ...videoStyle}} id='video-container' autoPlay muted={true} />
      <canvas style={{ ...style, opacity, ...visualizeStyle2 }} id='frequency-graph' />
    </Flex>;
  }
}
