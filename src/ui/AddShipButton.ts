import { DisplayObject, Graphics } from "pixi.js";
import { BlobShip } from "../objects/ships/BlobShip";
import { Ship } from "../sync/GameSchema";
import { Sync } from "../sync/Sync";
import { Button } from "./Button";
import { InterfaceObject } from "./InterfaceObject";

export class AddShipButton extends Button {
    
    color: number;
    size: number

    constructor(size: number, color: number) {
        super();   
        this.size = size;
        this.color = color;
    }
    
    onPressed(): void {
        let ship = new Ship()
        ship.type = BlobShip.name;
        ship.x = Sync.random.floatRange(-300, 300);
        ship.y = Sync.random.floatRange(-200, 200);
        ship.team = Sync.random.boolean() ? 0xcc3333 : 0x3333cc;
        Sync.room.send('addShip', ship);
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
    
    update(): void {
        super.update();
        this.updateGraphics();
        let scale =  1 + 0.05 * Math.cos(this.elapsedFrames / 20);
        this.g.scale.x = this.g.scale.y = scale;
    }
}