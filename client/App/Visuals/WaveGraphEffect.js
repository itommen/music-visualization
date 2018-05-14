import React, { Component } from 'react';

import VizualEffect from './VizualEffect';

import { applySaturationToHexColor, rgbToHex } from './utils';

const id = 'wave-graph'

export default class WaveGraphEffect extends Component {
  constructor() {
    super();

    this.update = this.update.bind(this);
    this.getWaveAudioData = this.getWaveAudioData.bind(this);
  }

  componentWillMount() {
    const { subscribe } = this.props;

    subscribe(this.update);
  }

  getWaveAudioData() {
    const { analyser } = this.props;

    const bufferLength = analyser.frequencyBinCount;

    const waveDataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(waveDataArray);

    return waveDataArray;
  }    

  update() {
    const { width, height, analyser, colors } = this.props;

    const bufferLength = analyser.frequencyBinCount;
    const canvas = document.getElementById('wave-graph');

    const ctx = canvas.getContext('2d');
    let x = 0;

    const data = this.getWaveAudioData();

    const barWidth = width / data.length;

    ctx.fillStyle = 'rgb(200, 200, 200)';
    ctx.clearRect(0, 0, width, height);

    ctx.lineWidth = 10;

    ctx.beginPath();

    let sliceWidth = width * 1.0 / bufferLength;

    for (let i = 0; i < bufferLength; i = i + 1) {
      const barHeight = data[i];

      let v = data[i] / 128.0;
      let y = v * height / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      }
      else {
        ctx.lineTo(x, y);
      }

      const colorPallete = colors[1];

      ctx.strokeStyle = applySaturationToHexColor(rgbToHex(colorPallete[0], colorPallete[1], colorPallete[2]), 60);

      x += sliceWidth;
    }

    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  }

  render() {
    const { opacity, borderRadius, visable } = this.props;

    return <VizualEffect opacity={opacity} borderRadius={borderRadius} id={id} visable={visable} />;
  }
}