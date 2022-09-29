import { DisplayObject, Graphics } from "pixi.js";
import { Action } from "../util/Action";
import { PhysicsObject } from "./PhysicsObject";

export class Projectile extends PhysicsObject {
  graphics: Graphics;
  color: number;
  lifespan: number;

  constructor(color = 0xcc3333, lifespan = 60) { // = 0xcc3333
    super();
    this.graphics = new Graphics();
    this.updateGraphics();
    this.decellerationFactor = 0.995;
    this.color = color;
    this.lifespan = lifespan;
  }

  updateGraphics() {
    let canvas = this.graphics;
    canvas.clear();
    canvas.lineStyle(2, this.color);
    canvas.beginFill(this.color);
    canvas.drawCircle(0, 0, 4);
    canvas.endFill();
  }

  getDisplayObject(): DisplayObject {
    return this.graphics;
  }

  update(delta: number): void {
    super.update(delta);
    this.updateGraphics();
    if (this.elapsedFrames > this.lifespan) {
      this.lifespan = Number.POSITIVE_INFINITY;
      this.run(delta => {
        this.g.alpha *= 0.9;
        return this.g.alpha < 0.01;
      }).then(() => this.die());
    }
  }
}
