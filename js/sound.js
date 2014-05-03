var musicBuffer = null;
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var fft_co = 1;

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




var theme = ["rgba(255, 255, 255,","rgba(240, 240, 240,","rgba(210, 210, 210,","rgba(180, 180, 180,","rgba(150, 150, 150,","rgba(120, 120, 150,","rgba(90, 90, 150,","rgba(60, 60, 180,","rgba(30, 30, 180,","rgba(0, 0, 200,","rgba(0, 0, 210,","rgba(0, 0, 220,","rgba(0, 0, 230,","rgba(0, 0, 240,","rgba(0, 0, 255,","rgba(0, 30, 255,","rgba(0, 60, 255,","rgba(0, 90, 255,","rgba(0, 120, 255,","rgba(0, 150, 255,"];

var histoindex = 0;
var histomax = 500;

histobuffer_x = new Array();
histobuffer_y = new Array();
histobuffer_t = new Array();
for (a=0;a<histomax;a++) {
    histobuffer_t[a] = 0;
}

maxvalue = new Array();
for (a=0;a<1024;a++) {
    maxvalue[a] = 0;
}

currentvalue = new Array();

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
        particleGroup.emitters[1].speed = -5 + currentvalue[i]/4 ;              
        particleGroup.emitters[1].particlesPerSecond = 20 + currentvalue[i]*42 ;
        particleGroup.emitters[1].sizeStart = 2 + magnitude/3 ;              
        particleGroup.emitters[1].colorStartSpread = new THREE.Vector3(5+ magnitude/20, 5-magnitude/100, 5+magnitude/6);               
        particleGroup.emitters[2].particlesPerSecond = 1000 + currentvalue[i]*5 ;
        particleGroup.emitters[2].sizeStart = 2 + magnitude/80 ;              
        particleGroup.emitters[2].speed = 2 + magnitude/50 ;              
        particleGroup.emitters[2].colorStartSpread = new THREE.Vector3(5+ magnitude/25, 5-magnitude/50, 5+magnitude/10);               
        particleGroup.emitters[0].particlesPerSecond = 50 + currentvalue[i]*42 ;
        particleGroup.emitters[0].speed = -10 + currentvalue[i]/4 ;
        particleGroup.emitters[0].sizeStart = 2 + magnitude/20 ;              
        particleGroup.emitters[0].radius = 28 - currentvalue[i]/42 ;
        particleGroup.emitters[2].radius = 10 + currentvalue[i]/42 ;
    }
}

var onError = function(err) { console.log('fucked something up'); }

// begin doing stuff

var jsProc = context.createScriptProcessor(8192);
//loadSound('http://localhost:8000/audio/ellseedeez.mp3');
//loadSound('http://localhost:8000/audio/06%205%20Lightning%20Bolt.mp3');
//loadSound('http://localhost:8000/audio/Hope%20Continuum.mp3');
loadSound('http://localhost:8000/audio/metropractice.mp3');
jsProc.onaudioprocess = audioAvailable;
setTimeout(function() { playSound(musicBuffer, jsProc) ; } , 6000);
setTimeout(function() { jsProc.connect(context.destination); }, 6000);
console.log('STARTING...');
