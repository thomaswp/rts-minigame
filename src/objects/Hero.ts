import { DisplayObject, Graphics } from "pixi.js";
import { BaseObject } from "./BaseObject";
import { Projectile } from "./projectile/Projectile";

export class Hero extends BaseObject {
  graphics: Graphics;

  constructor() {
    super();
    this.graphics = new Graphics();
    this.g.x = 50;
    this.g.y = 50;
    this.updateGraphics();
    this.g.interactive = true;
    this.g.on("pointerdown", () => this.shoot());
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

  shoot() {
    let bullet = new Projectile(0x3333cc, 90);
    this.world.addObject(bullet);
    bullet.g.x = this.g.x + this.g.getBounds().width / 2;
    bullet.g.y = this.g.y;
    bullet.vy = 0;
    bullet.vx = 10;
  }

  getDisplayObject(): DisplayObject {
    return this.graphics;
  }

  update(delta: number): void {
    super.update(delta);
    this.updateGraphics();
  }
}
