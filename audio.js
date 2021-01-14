"use strict";

var soundBuffer;

window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context;

/**
 * Load the sound as a buffer
 * 
 * @param {string} url The URL to loud the sound from
 */
function loadSound(url) {
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    request.onload = function() {
        context.decodeAudioData(request.response, function(buffer) {
            soundBuffer = buffer;
        });
    }
    request.send();
}

/**
 * Play the sound from its buffer to the web browser
 * 
 * @param {string} buffer The buffer to use as a basis for the sound
 */
function playSound(buffer) {
    var gainNode = context.createGain(); // Create a gainNode reference.
    gainNode.gain.value = 0.2; // 20% volume
    gainNode.connect(context.destination); // Add context to gainNode

    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(gainNode); // connect to the GainNode instead of context destination
    source.start(0);
}

/**
 * Shortcut for playing the main game track:
 * http://localhost/assets/miami_nights.mp3
 */
function playMainTrack() {
    loadSound("http://localhost/assets/miami_nights.mp3");
    playSound(soundBuffer);
}

/**
 * Get the highlight "peaks" of the cuurrent track to
 * spawn associated blocks.
 * 
 * @param {array} data The data from the track
 * @param {number} threshold The peak threshold to identify
 */
function getPeaks(data, threshold) {
    var peaks = [];
    var length = data.length;
    for (var i = 0; i < length;) {
        if (data[i] > threshold) {
            preaks.push(i);
            i += 10000;
        }
    }

    return peaks;
}

var filteredBuffer;

/**
 * Functional test method to check track playing
 * and low pass filtering.
 * 
 * @param {SoundBuffer} buffer The sound buffer of the track
 */
function test(buffer) {
    // Create offline context
    var offlineContext = new OfflineAudioContext(1, buffer.length, buffer.sampleRate);

    // Create buffer source
    var source = offlineContext.createBufferSource();
    source.buffer = buffer;

    // Create filter
    var filter = offlineContext.createBiquadFilter();
    filter.type = "lowpass";

    // Pipe the song into the filter, and the filter into the offline context
    source.connect(filter);
    filter.connect(offlineContext.destination);

    // Schedule the song to start playing at time:0
    source.start(0);

    // Render the song
    offlineContext.startRendering()

    // Act on the result
    offlineContext.oncomplete = function(e) {
        // Filtered buffer!
        filteredBuffer = e.renderedBuffer;
        console.log(filteredBuffer);
    };
}