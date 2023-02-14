import { DisplayObject, Graphics } from "pixi.js";
import { FighterShip } from "../objects/ships/FighterShip";
import { Ship } from "../net/common/GameSchema";
import { Sync } from "../net/client/Sync";
import { Button } from "./Button";
import { InterfaceObject } from "./InterfaceObject";

export class AddAIButton extends Button {
    
    constructor() {
        super();   
    }
    
    onPressed(): void {
        Sync.messenger.tryAddAI.send();
    }

    updateGraphics() {
        let myShape = this.graphics;
        myShape.clear();
        myShape.lineStyle(2, 0x444444);
        myShape.beginFill(0x532663);
        let size = 30;
        myShape.drawCircle(0, 0, size);
        myShape.endFill();

        return myShape;
    }
}