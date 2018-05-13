import React, { Component } from 'react';

import { floor, sum } from 'lodash';

import './style.less';

const removePaddingZeros = array => {
  const arr = [...array];
  while (arr[arr.length - 1] === 0) {
    arr.pop();
  }

  return arr;
}

const splitArray = (array, amount) => {
  const chunkSize = floor(array.length / amount);

  return new Array(amount).fill().map((x, index) => array.slice(index * chunkSize, (index + 1) * chunkSize));
}

const getStrength = (array, min, max) => {
  const strength = sum(array) / (array.length * 255);

  return ((max - min) * strength) + min;
};

export default class Buble extends Component {
  componentWillMount() {
    const { data, width, height, color } = this.props;

    const chunks = splitArray(removePaddingZeros(data), 4);

    const features = {
      size: getStrength(chunks[0], 10, 50),
      time: getStrength(chunks[1], 0.1, 3),
      x: getStrength(chunks[2], -(width / 2), width / 2),
      y: getStrength(chunks[3], -(height / 2), height / 2),
      color
    }

    this.setState({
      features
    })
  }

  render() {
    const { features: { size, time, x, y, color } } = this.state;

    return <div
      style={{
        zIndex: 1,
        backgroundColor: color,
        position: 'absolute',
        top: y,
        left: x,
        borderRadius: '100%',
        width: size,
        height: size,
        opacity: 0,
        animation: `buble ${time}s`
      }}></div>;
  }
}