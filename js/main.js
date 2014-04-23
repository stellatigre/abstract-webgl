var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var cubes = [];
camera.position.z = 8;
camera.position.z = 8;

function randInt(min,max){
	return Math.floor(Math.random() * (max-min)+1);
}

function randomPos(shape, range) {

	shape.applyMatrix( new THREE.Matrix4().makeTranslation(
		randInt(-range,range),randInt(-range,range),randInt(-range,range)
		)
	);
}

function moveToMouse(shape){
	shape.applyMatrix( new THREE.Matrix4().makeTranslation(
		mousePos.x/100, mousePos.y/100, 0
		)
	);	
}

function makeCube(size) {
	
	var randColor = '#'+Math.floor(Math.random()*16777215).toString(16);
	var geometry =  new THREE.CubeGeometry(size,size,size);
	var material = new THREE.MeshBasicMaterial( { color: randColor } );
	var cube = new THREE.Mesh( geometry, material );
	
	scene.add(cube);
	cubes.push(cube);
	return cube
}

function render() {
	requestAnimationFrame(render);
	cubes.forEach(function(cube, index, array) {
		cube.rotation.x += 0.1;
		cube.rotation.y += 0.1;
		cube.position.x -= 0.1;
	});
	renderer.render(scene, camera);
}

makeCube()
// big cubes
setInterval(function(){
	makeCube(2);
}, 250);

// medium cubes
setInterval(function(){
	var cube = makeCube(1); 
	randomPos(cube, 1);
}, 100);

//tiny cubes
setInterval(function() { 
	var cube = makeCube(0.5);	
	moveToMouse(cube);
}, 25);


render();
