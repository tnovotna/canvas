
var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var RADIUS = 100;

var RADIUS_SCALE = 5;
var RADIUS_SCALE_MIN = 1;
var RADIUS_SCALE_MAX = 2;

var QUANTITY = 25;

var canvas;
var context;
var particles;

var mouseX = SCREEN_WIDTH * 2.5;
var mouseY = SCREEN_HEIGHT * 0.5;
var mouseIsDown = false;

function init() {

  canvas = document.getElementById( 'fire' );
  
  if (canvas && canvas.getContext) {
		context = canvas.getContext('2d');
		
		// Register event listeners
		window.addEventListener('mousemove', documentMouseMoveHandler, false);
		window.addEventListener('mousedown', documentMouseDownHandler, false);
		window.addEventListener('mouseup', documentMouseUpHandler, false);
		document.addEventListener('touchstart', documentTouchStartHandler, false);
		document.addEventListener('touchmove', documentTouchMoveHandler, false);
		window.addEventListener('resize', windowResizeHandler, false);
		
		createParticles();
		
		windowResizeHandler();
		
		setInterval( loop, 100 / 600 );
	}
}

function createParticles() {
	particles = [];
	
	for (var i = 0; i < QUANTITY; i++) {
		var particle = {
			size: 1,
			position: { x: mouseX, y: mouseY },
			offset: { x: 40, y: 10 },
			shift: { x: mouseX, y: mouseY },
			speed: 0.1+Math.random()*0.004,
			targetSize: 1,
			fillColor: '#' + (Math.random() * 0x404040 + 0xaaaaaa | 0).toString(16),
			orbit: RADIUS*.5 + (RADIUS * .5 * Math.random())
		};
		
		particles.push( particle );
	}
}

function documentMouseMoveHandler(event) {
	mouseX = event.clientX - (window.innerWidth - SCREEN_WIDTH) * .5;
	mouseY = event.clientY - (window.innerHeight - SCREEN_HEIGHT) * .5;
}

function documentMouseDownHandler(event) {
	mouseIsDown = true;
}

function documentMouseUpHandler(event) {
	mouseIsDown = false;
}

function documentTouchStartHandler(event) {
	if(event.touches.length == 1) {
		event.preventDefault();

		mouseX = event.touches[0].pageX - (window.innerWidth - SCREEN_WIDTH) * .5;;
		mouseY = event.touches[0].pageY - (window.innerHeight - SCREEN_HEIGHT) * .5;
	}
}

function documentTouchMoveHandler(event) {
	if(event.touches.length == 1) {
		event.preventDefault();

		mouseX = event.touches[0].pageX - (window.innerWidth - SCREEN_WIDTH) * .5;;
		mouseY = event.touches[0].pageY - (window.innerHeight - SCREEN_HEIGHT) * .5;
	}
}

function windowResizeHandler() {
	SCREEN_WIDTH = window.innerWidth;
	SCREEN_HEIGHT = window.innerHeight;
	
	canvas.width = SCREEN_WIDTH;
	canvas.height = SCREEN_HEIGHT;
}

function loop() {
	
	if( mouseIsDown ) {
		RADIUS_SCALE += ( RADIUS_SCALE_MAX - RADIUS_SCALE ) * (20);
	}
	else {
		RADIUS_SCALE -= ( RADIUS_SCALE - RADIUS_SCALE_MIN ) * (0.02);
	}
	
	RADIUS_SCALE = Math.min( RADIUS_SCALE, RADIUS_SCALE_MAX );
	
	context.fillStyle = 'rgba(0,0,0,0.05)';
		 context.fillRect(0, 0, context.canvas.width, context.canvas.height);
	
	for (i = 0, len = particles.length; i < len; i++) {
		var particle = particles[i];
		
		var lp = { x: particle.position.x, y: particle.position.y };

		
		// Follow mouse with some lag
		particle.shift.x += ( mouseX - particle.shift.x) * (particle.speed);
		particle.shift.y += ( mouseY - particle.shift.y) * (particle.speed);
		
		// Apply position
		particle.position.x = particle.shift.x + Math.cos(i + particle.offset.x) * (particle.orbit*RADIUS_SCALE);
		particle.position.y = particle.shift.y + Math.sin(i + particle.offset.y) * (particle.orbit*RADIUS_SCALE);
		

		
		particle.size += ( particle.targetSize - particle.size ) * 0.05;
		
		if( Math.round( particle.size ) == Math.round( particle.targetSize ) ) {
			particle.targetSize = 10 + Math.random() * 70;
		}
		
		context.beginPath();
		context.fillStyle = particle.fillStyle="#FF0000";
		context.strokeStyle = particle.fillStyle="#FF0000";
		context.lineWidth = particle.size;
		context.moveTo(lp.x, lp.y);
		context.lineTo(particle.position.x, particle.position.y);
		context.stroke();
		context.arc(particle.position.x, particle.position.y, particle.size/2, 0, Math.PI*2, true);
		context.fill();
	}
}

window.onload = init;