import React, { Component, Fragment } from 'react';

import Buble from './Buble';

import { rgbToHex } from '../utils';

let index = 1;

export default class BublesEffect extends Component {
  constructor() {
    super();

    this.state = {
      bubles: []
    };

    this.update = this.update.bind(this);
    this.getFrequencyAudioData = this.getFrequencyAudioData.bind(this);
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

  update() {
    const { width, height, analyser, colors } = this.props;
    const bufferLength = analyser.frequencyBinCount;

    const now = Date.now();

    this.setState(state => ({
      bubles: [...(state.bubles.filter(({ expired }) => expired > now)), {
        data: this.getFrequencyAudioData(),
        id: index++,
        expired: new Date(Date.now() + 4 * 1000),
        color: rgbToHex(...colors[3])
      }]
    }))
  }

  render() {
    const { opacity, width, height } = this.props;
    const { bubles } = this.state;

    return <div className='centered' style={{ zIndex: 1 }}>
      {bubles.map(({ data, id, color }) => <Buble data={data} width={width} height={height} color={color} key={id} />)}
    </div>;
  }
}