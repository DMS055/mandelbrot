document.addEventListener("DOMContentLoaded", setup);

function setup() {
    const canvas = document.createElement("canvas");
    canvas.setAttribute("width", 400);
    canvas.setAttribute("height", 400);
    canvas.setAttribute("class", "mandelbrot-canvas");
    document.querySelector(".mandelbrot-canvas-container").appendChild(canvas);
}