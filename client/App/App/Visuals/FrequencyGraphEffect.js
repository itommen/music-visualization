import React, { Component } from 'react';

import { applySaturationToHexColor, rgbToHex } from './utils';

export default class FrequencyGraphEffect extends Component {
  constructor() {
    super();

    this.update = this.update.bind(this);
    this.getFrequencyAudioData = this.getFrequencyAudioData.bind(this);
    this.calculateSaturationPercent = this.calculateSaturationPercent.bind(this);
  }

  componentWillMount() {
    const { subscribe } = this.props;

    subscribe(this.update);
  }

  getFrequencyAudioData() {
    const { analyser } = this.props;

    const bufferLength = analyser.frequencyBinCount;

    const frequencyDataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(frequencyDataArray);

    return frequencyDataArray;
  }

  calculateSaturationPercent(barHeight) {
    if (barHeight <= 20) {
      return 30
    }

    if (barHeight <= 50) {
      return 35
    }

    if (barHeight <= 80) {
      return 40
    }

    if (barHeight <= 100) {
      return 45
    }

    if (barHeight <= 130)
    {
      return 55;
    }

    if (barHeight <= 155)
    {
      return 65;
    }

    return 75;
  }

  update() {
    const { width, height, analyser, colors, id } = this.props;
    const bufferLength = analyser.frequencyBinCount;

    const canvas = document.getElementById(id);

    const ctx = canvas.getContext('2d');
    let x = 0;

    const data = this.getFrequencyAudioData();

    const barWidth = width / data.length;

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < bufferLength; i = i + 1) {
      const barHeight = data[i] / 1.2;

      const colorPallete = colors[0];

      ctx.fillStyle = applySaturationToHexColor(rgbToHex(colorPallete[0], colorPallete[1], colorPallete[2]), this.calculateSaturationPercent(barHeight));

      ctx.fillRect(x, height - barHeight, barWidth, barHeight);

      x = x + (barWidth);
    }
  }

  render() {
    const { opacity, borderRadius, visable, id, flipped } = this.props;

    return <canvas  className='centered' style={{
            opacity: visable ? opacity : 0,
            borderRadius,
            zIndex: 1,
            transform: flipped ? 'scale(-1) translate(50%, 0)' : 'translate(-50%, 0'}} id={id} />
  }
}