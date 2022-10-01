import { DisplayObject, Graphics } from "pixi.js";
import { InterfaceObject } from "./InterfaceObject";

export class Button extends InterfaceObject {
    
    graphics: Graphics;
    color: number;
    size: number

    constructor(size: number, color: number) {
        super();   
        this.graphics = new  Graphics();
        this.size = size;
        this.color = color;
        this.updateGraphics();
    }

    getDisplayObject(): DisplayObject {
        return this.graphics;
    }

    updateGraphics() {
        let myShape = this.graphics;
        myShape.clear();
        myShape.lineStyle(2, this.color / 2);
        myShape.beginFill(this.color);
        let size = this.size;
        myShape.drawCircle(0, 0, size);
        myShape.drawCircle(size, 0, 3);
        myShape.endFill();

        return myShape;
    }
    
    update(delta: number): void {
        super.update(delta);
        this.updateGraphics();
        let scale =  1 + 0.05 * Math.cos(this.elapsedFrames / 20);
        this.g.scale.x = this.g.scale.y = scale;
    }
}