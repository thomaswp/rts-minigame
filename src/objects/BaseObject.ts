import { DisplayObject } from "pixi.js";
import { Action, Updatable, UpdateFunction, Updater } from "../util/Action";
import { World } from "../world/World";

export abstract class BaseObject implements Updater {

    id = 'abcd';
    elapsedFrames = 0;
    world: World;
    updatables = [] as Updatable[];

    get g() { return this.getDisplayObject(); }
    get isInWorld() { return this.world.objects.includes(this); }

    abstract getDisplayObject() : DisplayObject;

    onAddedToWorld(): void {};

    update(delta: number) {
        this.elapsedFrames += delta;
        this.updatables.forEach(u => u.update(delta));
    }

    run(update: UpdateFunction) : Action {
        let action = new Action(this, update);
        action.run();
        return action;
    }

    die() {
        this.world.removeObject(this);
    }

    doEvery(action, frames) {
        this.run(action)
        .wait(frames)
        .then(() => this.doEvery(action, frames));
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

    distanceTo(obj: BaseObject) {
        return this.distanceToXY(obj.g.x, obj.g.y);
    }
}