import { DisplayObject, Graphics } from "pixi.js";
import { BaseObject } from "./BaseObject";
import { PhysicsObject } from "./PhysicsObject";

export class Projectile extends PhysicsObject {

    graphics: Graphics;

    constructor() {
        super();
        this.graphics = new Graphics();
        this.updateGraphics();
        this.decellerationFactor = 0.99;
    }

    updateGraphics() {
        let canvas = this.graphics;
        canvas.clear();
        canvas.lineStyle(2, 0x993333);
        canvas.beginFill(0xcc3333);
        canvas.drawCircle(0, 0, 4);
        canvas.endFill();
    }

    getDisplayObject(): DisplayObject {
        return this.graphics;
    }

    update(delta: number): void {
        super.update(delta);
        this.updateGraphics();
    }
}