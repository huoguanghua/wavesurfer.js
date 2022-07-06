'use strict';

// Create an instance
var wavesurfer;

/**
 * Use formatTimeCallback to style the notch labels as you wish, such
 * as with more detail as the number of pixels per second increases.
 *
 * Here we format as M:SS.frac, with M suppressed for times < 1 minute,
 * and frac having 0, 1, or 2 digits as the zoom increases.
 *
 * Note that if you override the default function, you'll almost
 * certainly want to override timeInterval, primaryLabelInterval and/or
 * secondaryLabelInterval so they all work together.
 *
 * @param: seconds
 * @param: pxPerSec
 */
function formatTimeCallback(seconds, pxPerSec) {
    console.log(`seconds:${seconds} pxPerSec:${pxPerSec}`);
    seconds = Number(seconds);
    // let minutes = Math.floor(seconds / 60);
    // seconds = seconds % 60;

    // // fill up seconds with zeroes
    // let secondsStr = Math.round(seconds).toString();
    // if (pxPerSec >= 25 * 10) {
    //     secondsStr = seconds.toFixed(2);
    // } else if (pxPerSec >= 25 * 1) {
    //     secondsStr = seconds.toFixed(1);
    // }

    // if (minutes > 0) {
    //     if (seconds < 10) {
    //         secondsStr = '0' + secondsStr;
    //     }
    //     return `${minutes}:${secondsStr}`;
    // }
    // return secondsStr;

    // const seconds = milliseconds / 1000;
    return [
        ("00" + Math.floor(seconds / 60)).slice(-2), // minutes
        ("00" + Math.floor(seconds % 60)).slice(-2) // seconds
    ].join(":");
}

function formetTime(seconds) {
    return [
        ("00" + Math.floor(seconds / 60)).slice(-2), // minutes
        ("00" + Math.floor(seconds % 60)).slice(-2) // seconds
    ].join(":");
}

/**
 * Use timeInterval to set the period between notches, in seconds,
 * adding notches as the number of pixels per second increases.
 *
 * Note that if you override the default function, you'll almost
 * certainly want to override formatTimeCallback, primaryLabelInterval
 * and/or secondaryLabelInterval so they all work together.
 *
 * @param: pxPerSec
 */
function timeInterval(pxPerSec) {
    let retval = 1;
    if (pxPerSec >= 25 * 100) { // 2500
        retval = 0.01;
    } else if (pxPerSec >= 25 * 40) { // 1000
        retval = 0.025;
    } else if (pxPerSec >= 25 * 10) { // 250
        retval = 0.1;
    } else if (pxPerSec >= 25 * 4) { // 100
        retval = 0.25;
    } else if (pxPerSec >= 25) { // 25
        retval = 1;
    } else if (pxPerSec * 5 >= 25) { // 5
        retval = 5;
    } else if (pxPerSec * 15 >= 25) { // 25 / 15
        retval = 15;
    } else {
        retval = Math.ceil(0.5 / pxPerSec) * 60;
    }
    return retval;
}

/**
 * Return the cadence of notches that get labels in the primary color.
 * EG, return 2 if every 2nd notch should be labeled,
 * return 10 if every 10th notch should be labeled, etc.
 *
 * Note that if you override the default function, you'll almost
 * certainly want to override formatTimeCallback, primaryLabelInterval
 * and/or secondaryLabelInterval so they all work together.
 *
 * @param pxPerSec
 */
function primaryLabelInterval(pxPerSec) {
    let retval = 1;
    if (pxPerSec >= 25 * 100) { // 2500
        retval = 10;
    } else if (pxPerSec >= 25 * 40) { // 1000
        retval = 4;
    } else if (pxPerSec >= 25 * 10) { // 250
        retval = 10;
    } else if (pxPerSec >= 25 * 4) { // 100
        retval = 4;
    } else if (pxPerSec >= 25) { // 25
        retval = 3;
    } else if (pxPerSec * 5 >= 25) { // 5
        retval = 1;
    } else if (pxPerSec * 15 >= 25) { // 2
        retval = 2;
    } else {
        retval = Math.ceil(0.5 / pxPerSec) * 60;
    }
    return retval;
}

