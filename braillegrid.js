function fixWidth(intxt) {
	return intxt.replace(/\u2800/g, "<span>\u2801</span>");
}


function newGrid(w, h) {
	let grid = [];
        for (var i = 0; i < w; i++) {
		grid[i] = [];
		for (var j = 0; j < h; j++) {
			grid[i][j] = 0;
		}
	}
	return grid;
}

function braillify(grid, w, h) {
	var gsmall = newGrid(w/2, h/4);
	var translate = [[1,2,4,64],[8,16,32,128]];

	for (var x = 0; x < w; x++) {
		for (var y = 0; y < h; y++) {
			var xsmall = Math.floor(x/2);
			var ysmall = Math.floor(y/4);
			var tx = x % 2;
			var ty = y % 4;
			gsmall[xsmall][ysmall] += grid[x][y]*translate[tx][ty];
		}
	}
	return gsmall;
}


function output(grid, w, h) {
	var out = "";
	for (var y = 0; y < h; y++) {
		for (var x = 0; x < w; x++) {
			out = out + String.fromCharCode(0x2800 + grid[x][y]);
			//out = out + grid[x][y] + " ";
		}
		out = out + "<br>";
	} 
	return out;
}




var WIDTH = 32;
var HEIGHT = 32;
var GRID = newGrid(WIDTH, HEIGHT);

function update() {
	let nextGrid = newGrid(WIDTH, HEIGHT);
	for (var x = 0; x < WIDTH; x++) {
		for (var y = 0; y < HEIGHT; y++) {
			var n = neighbors(x, y);
			
			if (GRID[x][y] == 1 && (n < 2 || n > 3)) {
				nextGrid[x][y] = 0;
			} else if (GRID[x][y] == 0 && n == 3) {
				nextGrid[x][y] = 1;
			} else {
				nextGrid[x][y] = GRID[x][y];
			}
		}
	}
	GRID = nextGrid;
	var small = braillify(GRID, 32, 32);
	document.getElementById("dotmatrix").innerHTML = fixWidth(output(small,16,8));
}

function neighbors(x, y) {
	let count = 0;
	for (var i = (-1); i <= 1; i++) {
		for (var j = (-1); j <= 1; j++) {
			if (j != 0 || i != 0) {
				count += GRID[(x + i + WIDTH) % WIDTH][(y + j + HEIGHT) % HEIGHT];
			}
		}
	}
	return count;
}

window.onload = function() {
	for (var i = 0; i < 32; i++) {
		for (var j = 0; j < 32; j++) {
			if (Math.random() > 0.8) {
				GRID[i][j] = 1;
			}
		}
	}
	update();
	setInterval(update, 100);
}

