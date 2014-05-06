cubes = [];
function makeCube(size, pos) {
	
	var randColor = '#'+Math.floor(Math.random()*16777215).toString(16);
	var geometry =  new THREE.CubeGeometry(size,size,size);
	var material = new THREE.MeshBasicMaterial( { color: randColor } );
	var cube = new THREE.Mesh( geometry, material );
	
	scene.add(cube);
	cubes.push(cube);
	return cube
}
