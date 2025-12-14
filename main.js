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

let ongoingTimeOut = false;

const keys = {};

const shapes = [];

//=========
// PHYSICS
//=========

let gravity = 0;

function doPhysics() {
	gravity = canvas.height * 0.0008;
	for (let shape of shapes) {
		if (shape.physics == false) {
			continue;
		}

		if (shape.onGround == false) {
			shape.forceY += gravity; // idk I could just get rid of the force stuff altogether but this makes it feel fancier
		} else if (!ongoingTimeOut) {
			ongoingTimeOut = true;
			setTimeout(() => {
				shape.onGround = false;
				ongoingTimeOut = false;
			}, 300);
		}

		if (shape.velocityX < shape.maxSpeed / 60) {
			shape.velocityX += shape.forceX;
		} else if (-1 * shape.velocityX < shape.maxSpeed / 60) {
			shape.velocityX += shape.forceX;
		}

		shape.velocityY += shape.forceY;

		shape.forceX = 0;
		shape.forceY = 0;

		if (shape.objId == "circ") {
			shape.posX = Math.min(
				shape.posX + shape.velocityX,
				canvas.width - shape.size
			);
			shape.posY = Math.min(
				shape.posY + shape.velocityY,
				canvas.height - shape.size
			);
			shape.posX = Math.max(shape.posX, 0 + shape.size);
			shape.posY = Math.max(shape.posY, 0 + shape.size);
			if (shape.posY > canvas.height - shape.size) {
				shape.velocityY = 0;
				shape.posY = canvas.height - shape.size;
				shape.onGround = true;
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
			shape.posX = Math.max(shape.posX, 0);
			shape.posY = Math.max(shape.posY, 0);
			if (shape.posY > canvas.height - shape.size[1]) {
				shape.velocityY = 0;
				shape.posY = canvas.height - shape.size[1];
				shape.onGround = true;
			}
		}
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

	requestAnimationFrame(initShapes);

	requestAnimationFrame(loop);
});

function loop() {
	requestAnimationFrame(loop);

	updateMovement();
	doCollisions();
	doPhysics();

	reDraw();
}

function initShapes() {
	const sizeX = 0.07 * canvas.width;
	const sizeY = 0.08 * canvas.width;
	const radius = 0.05 * canvas.width;

	for (let i = 0; i < Math.floor(canvas.width / sizeX) + 2; i++) {
		shapes[i] = {
			posX: i * sizeX - 5 * i, //second bit is so the little gaps get covered
			posY: canvas.height - sizeY,
			size: [sizeX, sizeY],
			objId: "rect",
			velocityX: 0,
			velocityY: 0,
			forceX: 0,
			forceY: 0,
			onGround: false,
			physics: false,
		};
	}
	shapes[shapes.length] = {
		posX: 0.3 * canvas.width,
		posY: 0.6 * canvas.height,
		size: [sizeX, sizeY],
		objId: "rect",
		velocityX: 0,
		velocityY: 0,
		forceX: 0,
		forceY: 0,
		onGround: false,
		physics: false,
	};
	shapes[shapes.length] = {
		posX: 0.5 * canvas.width,
		posY: 0.5 * canvas.height,
		size: [sizeX, sizeY],
		objId: "rect",
		velocityX: 0,
		velocityY: 0,
		forceX: 0,
		forceY: 0,
		onGround: false,
		physics: false,
	};
	shapes[shapes.length] = {
		posX: 0.8 * canvas.width,
		posY: 0.2 * canvas.height,
		size: [sizeX, sizeY],
		objId: "rect",
		velocityX: 0,
		velocityY: 0,
		forceX: 0,
		forceY: 0,
		onGround: false,
		physics: false,
	};
	shapes[shapes.length] = {
		posX: 0,
		posY: 0,
		size: radius,
		objId: "circ",
		velocityX: 0,
		velocityY: 0,
		forceX: 0,
		forceY: 0,
		onGround: false,
		physics: true,
		movement: true,
		maxSpeed: canvas.width * 0.8, // in px/min
	};
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
	if (gravityToggle == true) {
		gravityToggle = false;
	} else if (gravityToggle == false) {
		gravityToggle = true;
	}

	toggleParagraph.textContent = `Gravity for next placed object: ${gravityToggle}`;
}

window.addEventListener("keydown", (e) => {
	if (e.key === " ") {
		for (let shape of shapes) {
			if (shape.movement && shape.onGround) {
				shape.velocityY = -25 * gravity;
			}
		}
	} else {
		keys[e.key] = true;
	}
});

window.addEventListener("keyup", (e) => {
	keys[e.key] = false;
});

function updateMovement() {
	for (let shape of shapes) {
		if (!shape.movement) continue;

		if (keys["a"] && !keys["d"]) {
			shape.velocityX = -shape.maxSpeed / 60;
		} else if (keys["d"] && !keys["a"]) {
			shape.velocityX = shape.maxSpeed / 60;
		} else {
			shape.velocityX = 0;
		}
	}
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
		forceX: 0,
		forceY: 0,
		onGround: false,
		physics: gravityToggle,
	};

	shapes.push(object);

	const radius = 0.05 * canvas.width;

	if (selectedShape == "circ") {
		let posX = Math.min(mouseX, canvas.height - radius);
		let posY = Math.min(mouseY, canvas.height - radius);
		if (posX < 0) {
			posX = 0;
		}
		if (posY < 0) {
			posY = 0;
		}

		ctx.beginPath();
		ctx.arc(posX, posY, radius, 0, 2 * Math.PI);
		ctx.fill();

		object.posX = mouseX;
		object.posY = mouseY;
		object.size = radius;
		object.objId = "circ";
		object.velocityX = 0;
		object.velocityY = 0;
	} else if (selectedShape == "rect") {
		let sizeX = Math.sqrt(Math.PI) * radius;
		let sizeY = sizeX;

		// Make sure the shape inside the canvas bounds
		let posX = Math.min(mouseX, canvas.height - sizeX);
		let posY = Math.min(mouseY, canvas.height - sizeY);
		if (posX < 0) {
			posX = 0;
		}
		if (posY < 0) {
			posY = 0;
		}

		ctx.fillRect(posX, posY, sizeX, sizeY);

		object.posX = mouseX;
		object.posY = mouseY;
		object.size = [sizeX, sizeY];
		object.objId = "rect";
		object.velocityX = 0;
		object.velocityY = 0;
	}
});

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

