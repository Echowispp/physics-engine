var area = null;

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let p = document.getElementById("resultParagraph");

let selectedShape = null;

let mouseX = 0;
let mouseY = 0;

function resizeCanvas() {
    canvas.width = area.width;
    canvas.height = area.height;
}

window.addEventListener("load", function () {
    requestAnimationFrame(resizeCanvas);
    area = canvas.getBoundingClientRect();
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
    var letter = "A";

    if (mesh.objA.defined == true) {
        letter = "B";
    }
    if (mesh.objB.defined == true) {
        return;
    }
    let obj = mesh["obj" + letter];

    if (selectedShape == "circ") {
        var radius = 40;

        ctx.beginPath();
        ctx.arc(mouseX, mouseY, radius, 0, 2 * Math.PI);
        ctx.fill();

        obj.posX = mouseX;
        obj.posY = mouseY;
        obj.size = radius;
        obj.objId = "circ";
        obj.defined = true;
    }

    if (selectedShape == "rect") {
        ctx.fillRect(mouseX, mouseY, 70, 50);

        obj.posX = mouseX;
        obj.posY = mouseY;
        obj.size = [70, 50];
        obj.objId = "rect";
        obj.defined = true;
    }
    if (letter == "B") {
        // basically, if this is the second time around
        mesh.doCollisions();
    }
});

let mesh = {
    //inside a mesh (technically called an 'object' in javascript slang) for easier expansion later on
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

    doCollisions() {
        let collision = "";
        switch (this.objA.objId + ":" + this.objB.objId) {
            case "circ:circ": {
                collision = this.CC(this.objA, this.objB);
                break;
            }

            case "circ:rect": {
                collision = this.CR(this.objA, this.objB);
                break;
            }

            case "rect:circ": {
                collision = this.CR(this.objB, this.objA);
                break;
            }

            case "rect:rect": {
                collision = this.RR(this.objA, this.objB);
                break;
            }
        }
        switch (collision) {
            case "circ:circ": {
                p.textContent =
                    "Detected circle-circle collision! Refresh to reset";
                break;
            }
            case "circ:rect": {
                p.textContent =
                    "Detected circle-rectangle collision! Refresh to reset";
                break;
            }
            case "rect:rect": {
                p.textContent =
                    "Detected rectangle-rectangle collision! Refresh to reset";
                break;
            }
            default: {
                p.textContent = "No collision detected! Refresh to reset";
            }
        }
    },

    // ===================
    // COLLISION FUNCTIONS
    // ===================

    CC(a, b) {
        const posAX = a.posX;
        const posAY = a.posY;
        const posBX = b.posX;
        const posBY = b.posY;

        const dX = posAX - posBX;
        const dY = posAY - posBY;

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
        } else if (a.posY > rectTL[1]) {
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
        let aRectTL = [a.posX, a.posY];
        let aRectTR = [a.posX + a.size[0], a.posY];
        let aRectBL = [a.posX, a.posY + a.size[1]];
        let aRectBR = [a.posX + a.size[0], a.posY + a.size[1]];

        let rectA = [aRectTL, aRectTR, aRectBL, aRectBR];

        let bRectTL = [b.posX, b.posY];
        let bRectTR = [b.posX + b.size[0], b.posY];
        let bRectBL = [b.posX, b.posY + b.size[1]];
        let bRectBR = [b.posX + b.size[0], b.posY + b.size[1]];

        let rectB = [bRectTL, bRectTR, bRectBL];

        console.log(rectA, rectB);
        for (corner of rectA) {
            // check each corner
            if (
                //is that corner inside the other rectangle
                corner[0] > bRectTL[0] &&
                corner[0] < bRectTR[0] &&
                corner[1] < bRectBL[1] &&
                corner[1] > bRectTL[1]
            ) {
                return "rect:rect";
            }
        }
        for (let corner of rectB) {
            // same here
            if (
                corner[0] > aRectTL[0] &&
                corner[0] < aRectTR[0] &&
                corner[1] > aRectTL[1] &&
                corner[1] < aRectBL[1]
            ) {
                return "rect:rect";
            }
        }
    },

    // This is here purely for if I continue expanding this project to polygons, does nothing at the moment

    /*isInside(edges, xp, yp) {
        let cnt = 0;
        for (let edge of edges) {
            const [x1, y1] = edge[0];
            const [x2, y2] = edge[1];

            if ((yp < y1) !== (yp < y2) &&
                xp < x1 + ((yp - y1) / (y2 - y1)) * (x2 - x1)) {
                cnt += 1;
                }
        }
        return cnt % 2 === 1;
    } */
};
