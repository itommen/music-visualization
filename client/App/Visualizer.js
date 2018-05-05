import React, { Component } from 'react';
import React3 from 'react-three-renderer';

import getPixels from 'get-image-pixels';
import getColors from 'get-rgba-palette';

import { Flex } from 'reflexbox';

import { floor } from 'lodash';

const DEFAULT_FFT_SIZE = 256;

var THREE = require('three-canvas-renderer');

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

    const { width, height } = videoStream.getVideoTracks()[0].getSettings();

    debugger;
    const a = new THREE.CanvasRenderer();

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000);
    camera.position.set(0, -50, 750);

    debugger;
    const canvas = this.mount;
    const renderer = new THREE.CanvasRenderer();
    renderer.setSize(width, height);
    renderer.setClearColor('#000000');

    let pi2 = Math.PI * 2;

    for (let i = 0; i <= 1024; i++) {
      let material = new THREE.SpriteMaterial({
        color: 0xffffff
      });

      particle = particles[i++] = new THREE.Sprite(material);

      if (i <= 1024) {
        particle.position.x = (i - 512) * 1.1;
        particle.position.y = 0;
        particle.position.z = 0;
      }

      scene.add(particle);
    }

    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;

    debugger;
    this.mount.appendChild(this.renderer.domElement);

    const context = new AudioContext();
    debugger;
    const gain = context.createGain();
    gain.gain.setTargetAtTime(0, context.currentTime, 0);

    const analyser = context.createAnalyser();

    this.setDimations();

    //const canvas = document.getElementById('music-container');
    const videoContainer = document.getElementById('video-container');

    // const { width, height } = videoStream.getVideoTracks()[0].getSettings();

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
    const { context } = this.state;


    if (context && context.state === 'suspended') {
      context.resume();
    }
    const video = document.getElementById('video-container');
    const videoPixels = getPixels(video);
    const colors = getColors(videoPixels, 2);
    this.setState(state => ({
      ...state,
      colors
    }));
  }

  setDimations() {
    const { videoStream } = this.props;
    const canvas = document.getElementById('music-container');
    debugger;
    const videoContainer = document.getElementById('video-container');

    const { width, height } = videoStream.getVideoTracks()[0].getSettings();
    canvas.width = width;
    canvas.height = height;
    debugger;

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

    debugger;
    for (let i = 0; i < data.length; i = i + 2) {
      particle = particles[i];
      particle.position.y = data[i] + 80;
      particle.position.z = 1;
      particle.material.color.setRGB(1, 1 - (data[i] / 255), 1);
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
    const { video, width = 0, height = 0 } = this.state;
    const { setting: { opacity } } = this.props;

    const position = new THREE.Vector3(0, 0, 5)
    const rotation = new THREE.Euler(0.1, 0.1, 0);

    return <Flex column auto style={{
      position: 'relative'
    }}>
      <React3
        mainCamera="camera" // this points to the perspectiveCamera which has the name set to "camera" below
        width={width}
        height={height}>
        <scene>
          <perspectiveCamera
            name="camera"
            fov={75}
            aspect={width / height}
            near={0.1}
            far={1000}

            position={position}
          />
          <mesh
            rotation={rotation}
          >
            <boxGeometry
              width={1}
              height={1}
              depth={1}
            />
            <meshBasicMaterial
              color={0x00ff00}
            />
          </mesh>
        </scene>
      </React3>
      <div style={{ ...style, opacity, ...visualizeStyle }} ref={(mount) => { this.mount = mount }} id='music-container' />
      <video style={style} id='video-container' autoPlay muted={true} />
    </Flex>;
  }
}
