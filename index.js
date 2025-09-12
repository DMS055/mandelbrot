document.addEventListener("DOMContentLoaded", setup);

const pixelSize = 1;
let rowOffset;
let colOffset;
let canvasWidth;
let canvasHeight;
let maxIterations = 300;
let zoom = 140;
let magnification = 1;
let panX = 0;
let panI = 0;

class Coordinate {
	constructor(x, i) {
		this.x = x;
		this.i = i;
	}

	squareCoordinate() {
		return new Coordinate(
			this.x * this.x - this.i * this.i,
			2 * (this.x * this.i)
		);
	}

	addCoordinate(otherCoordinate) {
		return new Coordinate(
			this.x + otherCoordinate.x,
			this.i + otherCoordinate.i
		);
	}

	toString() {
		return `(${this.x}, ${this.i}i)`;
	}

	magnitude() {
		return Math.sqrt(this.x * this.x + this.i * this.i);
	}	
}

function setup() {
	const canvas = document.createElement("canvas");
	canvas.setAttribute("width", 600);
	canvas.setAttribute("height", 600);
	canvasWidth = canvas.width;
	canvasHeight = canvas.height;

	rowOffset = canvasWidth / 2 + 100;
	colOffset = canvasHeight / 2;

	window.addEventListener('keydown', inputHandler);

	function inputHandler(event) {
		const key = event.key.toLowerCase();
		switch (key) {
			// Zoom
			case "r":
				zoom *= 1.2;
				magnification *= 1.2;
				drawImage();
				break;
			case "t":
				zoom /= 1.2;
				magnification /= 1.2;
				drawImage();
				break;
			// Movement
			case "w":
				panI += 0.1 / magnification;
				drawImage();
				break;
			case "a":
				panX -= 0.1 / magnification;
				drawImage();
				break;
			case "s":
				panI -= 0.1 / magnification;
				drawImage();
				break;
			case "d":
				panX += 0.1 / magnification;
				drawImage();
				break;
			default:
				break;
		}
		console.log(key);
	}

	canvas.setAttribute("class", "mandelbrot-canvas");
	document.querySelector(".mandelbrot-canvas-container").appendChild(canvas);

	drawImage();
}

function determineIterations(c) {
	let numIterations = 0;

	let z = c;
	while (z.magnitude() < 2 && numIterations < maxIterations) {
		z = z.squareCoordinate().addCoordinate(c);
		numIterations++;
	}
	return numIterations;
}

function determineColor(numIterations) {
	if (numIterations == maxIterations) {
		return {
			r: 0,
			g: 0,
			b: 0
		}; // Black if inside the set
	} else {
		return {
			r: numIterations / maxIterations * 255,
			g: numIterations / maxIterations * 255,
			b: numIterations / maxIterations * 255
		};
		/*const hue = Math.floor(360 * numIterations / maxIterations);
		return hslToRgb(hue, 100, 50);*/
	}
}

function drawImage() {
	const canvas = document.querySelector(".mandelbrot-canvas");

	let xColumn;
	let yColumn;

	let ctx = canvas.getContext("2d");
	let pixel = ctx.getImageData(0, 0, 10, 10);

	for (yColumn = 0; yColumn < canvasHeight; yColumn += pixelSize) {
		for (xColumn = 0; xColumn < canvasWidth; xColumn += pixelSize) {
			colorPixel();
			ctx.putImageData(pixel, xColumn, yColumn);
		}
	}

	function colorPixel() {
		let convertedCoord = convertToCoord(xColumn, yColumn);
				let iterations = determineIterations(convertedCoord);
		let colorRes = determineColor(iterations);

		for (let i = 0; i < pixel.data.length; i += 4) {
			pixel.data[i] = colorRes.r; // Red
			pixel.data[i + 1] = colorRes.g; // Green
			pixel.data[i + 2] = colorRes.b; // Blue
			pixel.data[i + 3] = 255; // Alpha
		}
	}
}

/** 
* @param {number} rowI
* @param {column} columnI
* @returns {object}	
*/

function convertToCoord(rowI, columnI) {
	let convertX = (rowI - rowOffset) / zoom + panX;
	let convertI = (columnI - colOffset) / zoom + panI;
	return new Coordinate(convertX, convertI);
}