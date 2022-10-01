import { DisplayObject } from "pixi.js";
import { BaseObject } from "../objects/BaseObject";
import { Updatable } from "../util/Action";
import { BObject } from "../world/BObject";
import { UI } from "./UI";

export abstract class InterfaceObject extends BObject<UI> {

    update(delta: number): void {
        
    }
    
}