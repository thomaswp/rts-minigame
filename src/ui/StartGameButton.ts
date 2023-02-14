
import { Sync } from "../net/client/Sync";
import { Button } from "./Button";

export class StartGameButton extends Button {
    
    constructor() {
        super();   
    }
    
    onPressed(): void {
        Sync.messenger.tryStartRound.send();
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