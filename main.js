var area = null;

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

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
        switch (this.objA.objId + ":" + this.objB.objId) {
            case "circ:circ": {
                this.CC(this.objA, this.objB);
                break;
            }

            case "circ:rect": {
                this.CS(this.objA, this.objB);
                break;
            }

            case "rect:circ": {
                this.CS(this.objB, this.objA);
                break;
            }

            case "rect:rect": {
                this.SS(this.objA, this.objB);
                break;
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
            console.log("circles colliding!");
        }
    },

    /*CS(a, b) {
        let rectTL = [b.posX, b.posY];
        let rectTR = [...rectTL];
        rectTR[0] += b.size[0];
        let rectBL = [...rectTL];
        rectBL[1] -= size[1];
        let rectBR = [...rectTR];
        rectBR[1] -= size[1];
    },*/

    CS(a, b) {
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
            console.log("circle and rect colliding!");
        }
    },

    SS(a, b) {
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
            if (
                corner[0] > bRectTL[0] &&
                corner[0] < bRectTR[0] &&
                corner[1] < bRectBL[1] &&
                corner[1] > bRectTL[1]
            ) {
                console.log("rects colliding!");
            }
        }
        for (let corner of [bRectTL, bRectTR, bRectBL, bRectBR]) {
            if (
                corner[0] > aRectTL[0] &&
                corner[0] < aRectTR[0] &&
                corner[1] > aRectTL[1] &&
                corner[1] < aRectBL[1]
            ) {
                console.log("rects colliding!");
            }
        }
    },

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
