import { Container } from "pixi.js";
import { WorldObject } from "../objects/WorldObject";
import { removeFrom } from "../util/MathUtil";
import { BaseObject, ObjectContainer } from "../world/BaseObject";
import { Game } from "../world/Game";
import { Button } from "./Button";
import { InterfaceObject } from "./InterfaceObject";

export class UI implements ObjectContainer {
    mainContainer: Container;
    game: Game;

    objects = [] as InterfaceObject[];

    constructor() {
        this.mainContainer = new Container();

        let button = new Button(30, 0xFF00FF);
        button.g.x = 50;
        button.g.y = 50;
        this.addObject(button);
    }

    removeObject(object: InterfaceObject): boolean {
        return removeFrom(this.objects, object);
    }

    addObject(obj: InterfaceObject) {
        // console.log('added ', obj.constructor.name, obj);
        obj.world = this;
        this.objects.push(obj);
        this.mainContainer.addChild(obj.g);
        obj.onAddedToWorld();
    }

    update(delta: number) {
        this.objects.forEach(obj => {
            obj.update(delta);
        });
    }
}