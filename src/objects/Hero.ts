import { DisplayObject, Graphics } from "pixi.js";
import { WorldObject } from "./WorldObject";
import { Projectile } from "./projectile/Projectile";

export class Hero extends WorldObject {
  graphics: Graphics;

  constructor() {
    super();
    this.graphics = new Graphics();
    this.g.x = 50;
    this.g.y = 50;
    this.updateGraphics();
    this.g.interactive = true;
    // this.g.on("pointerdown", () => this.shoot());
  }

  updateGraphics() {
    let myShape = this.graphics;
    myShape.clear();
    myShape.lineStyle(2, 0x993333);
    myShape.beginFill(0xcc3333);
    myShape.drawRect(-15, -15, 30, 30);
    myShape.endFill();
    // myShape.beginFill(0x0000ff);
    // myShape.drawCircle(15, 15, (this.elapsedFrames / 60) % 5);
    // myShape.endFill();
  }

  getDisplayObject(): DisplayObject {
    return this.graphics;
  }

  update(): void {
    super.update();
    this.updateGraphics();
  }
}
