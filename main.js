//=============
// DEFINITIONS
//=============

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let resultParagraph = document.getElementById("resultParagraph");

let selectedShape = null;

let mouseX = 0;
let mouseY = 0;

function resizeCanvas() {
	const area = canvas.getBoundingClientRect();
	canvas.width = area.width;
	canvas.height = area.height;
}

window.addEventListener("load", function () {
	requestAnimationFrame(resizeCanvas);
});

function onCircButtonPressed() {
	selectedShape = "circ";
}

function onRectButtonPressed() {
	selectedShape = "rect";
}

// =============
// SHAPE DRAWING
// =============

canvas.addEventListener("click", function (event) {
	if (!selectedShape) {
		return;
	}
	const rect = canvas.getBoundingClientRect();
	mouseX = event.clientX - rect.left;
	mouseY = event.clientY - rect.top;

	ctx.fillStyle = "#a20";

	let object = {
		posX: null,
		posY: null,
		size: null,
		objId: null,
		defined: false,
	};

	mesh.shapes.push(object);

	if (selectedShape == "circ") {
		var radius = 40;

		ctx.beginPath();
		ctx.arc(mouseX, mouseY, radius, 0, 2 * Math.PI);
		ctx.fill();

		object.posX = mouseX;
		object.posY = mouseY;
		object.size = radius;
		object.objId = "circ";
		object.defined = true;
	}

	if (selectedShape == "rect") {
		ctx.fillRect(mouseX, mouseY, 70, 50);

		object.posX = mouseX;
		object.posY = mouseY;
		object.size = [70, 50];
		object.objId = "rect";
		object.defined = true;
	}
	if (mesh.shapes.length >= 2) {
		// basically, if this is the second time around
		mesh.doCollisions();
	}
});

let mesh = {
	//inside a mesh (technically called an object literal in javascript slang) for easier expansion later on
	shapes: [],

	/*
    objA: {
        posX: 0, // doing positions outside of arrays because I feel it's simpler for me to understand, it is slightly less efficient though
        posY: 0,
        size: 0,
        objId: "",
        defined: false,
    },
    objB: {
        posX: 0,
        posY: 0,
        size: 0,
        objId: "",
    },
    */

	doCollisions() {
		let collision = "";
		switch (this.shapes[0].objId + ":" + this.shapes[1].objId) {
			case "circ:circ": {
				collision = this.CC(this.shapes[0], this.shapes[1]);
				break;
			}

			case "circ:rect": {
				collision = this.CR(this.shapes[0], this.shapes[1]);
				break;
			}

			case "rect:circ": {
				collision = this.CR(this.shapes[1], this.shapes[0]);
				break;
			}

			case "rect:rect": {
				collision = this.RR(this.shapes[0], this.shapes[1]);
				break;
			}
		}
		switch (collision) {
			case "circ:circ": {
				resultParagraph.textContent =
					"Detected circle-circle collision! Refresh to reset";
				break;
			}
			case "circ:rect": {
				resultParagraph.textContent =
					"Detected circle-rectangle collision! Refresh to reset";
				break;
			}
			case "rect:rect": {
				resultParagraph.textContent =
					"Detected rectangle-rectangle collision! Refresh to reset";
				break;
			}
			default: {
				resultParagraph.textContent =
					"No collision detected! Refresh to reset";
			}
		}
	},

	// ===================
	// COLLISION FUNCTIONS
	// ===================

	CC(a, b) {
		const dX = a.posX - b.posX;
		const dY = a.posY - b.posY;

		const radii = a.size + b.size;

		const hypot = Math.sqrt(dX * dX + dY * dY);

		if (hypot < radii) {
			return "circ:circ";
		}
	},

	CR(a, b) {
		const rectTL = [b.posX, b.posY];
		const rectTR = [b.posX + b.size[0], b.posY];
		const rectBL = [b.posX, b.posY + b.size[1]];
		const rectBR = [b.posX + b.size[0], b.posY + b.size[1]];
		let closestPoint = [0, 0];

		// Find the closest point to the circle that is on the rectangle
		if (a.posX > rectTR[0]) {
			if (a.posY < rectTR[1]) {
				closestPoint = rectTR;
			} else if (a.posY > rectBR[1]) {
				closestPoint = rectBR;
			} else {
				closestPoint = [rectTR[0], a.posY];
			}
		} else if (a.posX < rectTL[0]) {
			if (a.posY < rectTL[1]) {
				closestPoint = rectTL;
			} else if (a.posY > rectBL[1]) {
				closestPoint = rectBL;
			} else {
				closestPoint = [rectTL[1], a.posY];
			}
		} else if (a.posY > rectBL[1]) {
			closestPoint = [a.posX, rectBL[1]];
		} else if (a.posY < rectTL[1]) {
			closestPoint = [a.posX, rectTL[1]];
		} else {
			closestPoint = [a.posX, a.posY];
		}

		const dx = a.posX - closestPoint[0];
		const dy = a.posY - closestPoint[1];

		const hypot = Math.sqrt(dx * dx + dy * dy);

		if (hypot < a.size) {
			return "circ:rect";
		}
	},

	RR(a, b) {
		let aRectangleTopLeft = [a.posX, a.posY];
		let aRectangleTopRight = [a.posX + a.size[0], a.posY];
		let aRectangleBottomLeft = [a.posX, a.posY + a.size[1]];
		let aRectangleBottomRight = [a.posX + a.size[0], a.posY + a.size[1]];

		let rectA = [
			aRectangleTopLeft,
			aRectangleTopRight,
			aRectangleBottomLeft,
			aRectangleBottomRight,
		];

		let bRectangleTopLeft = [b.posX, b.posY];
		let bRectangleTopRight = [b.posX + b.size[0], b.posY];
		let bRectangleBottomLeft = [b.posX, b.posY + b.size[1]];
		// we don't need the last corner, because the checks only check for where the corners are relative to other corners, and three corners are enough to define a rectangle

		let rectB = [
			bRectangleTopLeft,
			bRectangleTopRight,
			bRectangleBottomLeft,
		];

		for (corner of rectA) {
			// check each corner
			if (
				//is that corner inside the other rectangle
				corner[0] > bRectangleTopLeft[0] &&
				corner[0] < bRectangleTopRight[0] &&
				corner[1] < bRectangleBottomLeft[1] &&
				corner[1] > bRectangleTopLeft[1]
			) {
				return "rect:rect";
			}
		}
		for (let corner of rectB) {
			// same here
			if (
				corner[0] > aRectangleTopLeft[0] &&
				corner[0] < aRectangleTopRight[0] &&
				corner[1] > aRectangleTopLeft[1] &&
				corner[1] < aRectangleBottomLeft[1]
			) {
				return "rect:rect";
			}
		}
	},
};
