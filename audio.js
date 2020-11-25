var soundBuffer;

// http://localhost/assets/miami_nights.mp3

window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();

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

function playSound(buffer) {
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(0);
}