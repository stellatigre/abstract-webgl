var musicBuffer = null;
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var fft_co = 1;

function onError(err) { console.log('fucked something up'); }

function loadSound(url) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
      musicBuffer = buffer;
    }, onError);
  }
  request.send();
}

function playSound(buffer, destination) {
  var source = context.createBufferSource(); // creates a sound source
  source.buffer = buffer;                    // tell the source which sound to play
  source.connect(destination);       // connect the source to the context's destination (the speakers)
  source.start(0);
}

function fft2Particles(fft_co, emitters) {
        emitters[1].speed = -5 + fft_co/3 ;              
        emitters[1].particlesPerSecond = 20 + fft_co*36 ;
        emitters[1].sizeStart = 2 + fft_co/2 ;              
        emitters[1].colorStartSpread = new THREE.Vector3(5+ fft_co/20, 5-fft_co/100, 5+fft_co/6);               
        emitters[2].particlesPerSecond = 1000 + fft_co*5 ;
        emitters[2].sizeStart = 2 + fft_co/30 ;              
        emitters[2].speed = 2 + fft_co/30 ;              
        emitters[2].colorStartSpread = new THREE.Vector3(5+ fft_co/25, 5-fft_co/50, 5+fft_co/10);               
        emitters[0].particlesPerSecond = 50 + fft_co*36 ;
        emitters[0].speed = -4 + fft_co/3.2 ;
        emitters[0].sizeStart = 2 + fft_co/5 ;              
        emitters[0].radius = 28 - fft_co/30 ;
        emitters[2].radius = 10 + fft_co/36 ;
}

var currentvalue = new Array();
var frameBufferSize = 8192;
var bufferSize = frameBufferSize/4;
var signal = new Float32Array(bufferSize);
var peak = new Float32Array(bufferSize);
var fft = new FFT(bufferSize, 44100);

function audioAvailable(event) {
    // Copy input arrays to output arrays to play sound
    var inputArrayL = event.inputBuffer.getChannelData(0);
    var inputArrayR = event.inputBuffer.getChannelData(1);
    var outputArrayL = event.outputBuffer.getChannelData(0);
    var outputArrayR = event.outputBuffer.getChannelData(1);
    
    var n = inputArrayL.length;
    for (var i = 0; i < n; ++i) {
        outputArrayL[i] = inputArrayL[i];
        outputArrayR[i] = inputArrayR[i];
        signal[i] = (inputArrayL[i] + inputArrayR[i]) / 2;      // create data frame for fft - deinterleave and mix down to mono
    } 
    // perform forward transform
    fft.forward(signal);
    
    for ( var i = 0; i < bufferSize/8; i++ ) {
        magnitude = fft.spectrum[i] * 50000;                     // multiply spectrum by a zoom value
        //if (i%1000 == 0) { console.log(magnitude); }
        currentvalue[i]= magnitude;
        fft_co = magnitude;
		fft2Particles(fft_co, particleGroup.emitters);
    }
}

// begin doing stuff
var jsProc = context.createScriptProcessor(8192);
jsProc.onaudioprocess = audioAvailable;
loadSound('http://localhost:8080/audio/02%20Kickflip.mp3');

setTimeout(function() { 
	playSound(musicBuffer, jsProc) ; 
	jsProc.connect(context.destination);
} , 7500);
console.log('STARTING...');
