import { DisplayObject, Graphics } from "pixi.js";
import { BaseObject } from "./BaseObject"

export class Battler extends BaseObject {

    graphics: Graphics;

    constructor() {
        super();
        this.graphics = new Graphics();
        this.graphics = this.updateGraphics();

        this.g.x = 150;
        this.g.y = 50;
    }

    updateGraphics() {
        let myShape = this.graphics;
        myShape.clear();
        myShape.lineStyle(2, 0x993333);
        myShape.beginFill(0xcc3333);
        myShape.drawCircle(0, 0, 30);
        myShape.endFill();

        return myShape;
    }

    getDisplayObject(): DisplayObject {
        return this.graphics;
    }

    update(delta: number): void {
        super.update(delta);
        this.updateGraphics();
    }

}

