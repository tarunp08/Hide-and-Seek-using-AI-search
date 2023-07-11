import { interpolate } from "./utils/utils.js";
import { Vec2 } from "./vec2.js";

export class Camera 
{
 static VIRTUAL_WIDTH  = 1920;
 static VIRTUAL_HEIGHT = 1080;
 constructor(canvas,x,y)
 {
  this.canvas = canvas;
  this.position = new Vec2(x, y);
  this.zoom = 1;
  this.rotation = 0;
  this.onresize();
  window.addEventListener("resize", this.onresize.bind(this));
  this.onresize();
 }
 update() 
 {
  this.context.restore();
  this.context.save();
  this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
  let hw = this.canvas.width * 0.5;
  let hh = this.canvas.height * 0.5;
  hw = Math.round(hw);
  hh = Math.round(hh);

  this.context.translate(hw, hh);
  this.context.rotate(this.rotation);
  this.context.translate(-hw, -hh);
  
  this.context.scale(this.zoom, this.zoom);
  let x = hw / this.zoom - this.position.x;
  let y = hh / this.zoom - this.position.y;
        x = Math.round(x * 10.0) / 10.0;
        y = Math.round(y * 10.0) / 10.0;

        this.context.translate(x, y);

        this.viewport = this.computeViewport();
    }

    onresize() {
      
        let w = this.canvas.clientWidth;
        let h = this.canvas.clientHeight;
        if (w > h) {
            this.canvas.width  = Camera.VIRTUAL_WIDTH;
            this.canvas.height = Camera.VIRTUAL_HEIGHT * (h / w);
        } else {
            this.canvas.width  = Camera.VIRTUAL_WIDTH * (w / h);
            this.canvas.height = Camera.VIRTUAL_HEIGHT;
        }
        this.context = this.canvas.getContext('2d');
        this.context.imageSmoothingEnabled = true;
    }

    screenToWorld(x, y) {
        const rect = canvas.getBoundingClientRect();
        let scaleX = this.canvas.width  / rect.width;
        let scaleY = this.canvas.height / rect.height;
        return new Vec2(x * scaleX + this.position.x - this.canvas.width  * 0.5
                       ,y * scaleY + this.position.y - this.canvas.height * 0.5);     
    }

    computeViewport() {

        let w = this.canvas.width / this.zoom;
        let h = this.canvas.height / this.zoom;

        let hw = w * 0.5;
        let hh = h * 0.5;

        let x, y, r = this.rotation;
        if (r != 0) {
            let cos = Math.abs(Math.cos(r));
            let sin = Math.abs(Math.sin(r));
            x = cos * hw + sin * hh;
            y = cos * hh + sin * hw;
        } else {
            x = hw;
            y = hh;
        }

        let x1 = this.position.x - x;
        let y1 = this.position.y - y;
        let x2 = this.position.x + x;
        let y2 = this.position.y + y;
        return {
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            getWidth: function() {
                return x2 - x1;
            },
            getHeight: function() {
                return y2 - y1;
            }
        };
    }

    drawViewport() {
        let viewport = this.computeViewport();
        this.context.beginPath();
        this.context.rect(viewport.x1, viewport.y1, viewport.getWidth(), viewport.getHeight());
        this.context.stroke();
    }

    follow(position, mapSize, dt) {
        let hw = this.canvas.width  * 0.5;
        let hh = this.canvas.height * 0.5;
        if (dt == undefined) {
            dt = 1;
        }
        this.position.x = Math.max(interpolate(this.position.x, position.x, dt), hw / this.zoom);
        this.position.x = Math.min(this.position.x, mapSize.width - hw / this.zoom);
        this.position.y = Math.max(interpolate(this.position.y, position.y, dt), hh / this.zoom);
        this.position.y = Math.min(this.position.y, mapSize.height - hh / this.zoom);
    }

}