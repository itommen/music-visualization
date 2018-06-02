import React, { Component } from 'react';

import Dialog, {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from 'material-ui/Dialog';

import { Flex } from 'reflexbox';
import Button from 'material-ui/Button';

import * as Cookies from 'js-cookie';

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
    this.handleClose = this.handleClose.bind(this);
  }

  finish(setting) {
    this.setState({
      setting,
      isReady: true
    });
  }

  handleClose(shouldContinue) {
    if (shouldContinue) {
      const setting = JSON.parse(Cookies.get('setting'));
      this.finish(setting);
    } else {
      this.setState(state => ({
        ...state,
        dismissSaved: true
      }));
    }
  }

  render() {
    const { isReady, setting, dismissSaved } = this.state;

    if (Cookies.get('setting') && !dismissSaved && !isReady) {
      return <Dialog
        open={true}
        onClose={this.handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{"Should restore your old configuration?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            You have saved visuals configurations, should continue with those configurations?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.handleClose(false)} color='primary'>
            Disagree
            </Button>
          <Button onClick={() => this.handleClose(true)} color='primary' autoFocus>
            Agree
            </Button>
        </DialogActions>
      </Dialog>;
    }

    return <Flex column auto id='root'>
      {isReady
        ? <App setting={setting} />
        : <HomePage onFinish={this.finish} />}
    </Flex>;
  }
};
