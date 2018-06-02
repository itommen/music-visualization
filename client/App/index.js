import React, { Component } from 'react';

import { Flex } from 'reflexbox';

import App from './App';
import HomePage from './HomePage';

import './style.less';

export default class MainApp extends Component {
  constructor() {
    super();

    this.state = {
      isReady: false
    };

    this.finish = this.finish.bind(this);
  }

  finish(setting) {
    this.setState({
      setting,
      isReady: true
    });
  }

  render() {
    const { isReady, setting } = this.state;

    return <Flex column auto id='root'>
      {isReady
        ? <App setting={setting} />
        : <HomePage onFinish={this.finish} />}
    </Flex>;
  }
};
