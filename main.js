//=============
// DEFINITIONS
//=============

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let resultParagraph = document.getElementById("resultParagraph");
let toggleParagraph = document.getElementById("toggleParagraph");

let selectedShape = null;

let mouseX = 0;
let mouseY = 0;

let gravityToggle = true;

//=========
// PHYSICS
//=========

const gravity = 0.5;

function doPhysics() {
	for (let shape of shapes) {
		/*console.log(
			`Shape pre physics:

			Position: (${shape.posX}, ${shape.posY}),
			 Velocity: (${shape.velocityX}, ${shape.velocityY}), 
			 Size: ${shape.size}, 
			 Type: ${shape.objId}, 
			 Grounded: ${shape.onGround}`
		);*/
		if (shape.onGround == false && shape.gravity == true) {
			shape.velocityY += gravity;
		}

		if (shape.objId == "circ") {
			shape.posX = Math.min(
				shape.posX + shape.velocityX,
				canvas.width - shape.size
			);
			shape.posY = Math.min(
				shape.posY + shape.velocityY,
				canvas.height - shape.size
			);
			if (shape.posY <= canvas.height - shape.size) {
				shape.onground = true;
			}
		}

		if (shape.objId == "rect") {
			shape.posX = Math.min(
				shape.posX + shape.velocityX,
				canvas.width - shape.size[0]
			);
			shape.posY = Math.min(
				shape.posY + shape.velocityY,
				canvas.height - shape.size[1]
			);
			if (shape.posY <= canvas.height - shape.size[1]) {
				shape.onground = true;
			}
			if (shape.posX <= canvas.width - shape.size[0]) {
				console.log("out of bounds!");
			}
		}
		/*console.log(
			`Shape post physics:

			Position: (${shape.posX}, ${shape.posY}),
			 Velocity: (${shape.velocityX}, ${shape.velocityY}), 
			 Size: ${shape.size}, 
			 Type: ${shape.objId}
			 Grounded: ${shape.onGround}`
		);*/
	}
}

//=========
//  SETUP
//=========

function resizeCanvas() {
	const area = canvas.getBoundingClientRect();
	canvas.width = area.width;
	canvas.height = area.height;
}

window.addEventListener("load", () => {
	requestAnimationFrame(resizeCanvas);
	requestAnimationFrame(loop);
});

function loop() {
	requestAnimationFrame(loop);

	//console.log(`
	//	New frame!
	//	`);

	doCollisions();
	doPhysics();
	reDraw();
}

//=======
// INPUT
//=======

function onCircButtonPressed() {
	selectedShape = "circ";
}

function onRectButtonPressed() {
	selectedShape = "rect";
}

function toggleGravity() {
	console.log(`button pressed, gravityToggle pre-changes: ${gravityToggle}`);
	if (gravityToggle == true) {
		gravityToggle = false;
	} else if (gravityToggle == false) {
		gravityToggle = true;
	}
	console.log(`button pressed, gravityToggle post-changes: ${gravityToggle}`);

	toggleParagraph.textContent = `Gravity for next placed object: ${gravityToggle}`;
}

// ===============
//  SHAPE DRAWING
// ===============

function reDraw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for (let shape of shapes) {
		if (shape.objId == "circ") {
			ctx.beginPath();
			ctx.arc(shape.posX, shape.posY, shape.size, 0, 2 * Math.PI);
			ctx.fill();
		} else if (shape.objId == "rect") {
			ctx.fillRect(shape.posX, shape.posY, shape.size[0], shape.size[1]);
		}
	}
}

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
		velocityX: null,
		velocityY: null,
		onGround: false,
		gravity: gravityToggle,
	};

	shapes.push(object);

	if (selectedShape == "circ") {
		var radius = 40;

		ctx.beginPath();
		ctx.arc(mouseX, mouseY, radius, 0, 2 * Math.PI);
		ctx.fill();

		object.posX = mouseX;
		object.posY = mouseY;
		object.size = radius;
		object.objId = "circ";
		object.velocityX = 0;
		object.velocityY = 0;
	} else if (selectedShape == "rect") {
		let sizeX = 70;
		let sizeY = 50;

		ctx.fillRect(mouseX, mouseY, sizeX, sizeY);

		object.posX = mouseX;
		object.posY = mouseY;
		object.size = [sizeX, sizeY];
		object.objId = "rect";
		object.velocityX = 0;
		object.velocityY = 0;
	}
});

const shapes = [];

/*
    objA: {
        posX: 0, // doing positions outside of arrays because I feel it's simpler for me to understand, it is slightly less efficient though
        posY: 0,
        size: 0,
        objId: "",
    },
    objB: {
        posX: 0,
        posY: 0,
        size: 0,
        objId: "",
    },
    */

function doCollisions() {
	let totalCollisions = 0;

	for (let i = 0; i < shapes.length; i++) {
		for (let j = i + 1; j < shapes.length; j++) {
			let collision = "";
			switch (shapes[i].objId + ":" + shapes[j].objId) {
				case "circ:circ": {
					collision = this.CC(shapes[i], shapes[j]);
					break;
				}

				case "circ:rect": {
					collision = this.CR(shapes[i], shapes[j]);
					break;
				}

				case "rect:circ": {
					collision = this.CR(shapes[j], shapes[i]);
					break;
				}

				case "rect:rect": {
					collision = this.RR(shapes[i], shapes[j]);
					break;
				}
			}
			if (!(collision == "")) {
				totalCollisions += 1;
			}
		}
	}
	resultParagraph.textContent = `Total collisions: ${totalCollisions}`;
}

// ===================
// COLLISION FUNCTIONS
// ===================

function CC(a, b) {
	const dX = a.posX - b.posX;
	const dY = a.posY - b.posY;

	const radii = a.size + b.size;

	const hypot = Math.sqrt(dX * dX + dY * dY);

	if (hypot < radii) {
		return "circ:circ";
	} else {
		return "";
	}
}

function CR(a, b) {
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
	} else {
		return "";
	}
}

function RR(a, b) {
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

	let rectB = [bRectangleTopLeft, bRectangleTopRight, bRectangleBottomLeft];

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
	return "";
}
//};
