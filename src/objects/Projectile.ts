import { DisplayObject, Graphics } from "pixi.js";
import { PhysicsObject } from "./PhysicsObject";

export class Projectile extends PhysicsObject {
  graphics: Graphics;
  color: number;
  lifespan: number;

  constructor(color = 0xcc3333, lifespan = 60) { // = 0xcc3333
    super();
    this.graphics = new Graphics();
    this.updateGraphics();
    this.decellerationFactor = 0.99;
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
      this.kill();
    }
  }

  kill() { // should all base objects have a kill function? should they just flag themselves as dead and then the world can clean up dead objects each update?
    let index = this.world.objects.indexOf(this);
    if (index !== -1) {
      this.world.objects.splice(index, 1); // is there a better way than just removing the object from the objects array? this ensures it won't update anymore, but can we/do we need to delete it?
      let canvas = this.graphics;
      canvas.clear();
      console.log('i die');
    }
  }
}
