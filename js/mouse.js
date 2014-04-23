var mousePos = {"x" : 0, "y" : 0};

$(document).ready(function() {

$('html').mousemove(function(event){
	//console.log("mouse move X:"+event.pageX+" Y:"+event.pageY);
	mousePos.x = event.pageX
	mousePos.y = event.pageY

	console.log(mousePos);
    }
);






});

