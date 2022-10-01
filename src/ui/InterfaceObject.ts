import { DisplayObject } from "pixi.js";
import { WorldObject } from "../objects/WorldObject";
import { Updatable } from "../util/Action";
import { BaseObject } from "../world/BaseObject";
import { UI } from "./UI";

export abstract class InterfaceObject extends BaseObject<UI> {

    update(delta: number): void {
        
    }
    
}