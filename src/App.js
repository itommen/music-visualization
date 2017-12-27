import React, { Component } from 'react';
import logo from './audio.png';
import './App.css';

import { FileInput, Button } from 'react-md';
import AudioVisualuzer from 'audio-visualizer';

class App extends Component {
    state = {fileName: '', convertedAudio : null};

    audioChanges = (file, e) => {
        // this.setState({ fileName: file.name });
        //
        // let audio = new Audio();
        // audio.src = URL.createObjectURL(file);
        //
        // this.setState({ fileName: file.name, convertedAudio:audio.src }, function() {
        //     this.refs.audio.pause();
        //     this.refs.audio.load();
        //     this.refs.audio.play();
        // });
        //
        // this.visualize(audio);

        const audio = document.getElementById('audio');
        audio.src = URL.createObjectURL(file);

        this.setState({ fileName: file.name, convertedAudio:audio.src }, function() {
                // this.refs.audio.pause();
                this.refs.audio.load();
                this.refs.audio.play();
            });

        var context = new AudioContext();
        var src = context.createMediaElementSource(audio);
        var analyser = context.createAnalyser();

        var canvas = document.getElementById("music-container");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        var ctx = canvas.getContext("2d");

        src.connect(analyser);
        analyser.connect(context.destination);

        analyser.fftSize = 256;

        var bufferLength = analyser.frequencyBinCount;
        console.log(bufferLength);

        var dataArray = new Uint8Array(bufferLength);

        var WIDTH = canvas.width;
        var HEIGHT = canvas.height;

        var barWidth = (WIDTH / bufferLength) * 2.5;
        var barHeight;
        var x = 0;

        function renderFrame() {
            requestAnimationFrame(renderFrame);

            x = 0;

            analyser.getByteFrequencyData(dataArray);

            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            for (var i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i];

                // var r = barHeight + (25 * (i/bufferLength));
                // var g = 250 * (i/bufferLength);
                // var b = 50;

                var r = 50;
                var g = 250 * (i/bufferLength) + barHeight;
                var b = barHeight + (25 * (i/bufferLength));

                ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
                ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }
        }

        audio.play();
        renderFrame();
    }

  render() {
    const {fileName, convertedAudio} = this.state;

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h1 className="App-title">Welcome to Music Visualization</h1>
             </header>
            <div>
               {/*<span className="App-intro">Select a .mp3 file to upload and visualize </span>*/}
                <FileInput onChange={this.audioChanges} id="audio-file" accept="mp3/*" name="audio" flat />
            </div>
            <canvas id="music-container"></canvas>
            <div>
                <span>selected file: {fileName}</span>
            </div>
            <audio controls ref="audio" id="audio">
                <source src={convertedAudio} type="audio/mpeg"/>
            </audio>

         </div>
    );
  }
}

export default App;
