import { DisplayObject, Graphics } from "pixi.js";
import { BlobShip } from "../objects/ships/BlobShip";
import { Ship } from "../sync/GameSchema";
import { Sync } from "../sync/Sync";
import { Button } from "./Button";
import { InterfaceObject } from "./InterfaceObject";

export class StartGameButton extends Button {
    
    constructor() {
        super();   
    }
    
    onPressed(): void {
        Sync.room.send('startRound');
    }

    updateGraphics() {
        let myShape = this.graphics;
        myShape.clear();
        myShape.lineStyle(2, 0x444444);
        myShape.beginFill(0x999999);
        let size = 30;
        myShape.drawCircle(0, 0, size);
        myShape.endFill();

        return myShape;
    }
}