//============
// COLLISIONS
//============

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

function CC(a, b) {
	const dx = a.posX - b.posX;
	const dy = a.posY - b.posY;

	const radii = a.size + b.size;

	const hypot = Math.sqrt(dx * dx + dy * dy);

	if (hypot < radii) {
		if (a.physics) {
			a.posX -= a.velocityX;
			a.posY -= a.velocityY;
			a.velocityX = 0;
			a.velocityY = 0;

			if (Math.abs(dy) > Math.abs(dx) && dy < 0) {
				a.onGround = true;
			}
		}
		if (b.physics) {
			b.posX -= b.velocityX;
			b.posY -= b.velocityY;
			b.velocityX = 0;
			b.velocityY = 0;

			if (Math.abs(dy) > Math.abs(dx) && dy > 0) {
				b.onGround = true;
			}
		}

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

	// Find the point out of the points on the rectangle that is the closest to the circle
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
			closestPoint = [rectTL[0], a.posY];
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
		if (a.physics) {
			if (Math.abs(dy) > Math.abs(dx)) {
				a.posY -= a.velocityY;
				a.velocityY = 0;
				if (dy < 0) {
					a.onGround = true;
				}
			} else {
				a.posX -= a.velocityX;
				a.velocityX = 0;
			}
		}

		if (b.physics) {
			b.posX -= b.velocityX;
			b.posY -= b.velocityY;
			b.velocityX = 0;
			b.velocityY = 0;
			if (Math.abs(dy) > Math.abs(dx) && dy > 0) {
				b.onGround = true;
			}
		}

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

	let rectB = [bRectangleTopLeft, bRectangleTopRight, bRectangleBottomLeft];

	for (corner of rectA) {
		if (
			corner[0] > bRectangleTopLeft[0] &&
			corner[0] < bRectangleTopRight[0] &&
			corner[1] < bRectangleBottomLeft[1] &&
			corner[1] > bRectangleTopLeft[1]
		) {
			const dx = a.posX - b.posX;
			const dy = a.posY - b.posY;
			if (a.physics) {
				a.posX -= a.velocityX;
				a.posY -= a.velocityY;
				a.velocityX = 0;
				a.velocityY = 0;
				if (Math.abs(dy) > Math.abs(dx) && dy < 0) {
					a.onGround = true;
				}
			}
			if (b.physics) {
				b.posX -= b.velocityX;
				b.posY -= b.velocityY;
				b.velocityX = 0;
				b.velocityY = 0;
				if (Math.abs(dy) > Math.abs(dx) && dy > 0) {
					b.onGround = true;
				}
			}

			return "rect:rect";
		}
	}
	for (let corner of rectB) {
		if (
			corner[0] > aRectangleTopLeft[0] &&
			corner[0] < aRectangleTopRight[0] &&
			corner[1] > aRectangleTopLeft[1] &&
			corner[1] < aRectangleBottomLeft[1]
		) {
			const dx = a.posX - b.posX;
			const dy = a.posY - b.posY;

			if (a.physics) {
				a.posX -= a.velocityX;
				a.posY -= a.velocityY;
				a.velocityX = 0;
				a.velocityY = 0;
				if (Math.abs(dy) > Math.abs(dx) && dy < 0) {
					a.onGround = true;
				}
			}
			if (b.physics) {
				b.posX -= b.velocityX;
				b.posY -= b.velocityY;
				b.velocityX = 0;
				b.velocityY = 0;
				if (Math.abs(dy) > Math.abs(dx) && dy > 0) {
					b.onGround = true;
				}
			}

			return "rect:rect";
		}
	}
	return "";
}
