import React, { Component } from 'react';

import VizualEffect from './VizualEffect';

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

    if (barHeight <= 80) {
      return 50
    }

    if (barHeight <= 100) {
      return 80
    }

    return 100;
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
      const barHeight = data[i];

      const colorPallete = colors[0];

      ctx.fillStyle = applySaturationToHexColor(rgbToHex(colorPallete[0], colorPallete[1], colorPallete[2]), this.calculateSaturationPercent(barHeight));

      ctx.fillRect(x, height - barHeight, barWidth, barHeight);

      x = x + (barWidth);
    }
  }

  render() {
    const { opacity, borderRadius, visable, id, flipped } = this.props;

    return <VizualEffect opacity={opacity} borderRadius={borderRadius} id={id} visable={visable} flipped={flipped}/>;
  }
}