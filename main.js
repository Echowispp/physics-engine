let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let selectedShape = null;
let mouseX = 0;
let mouseY = 0;

window.addEventListener("load", function () {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
});

function onCircButtonPressed() {
    selectedShape = "circ";
    console.log(mesh);
}

canvas.addEventListener("click", function (event) {
    if (!selectedShape) {
        return;
    }
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;

    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#a20";

    if (selectedShape == "circ") {
        var radius = 40;
        var letter = "A";

        if (mesh.objA.defined == true) {
            letter = "B";
        }
        if (mesh.objB.defined == true) {
            return;
        }

        ctx.beginPath();

        ctx.arc(mouseX, mouseY, radius, 0, 2 * Math.PI);
        ctx.fill();

        let obj = mesh["obj" + letter];
        if (!obj.defined) {
            obj.pos = [mouseX, mouseY];
            obj.size = radius;
            obj.objId = "circ";
            obj.defined = true;
        }
        console.log(obj);
    }
});

let mesh = {
    objA: {
        pos: [0, 0],
        size: 0,
        objId: "",
        defined: false,
    },
    objB: {
        pos: [0, 0],
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

    CS(a, b) {
        return;
    },

    CC(a, b) {
        console.log("CC called!");
        return;
    },

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
