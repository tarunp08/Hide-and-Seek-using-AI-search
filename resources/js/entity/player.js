import { renderPolygon } from "../utils/utils.js";
import { Vec2 } from "../vec2.js";
import { PointLight } from "./point-light.js";

export class Player extends PointLight {

    constructor(x, y, level) {
        super(x, y, level);
        /*
    const img = new Image();
    img.src = "/hide-and-seek-master/resources/css/grass.jpg";
    var pat = ctx.createPattern(img, '');
    super.fillStyle = pat;
    */
        super.color = '#00AFF0';
        this.light = 1;
        this.speed = 10;
    }

    update(dt) {
        super.update(dt);

        if(this.light < 1) {
            this.light += dt * 0.05;
            if(this.light > 1) {
                this.light = 1;
            }
        }

        if(this.needUpdate) {      
            this.viewPoints = this.computeViewPoints(0.5, 200);
        }

    }

    // TODO : comment
   render(camera) {
        let fillStyle = '#5F3';
        renderPolygon(camera.context, [this.position, ...this.viewPoints], fillStyle, 0.25);
        super.render(camera)
    }

}