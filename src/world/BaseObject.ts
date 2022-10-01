import { DisplayObject } from "pixi.js";
import { Action, Updatable, UpdateFunction, Updater } from "../util/Action";
import { World } from "./World";

export interface ObjectContainer {
    objects: BaseObject<ObjectContainer>[];
    removeObject(object: BaseObject<ObjectContainer>): boolean;
}

export abstract class BaseObject<WorldType extends ObjectContainer> implements Updater {

    elapsedFrames = 0;
    world: WorldType;
    updatables = [] as Updatable[];

    get g() { return this.getDisplayObject(); }
    get isInWorld() { return this.world.objects.includes(this); }

    abstract getDisplayObject() : DisplayObject;

    onAddedToWorld(): void {};

    update() {
        this.elapsedFrames += 1;
        this.updatables.forEach(u => u.update());
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
}