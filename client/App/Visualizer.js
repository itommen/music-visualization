import React, { Component } from 'react';

import { Flex } from 'reflexbox';

const DEFAULT_FFT_SIZE = 256;

const style = {
    position: 'absolute',
    top: '10px',
    left: 0,
}

const visualizeStyle = {
    opacity: 0.4,
    zIndex: 1
}

export default class Visualizer extends Component {
    constructor() {
        super();

        this.state = {};

        this.renderFrame = this.renderFrame.bind(this);
        this.setDimations = this.setDimations.bind(this);
    }

    componentDidMount() {
        const { audioStream, videoStream } = this.props;

        debugger;
        const context = new AudioContext();
        const analyser = context.createAnalyser();

        this.setDimations();

        const canvas = document.getElementById("music-container");
        const videoContainer = document.getElementById('video-container');

        const { width, height } = canvas.parentNode.getBoundingClientRect();

        context.createMediaStreamSource(audioStream).connect(analyser);
        analyser.connect(context.destination);

        analyser.fftSize = DEFAULT_FFT_SIZE;

        this.setState(state => ({ ...state, width, height, analyser }))

        videoContainer.src = window.URL.createObjectURL(videoStream);

        this.renderFrame();
    }

    setDimations() {
        const canvas = document.getElementById("music-container");
        const videoContainer = document.getElementById('video-container');

        const { width, height } = canvas.parentNode.getBoundingClientRect();
        canvas.width = width;
        canvas.height = height;

        videoContainer.height = height;
        videoContainer.width = width;
    }

    renderFrame() {
        const { width, height, analyser } = this.state;

        requestAnimationFrame(this.renderFrame);

        const canvas = document.getElementById("music-container");
        const bufferLength = analyser.frequencyBinCount;
        const barWidth = (width / bufferLength) * 2.5;

        const ctx = canvas.getContext("2d");
        let x = 0;

        const dataArray = new Uint8Array(bufferLength);

        analyser.getByteFrequencyData(dataArray);

        //ctx.fillStyle = "transparent";
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < bufferLength; i++) {
            const barHeight = dataArray[i];

            const red = 50;
            const green = 250 * (i / bufferLength) + barHeight;
            const blue = barHeight + (25 * (i / bufferLength));

            ctx.fillStyle = `rgb(${red},${green},${blue})`;
            ctx.fillRect(x, height - barHeight, barWidth, barHeight);

            x += barWidth + 1;
        }
    }

    render() {
        return <Flex column auto style={{
            position: 'relative'
        }}>
            <canvas style={{ ...style, ...visualizeStyle }} id="music-container"></canvas>
            <video style={style} id='video-container' autoPlay></video>
        </Flex>;
    }
}