/**
 * Return the cadence of notches to get labels in the secondary color.
 * EG, return 2 if every 2nd notch should be labeled,
 * return 10 if every 10th notch should be labeled, etc.
 *
 * Secondary labels are drawn after primary labels, so if
 * you want to have labels every 10 seconds and another color labels
 * every 60 seconds, the 60 second labels should be the secondaries.
 *
 * Note that if you override the default function, you'll almost
 * certainly want to override formatTimeCallback, primaryLabelInterval
 * and/or secondaryLabelInterval so they all work together.
 *
 * @param pxPerSec
 */
function secondaryLabelInterval(pxPerSec) {
    // draw one every 10s as an example
    // return Math.floor(10 / timeInterval(pxPerSec));
    // return 0;
}

// Init & load audio file
document.addEventListener('DOMContentLoaded', function() {
    // Init
    wavesurfer = WaveSurfer.create({
        container: document.querySelector('#waveform'),
        waveColor: '#A8DBA8',
        progressColor: '#3B8686',
        backend: 'MediaElement',
        minPxPerSec: 1,
        plugins: [
            // WaveSurfer.regions.create({
            //     regions: [
            //         {
            //             start: 0,
            //             end: 5,
            //             color: 'hsla(400, 100%, 30%, 0.1)'
            //         },
            //         {
            //             start: 10,
            //             end: 100,
            //             color: 'hsla(200, 50%, 70%, 0.1)'
            //         }
            //     ]
            // }),
            WaveSurfer.timeline.create({
                container: '#timeline',
                formatTimeCallback: formatTimeCallback,
                timeInterval: timeInterval,
                primaryLabelInterval: primaryLabelInterval,
                secondaryLabelInterval: secondaryLabelInterval,
                primaryColor: 'red',
                secondaryColor: 'blue',
                // primaryFontColor: 'orange',
                // secondaryFontColor: 'green',
                notchPercentHeight: 30,
                topMode: false
            })
        ]
    });

    // Load audio from URL
    // wavesurfer.load('../media/demo.wav');
    // wavesurfer.load('https://audios.muzhiyun.cn/Media/2022/a60c78e3-6385-45a9-a6fe-fc1286547f5c.mp3');
    // wavesurfer.load('../media/ted/ElonMuskExtendedInterview_2022_VO_Intro.mp3'); // 26分钟
    // wavesurfer.load('../media/ted/WorkLifeS005_Perfectionism_2022V_VO_Intro.mp3'); // 42分钟
    wavesurfer.load('../media/480803359.mp3');

    wavesurfer.on('error', function(e) {
        console.warn(e);
    });

    // Zoom slider
    // let slider = document.querySelector('[data-action="zoom"]');

    // slider.value = wavesurfer.params.minPxPerSec;
    // slider.min = wavesurfer.params.minPxPerSec;

    // slider.addEventListener('input', function() {
    //     wavesurfer.zoom(Number(this.value));
    // });

    // Play button
    let button = document.querySelector('[data-action="play"]');

    let btns = document.getElementsByClassName('zoomBtn');
    for (const btn of btns) {
        btn.addEventListener('click', e => {
            console.log('will zoom:', e.target.dataset.zoom);
            wavesurfer.zoom(Number(e.target.dataset.zoom));
        });
    }

    button.addEventListener('click', wavesurfer.playPause.bind(wavesurfer));

    let testBtn = document.getElementById("testBtn");
    testBtn.addEventListener('click', () => {
        console.log(`duration:${wavesurfer.getDuration()} ${formetTime(wavesurfer.getDuration())} `);
    });


    wavesurfer.on('audioprocess', () => {

    });

    // wavesurfer.on('loading', (progress) => {
    //     console.log('loading:', progress);
    // });

    wavesurfer.on('ready', () => {
        console.log('ready');
    });

    wavesurfer.on('finish', () => {
        console.log('finish');
    });

    wavesurfer.on('waveform-ready', () => {
        console.log('waveform-ready:');
    });

    wavesurfer.on('zoom', (minPxPerSec) => {
        console.log('zoom:', minPxPerSec);
    });
});
