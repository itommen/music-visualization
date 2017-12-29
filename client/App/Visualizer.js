import React, { Component } from 'react';

const DEFAULT_FFT_SIZE = 256;

export default class Visualizer extends Component {
    constructor() {
        super();

        this.state = {};

        this.renderFrame = this.renderFrame.bind(this);
    }

    componentDidMount() {
        const { stream } = this.props;

        const context = new AudioContext();
        const analyser = context.createAnalyser();    

        const canvas = document.getElementById("music-container");
        const { width, height } = canvas.parentNode.getBoundingClientRect();
        canvas.width = width;
        canvas.height = height;

        context.createMediaStreamSource(stream).connect(analyser);
        analyser.connect(context.destination);

        analyser.fftSize = DEFAULT_FFT_SIZE;

        const bufferLength = analyser.frequencyBinCount;
        const barWidth = (width / bufferLength) * 2.5;

        this.setState(state => ({ ...state, width, height, barWidth, analyser }))

        this.renderFrame();
    }

    renderFrame() {
        const { width, height, barWidth, analyser } = this.state;

        requestAnimationFrame(this.renderFrame);

        const canvas = document.getElementById("music-container");
        const bufferLength = analyser.frequencyBinCount;
        const ctx = canvas.getContext("2d");
        let x = 0;

        const dataArray = new Uint8Array(bufferLength);

        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, width, height);

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
        return <canvas id="music-container"></canvas>;
    }
}
