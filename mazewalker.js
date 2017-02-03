const TILE_WIDTH = 32

var walls = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
						 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
					   [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
						 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
					   [1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
					   [1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
						 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
						 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
						 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
						 [1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
						 [1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
						 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
					   [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]]

var canvas = document.getElementById('maze');
var ctx = canvas.getContext('2d');

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var gain = audioCtx.createGain();
gain.gain.value = 0.1;
gain.connect(audioCtx.destination);

state = { state: "loading" };

var man = new Image();
man.src = "man.png";

let imagesLoaded = 0;


[man].map( image => {
	image.onload = () => {
		imagesLoaded += 1;
		if (imagesLoaded == 1)
			startGame();
	}
});

function startGame() {
	state = {
		state: "playing",
		player: {
			x: 295,
			y: 175,
			vx: 0,
			vy: 0
		}
	}
	// console.log(state.walls.wall1)
	//gameLoop()
	 window.setInterval(gameLoop, 10);
}

function gameLoop() {
	drawScreen();
	if (state.state == "playing")
		updateState();
}

function drawScreen() {
	ctx.clearRect(0, 0, 640, 400);
	ctx.drawImage(man, state.player.x, state.player.y, 30, 30);
	drawWalls(walls)
}

function updateState() {
	let newX = state.player.x + state.player.vx;
	let newY = state.player.y + state.player.vy;
	if (!collisionDetection(walls, newX, newY)) {
		state.player.x = newX;
		state.player.y = newY;
	}
}

function drawWall(topX, topY, xLength, yLength) {
    ctx.beginPath();
    ctx.rect(topX, topY, xLength, yLength);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawWalls(walls) {
	for (var column = 0; column < walls.length; column++) {
		for (var row = 0; row < walls[column].length; row++) {
			if (walls[column][row]) {
				drawWall(row * TILE_WIDTH, column * TILE_WIDTH, TILE_WIDTH, TILE_WIDTH)
			}
		}
	}
}

function collisionDetection(walls, newX, newY) {
	if (newY < 10)
		return true;
	if (newY > 360)
		return true;
	if (newX < 10)
		return true;
	if (newX > 600)
		return true;

	for (var column = 0; column < walls.length; column++) {
		for (var row = 0; row < walls[column].length; row++) {
			if (newX > row * TILE_WIDTH - 32 && newX < row * TILE_WIDTH + TILE_WIDTH && newY > column * TILE_WIDTH - 32 && newY < column * TILE_WIDTH + TILE_WIDTH && walls[column][row] == 1 ) {
				return true
			}
		}
	}

	//wall detection
	// if (newX < state.walls.wall1.topX + state.walls.wall1.xLength && newX > state.walls.wall1.topX - 30 && newY < state.walls.wall1.topY + state.walls.wall1.yLength && newY > state.walls.wall1.topY - 30) {
	// 	return true;
	// }
}


window.onkeyup = (event) => {
	if (state.state == "playing") {
		if (event.keyCode == 38 && state.player.vy < 0 ||
			event.keyCode == 40 && state.player.vy > 0) {
			state.player.vy = 0;
		}
		if (event.keyCode == 37 && state.player.vx < 0 ||
			event.keyCode == 39 && state.player.vx > 0) {
			state.player.vx = 0;
		}
	}
}

window.onkeydown = (event) => {
	if (state.state == "playing") {
		if (event.keyCode == 37)
			state.player.vx = -2;
		else if (event.keyCode == 38)
			state.player.vy = -2;
		else if (event.keyCode == 39)
			state.player.vx = 2;
		else if (event.keyCode == 40)
			state.player.vy = 2;
	}
}
