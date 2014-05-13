// Used in initParticles()
var particleGroup = {},
    particleCursor = {};
var projector = new THREE.Projector();
	
function groupToMouse(group) {

    var vector = new THREE.Vector3(
	( mousePos.x / window.innerWidth ) * 2 - 1,
	- ( mousePos.y / window.innerHeight ) * 2 + 1,
	0.5 );

    projector.unprojectVector( vector, camera );
    var dir = vector.sub( camera.position ).normalize();
    var distance = - camera.position.z / dir.z;
    var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );

    group.emitters.forEach(function(element, index, array) {
	element.position = pos;
    });
}
    
function mouseClicked() {
	var vector = new THREE.Vector3(
		( mouseClick.x / window.innerWidth ) * 2 - 1,
		-( mouseClick.y / window.innerHeight ) * 2 + 1,
	0.5 );

	projector.unprojectVector( vector, camera );
	var dir = vector.sub( camera.position ).normalize();
	var distance = 50;
	var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );
			
	//console.log(pos);
	makeCube(1, pos);
}

// Setup the scene
function initTrackball() {
	controls = new THREE.TrackballControls( camera );
	controls.rotateSpeed = 0.04;
	controls.zoomSpeed = 0.25;
	controls.panSpeed = 0.2;
	controls.noZoom = false;
	controls.noPan = false;
	controls.staticMoving = false;
	controls.dynamicDampingFactor = 0.8;
	controls.keys = [ 65, 83, 68 ];
}
	
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 10000);
    camera.position.z = 42;
    camera.lookAt( scene.position );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor(0x000000);
		
	initTrackball();

    //stats = new Stats();
    //clock = new THREE.Clock();
    //stats.domElement.style.position = 'absolute';
    //stats.domElement.style.top = '0';

    document.body.appendChild( renderer.domElement );
    //document.body.appendChild( stats.domElement );
}

function getMainEmitters() {
	var medium = new SPE.Emitter({
		type: 'sphere',
		position: new THREE.Vector3(0, 0, 0),
		radius: 28,
		speed: .20,
		colorStart: new THREE.Color('blue'),
		colorStartSpread: new THREE.Vector3(10, 10, 10),
		colorEnd: new THREE.Color('purple'),
		sizeStart: 6,
		sizeStartSpread: 4,
		sizeEnd: .5,
		opacityStart: .125,
		opacityMiddle: .75,
		opacityEnd: .5,
		particleCount: 20000,
		angleAlignVelocity: 1
	});
	var small = new SPE.Emitter({
		type: 'sphere',
		position: new THREE.Vector3(0, 0, 0),
		radius: 24,
		speed: .2,
		colorStart: new THREE.Color('purple'),
		colorStartSpread: new THREE.Vector3(5, 5, 25),
		colorEnd: new THREE.Color('green'),
		sizeStart: 2,
		sizeEnd: 1,
		opacityStart: .85,
		opacityMiddle: .6,
		opacityEnd: .3,
		particleCount: 60000,
		particlesPerSecond: 2000
	});   
	var smaller = new SPE.Emitter({
		type: 'sphere',
		position: new THREE.Vector3(-20, 30, 25),
		radius: 75,
		speed: 20,
		colorStart: new THREE.Color('purple'),
		colorStartSpread: new THREE.Vector3(10, 15, 40),
		colorEnd: new THREE.Color('azure'),
		sizeStart: 5,
		sizeEnd: .5,
		opacityStart: .25,
		opacityMiddle: .2,
		opacityEnd: .15,
		particleCount: 6000,
		particlesPerSecond: 1000
	});	
	var smaller2 = new SPE.Emitter({
		type: 'sphere',
		position: new THREE.Vector3(30, -20, -15),
		radius: 100,
		speed: 42,
		colorStart: new THREE.Color('purple'),
		colorStartSpread: new THREE.Vector3(-10, -15, -40),
		colorEnd: new THREE.Color('azure'),
		sizeStart: 5,
		sizeEnd: 2,
		opacityStart: .2,
		opacityMiddle: .3,
		opacityEnd: .4,
		particleCount: 6000,
		particlesPerSecond: 750
	});
	var center = new SPE.Emitter({
		type: 'sphere',
		position: new THREE.Vector3(0, 0, 0),
		radius: 10,
		speed: 2,
		colorStart: new THREE.Color('aqua'),
		colorStartSpread: new THREE.Vector3(10, -25, 50),
		colorEnd: new THREE.Color('orange'),
		sizeStart: 2,
		sizeEnd: 4,
		opacityStart: .5,
		opacityMiddle: .3,
		opacityEnd: .1,
		particleCount: 2000,
		particlesPerSecond: 400
	});

	return [medium, small, smaller, smaller2, center]
}

function makeCursorEmitters() {

    for (var n=1 ; n < 6 ; n++) {
		var dir = 1;
		if (n%2 != 0){ dir = -1; }	// alternate directions

		starEmitter = new SPE.Emitter({
			type: 'sphere',
			position: new THREE.Vector3(n*5*dir, n*5*dir, n*5*dir),
			positionSpread: new THREE.Vector3(n, n, n),
			radius: 2*n,
			speed: 1.25*n,
			colorStart: new THREE.Color('blue'),
			colorStartSpread: new THREE.Vector3(5+n*2, 5, 5),
			colorEnd: new THREE.Color('aquamarine'),
			colorEndSpread: new THREE.Vector3(10, 10, 10),
			sizeStart: .75,
			sizeEnd: 1.25,
			opacityStart: .8,
			opacityMiddle: .55,
			opacityEnd: .3,
			particleCount: 600,
			particlesPerSecond: 100
		});

		particleCursor.addEmitter( starEmitter );
    }
}

// Create particle group and emitter
function initParticles() {

	particleGroup = new SPE.Group({
		texture: THREE.ImageUtils.loadTexture('./img/star.png'),
		maxAge: 4
	});
	particleCursor = new SPE.Group({
		texture: THREE.ImageUtils.loadTexture('./img/smokeparticle.png'),
		maxAge: 1.25
	});
	
  	var mains = getMainEmitters(); 
	mains.forEach(function(emit) { particleGroup.addEmitter( emit ); } );
	makeCursorEmitters();

	scene.add( particleGroup.mesh );
	scene.add( particleCursor.mesh );
    console.log( particleCursor );
    console.log( particleGroup );

/*	document.querySelector('.numParticles').textContent =
		'Total particles: ' + emitter.numParticles; */
}

function animate() {
    requestAnimationFrame( animate );
	controls.update();
    // Using a fixed time-step here to avoid pauses
    render( 0.016 );
    //stats.update();
}

function updateCamera() {
    var now = Date.now() * 0.00025 + fft_co/100000 ;
    camera.position.x = Math.sin( now ) * 50;
    camera.position.z = Math.cos( now ) * 100;
    camera.lookAt( scene.position );
}

function render( dt ) {
    particleGroup.tick( dt );
    particleCursor.tick( dt );
    updateCamera();

	cubes.forEach(function(cube, index, array) {
		cube.rotation.x += 0.1;
		cube.rotation.y += 0.1;
	});

    renderer.render( scene, camera );
}
