import { Container } from "pixi.js";
import { WorldObject } from "../objects/WorldObject";
import { removeFrom } from "../util/MathUtil";
import { BaseObject, ObjectContainer } from "../world/BaseObject";
import { InterfaceObject } from "./InterfaceObject";

export class UI implements ObjectContainer {
    mainContainer: Container;

    objects = [] as InterfaceObject[];

    constructor() {
        this.mainContainer = new Container();
    }

    removeObject(object: InterfaceObject): boolean {
        return removeFrom(this.objects, object);
    }

    addObject(obj: InterfaceObject) {
        obj.world = this;
        this.objects.push(obj);
        this.mainContainer.addChild(obj.g);
        obj.onAddedToWorld();
    }

    update(delta: number) {
        
    }
}