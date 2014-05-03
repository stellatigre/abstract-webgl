var mousePos = {"x" : 0, "y" : 0};
var mouseClick = {"x" : 0, "y" : 0};
$(document).ready(function() {

$('html').mousemove(function(event){
	mousePos.x = event.pageX
	mousePos.y = event.pageY
	//console.log(mousePos);
    }
);

$('html').mousedown(function(event){
	mouseClick.x = event.pageX;
	mouseClick.y = event.pageY;
	mouseClicked();
    }
);

});

