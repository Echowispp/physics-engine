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
    console.log(mesh);
}

function onRectButtonPressed() {
    selectedShape = "rect";
    console.log(mesh);
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

        console.log(obj);
    }

    if (selectedShape == "rect") {
        ctx.fillRect(mouseX, mouseY, 70, 50);

        obj.posX = mouseX;
        obj.posY = mouseY;
        obj.size = [70, 50];
        obj.objId = "rect";
        obj.defined = true;

        console.log(obj);
    }
});

let mesh = {
    objA: {
        posX: 0,
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
        return;
    },

    CS(a, b) {},

    SS(a, b) {
        return;
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
