import React, { Component } from 'react';

import { start } from './visualize';

export default class App extends Component {
  constructor() {
    super();

    this.state = {};

    this.fileChange = this.fileChange.bind(this);
  }

  fileChange(e) {
    const { target: { files } } = e;
    const reader = new FileReader();
    reader.onload = ({ target: { result } }) => {
      this.setState(state => ({ ...state, file: result }));
    };
    reader.readAsDataURL(files[0]);
  }

  componentDidUpdate() {
    const { file } = this.state;
    debugger;

    if (file) {      
      //start();
    }
  }

  render() {
    const { file } = this.state;
    return <div>
      {
        file
          ? <div>
            <div id='visualize' />
            <audio id='audio' src={file} autoPlay={true} />
          </div>
          : null
      }
      <input
        type='file'
        onChange={this.fileChange} />
    </div>;
  }
}

// var $audio = $('#myAudio');
// $('input').on('change', function(e) {
//   var target = e.currentTarget;
//   var file = target.files[0];
//   var reader = new FileReader();

//   console.log($audio[0]);
//    if (target.files && file) {
//         var reader = new FileReader();
//         reader.onload = function (e) {
//             $audio.attr('src', e.target.result);
//             $audio.play();
//         }
//         reader.readAsDataURL(file);
//     }
// });