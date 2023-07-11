import { Level } from "../level.js";
import { intersectSegmentCircle, renderPolygon } from "../utils/utils.js";
import { Vec2 } from "../vec2.js";
import { Entity } from "./entity.js";

export class Sentinel extends Entity {

  constructor(x, y, level) {
    super(x, y, level);

    /*
    const img = new Image();
    img.src = "/hide-and-seek-master/resources/css/grass.jpg";
    var pat = ctx.createPattern(img, '');
    super.fillStyle = pat;
    */
    //super.fillStyle = "#ffff11";
    this.breakTime = 10;
    this.time = 5;

    this.viewAngle = 0.32;

    this.attackSpeed = 6;
    this.normalSpeed = 3;
    this.speed = this.normalSpeed;

    this.viewPoints = null;
  }

  onMissRoute() {
    if(!this.tryToAttack(this.player)) {
      this.speed = this.normalSpeed;
      this.needUpdate = true;
      this.findRoute();
    }
  }

  tryToAttack(entity) {
    if(this.isVisible(entity)) {
      super.walkTo(entity.position.x, entity.position.y);
      this.speed = this.attackSpeed;
      this.needUpdate = true;
      return true;
    }
    return false;
  }

  findRoute() {
    new Promise(() => {
      this.time = 0;
      const x = Math.floor(Level.TILE_SIZE * Math.random() * this.level.cols);
      const y = Math.floor(Level.TILE_SIZE * Math.random() * this.level.rows);
      super.walkTo(x, y);
    });
  }

  update(dt) {
    super.update(dt);

    if(this.needUpdate) {
      const angle = this.speed === this.attackSpeed ? Math.PI : this.viewAngle;
      this.viewPoints = this.computeViewPoints(angle, 200);
      this.tryToAttack(this.player);
    }    
      
  }

  isVisible(entity) {
    if(this.viewPoints && this.viewPoints.length > 1) {
      let center = this.position;
      for(let i = 0; i < this.viewPoints.length; ++i) {
        let p = this.viewPoints[i];
        if(intersectSegmentCircle(center, p, entity.position, entity.radius * entity.radius)) {
          return true;
        }
      }
    }
    return false;
  }

  render(camera) {     
    // render view points   
    if(this.viewPoints) {
      const fillStyle = this.speed == this.normalSpeed ? '#5F5' : '#F55';
      renderPolygon(camera.context, [this.position, ...this.viewPoints], fillStyle, 0.25);
    }
    super.render(camera);     
  }

}
