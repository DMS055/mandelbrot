document.addEventListener("DOMContentLoaded", setup);

const pixelSize = 10;
let canvasWidth;
let canvasHeight;
maxIterations = 60;

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
	canvas.setAttribute("width", 400);
	canvas.setAttribute("height", 400);
	canvasWidth = canvas.width;
	canvasHeight = canvas.height;

	canvas.setAttribute("class", "mandelbrot-canvas");
	document.querySelector(".mandelbrot-canvas-container").appendChild(canvas);

	let testC = new Coordinate(-1, 0);

	console.log(determineIterations(testC));
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
	if (numIterations === maxIterations) {
		return { r: 0, g: 0, b: 0 }; // Black if inside the set
	} else {
		return {
			r: (numIterations / maxIterations) * 255,
			g: (numIterations / maxIterations) * 255,
			b: (numIterations / maxIterations) * 255,
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
		for (let i = 0; i < pixel.data.length; i += 4) {
			pixel.data[i] = xColumn; // Red
			pixel.data[i + 1] = yColumn; // Green
			pixel.data[i + 2] = 0; // Blue
			pixel.data[i + 3] = 255; // Alpha
		}
	}
}
