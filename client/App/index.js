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
        <DialogTitle id='alert-dialog-title'>{"Restore old configuration"}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            You have previously saved customized configurations, would you like to load them?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.handleClose(false)} color='primary'>
            No, return to Home Page
            </Button>
          <Button onClick={() => this.handleClose(true)} color='primary' autoFocus>
            Yes, load my settings!
            </Button>
        </DialogActions>
      </Dialog>;
    }

    return <Flex column auto id='root'>
      {isReady
        ? <App setting={setting} reset={() => this.setState(x => ({ ...x, isReady: false, dismissSaved: true }))} />
        : <HomePage onFinish={this.finish} />}
    </Flex>;
  }
};
