import { Application, Point } from "pixi.js";
import { BaseObject } from "../objects/BaseObject";
import { Battler } from "../objects/Battler";
import { Hero } from "../objects/Hero";
import * as Keyboard from "pixi.js-keyboard";
import * as Mouse from "pixi.js-mouse";

export class World {

    app: Application;
    hero: Hero;

    gravity = 1;

    objects = [] as BaseObject[];

    constructor(app: Application) {
        this.app = app;

        this.hero = new Hero();
        this.hero.g.x = 50;
        this.hero.g.y = 50;
        this.addObject(this.hero);

        this.addObject(new Battler());
    }

    addObject(obj: BaseObject) {
        obj.world = this;
        this.objects.push(obj);
        this.app.stage.addChild(obj.g);
    }

    tick(delta) {
        // let func = (x, y) => 3 * x;
        // func(3, 4);

        // let forEach = function(array, thingToDo) {
        //     for (let item of array) {
        //         thingToDo(item);
        //     }
        // }

        // for (let obj of this.objects) {
        //     obj.update();
        // }

        this.objects.forEach(obj => {
            obj.update(delta);
        });
    }
}