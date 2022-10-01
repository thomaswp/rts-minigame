import { DisplayObject } from "pixi.js";
import { Action, Updatable, UpdateFunction, Updater } from "../util/Action";
import { BaseObject } from "../world/BaseObject";
import { World } from "../world/World";

export abstract class WorldObject extends BaseObject<World> implements Updater {

    elapsedFrames = 0;
    world: World;
    updatables = [] as Updatable[];

    get g() { return this.getDisplayObject(); }
    get isInWorld() { return this.world.objects.includes(this); }

    abstract getDisplayObject() : DisplayObject;

    shouldStayOnCamera(): boolean {
        return true;
    }

    directionTo(x: number, y: number) {
        let val = Math.atan2(y - this.g.y, x - this.g.x);
        // if (val < 0) val += Math.PI * 2;
        return val;
    }

    distanceToXY(x, y) {
        return Math.sqrt(
            Math.pow(x - this.g.x, 2) + 
            Math.pow(y - this.g.y, 2)
        );
    }

    distanceTo(obj: WorldObject) {
        return this.distanceToXY(obj.g.x, obj.g.y);
    }
}