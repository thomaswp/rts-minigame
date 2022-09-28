import { DisplayObject } from "pixi.js";
import { World } from "../world/World";

export abstract class BaseObject {

    id = 'abcd';
    elapsedFrames = 0;
    world: World;

    get g() { return  this.getDisplayObject() };

    abstract getDisplayObject() : DisplayObject;

    update(delta: number) {
        this.elapsedFrames += delta;
    }

}