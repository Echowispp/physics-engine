let c = document.getElementById("canvas");
let ctx = c.getContext("2d");

function onButtonPressed() {
    ctx.fillStyle = "#a20";
    ctx.fillRect(20, 20, 75, 50);
}

let mesh = {
    /*objA: {
        pos: [x, y],
        size: r,
        objId: "",
    },
    objB: {
        pos: [x, y],
        size: r,
        objId: "",
    },*/

    doCollisions() {
        /*switch (this.objA.objId + ":" + this.objB.objId) {
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
        }*/
    },

    // COLLISION FUNCTIONS

    /*CS(a, b) {
        return;
    },

    CC(a, b) {
        return;
    },

    SS(a, b) {
        return;
    },*/

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
