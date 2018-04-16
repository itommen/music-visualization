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

let particles = new Array();
let particle;

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

    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000);
    camera.position.set(0, -50, 750);

    const renderer = new THREE.CanvasRenderer();
    renderer.setSize(width, height);
    renderer.setClearColor('#000000');

    let pi2 = Math.PI * 2;

    for (let i = 0; i <= 1024; i++)
    {
      let material = new THREE.SpriteMaterial({
          color: 0xffffff, program: function(context){
            context.beginPath();
            context.arc(0, -1, 1, 0, pi2, true);
            context.fill();
          }
      });

      particle = particles[i++] = new THREE.Particle(material);

      if (i <= 1024)
      {
        particle.position.x = (i - 512) * 1.1;
          particle.position.y = 0;
          particle.position.z = 0;
      }

      scene.add(particle);
    }

      this.renderer = renderer;
      this.scene = scene;
      this.camera = camera;

      this.mount.appendChild(this.renderer.domElement);

    const context = new AudioContext();
    const gain = context.createGain();
    gain.gain.setTargetAtTime(0, context.currentTime, 0);

    const analyser = context.createAnalyser();

    //this.setDimations();

    //const canvas = document.getElementById('music-container');
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

    //const canvas = document.getElementById('music-container');

    //const ctx = canvas.getContext('2d');
    let x = 0;

    const data = this.extractAudioData();

    const barWidth = width / data.length;

    //ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < 1024; i = i + 1)
      {
        particle = particles[i++];
        particle.position.y = dataArray[i] + 80;
        particle.material.color.setRGB(1, 1 - (dataArray[i]/255), 1);
      }

      this.renderer.render(this.scene, this.camera);
    // for (let i = 0; i < bufferLength; i = i + 1) {
    //   const barHeight = dataArray[i];
    //
    //   const red = 50;
    //   const green = 250 * (i / bufferLength) + barHeight;
    //   const blue = barHeight + 25 * (i / bufferLength);
    //
    //   ctx.fillStyle = `rgb(${red},${green},${blue})`;
    //   ctx.fillRect(x, height - barHeight, barWidth, barHeight);
    //
    //   x = x + (barWidth + 1);
    // }
  }

  render() {
    const { video } = this.state;
    const { setting: { opacity } } = this.props;

    return <Flex column auto style={{
      position: 'relative'
    }}>
      <div style={{ ...style, opacity, ...visualizeStyle }} ref={(mount) => {this.mount = mount}} id='music-container' />
      <video style={style} id='video-container' autoPlay muted={true} />
    </Flex>;
  }
}
