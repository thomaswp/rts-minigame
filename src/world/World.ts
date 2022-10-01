import { Application, ArrayResource, Container, Graphics, Point, Runner } from "pixi.js";
import { WorldObject } from "../objects/WorldObject";
import { Battler } from "../objects/ships/Battler";
import { Hero } from "../objects/Hero";
import { PhysicsObject } from "../objects/PhysicsObject";
import { Updatable } from "../util/Action";
// import * as Keyboard from "pixi.js-keyboard";
// import * as Mouse from "pixi.js-mouse";
import * as Matter from 'matter-js';
import * as PolyDecomp from 'poly-decomp'
import * as hull from 'hull.js'
import { lerp } from "../util/MathUtil";
import { BlobShip } from "../objects/ships/BlobShip";
import { ObjectContainer } from "./BaseObject";

export class World implements ObjectContainer {
    
    width: number;
    height: number;

    hero: Hero;

    gravity = 0;

    objects = [] as WorldObject[];

    mainContainer: Container;
    gameStage: Container;
    stars = [] as Container[];

    engine: Matter.Engine;

    cameraX = 0;
    cameraY = 0;
    cameraZoom = 1;

    cameraTarget: WorldObject;

    constructor(width, height) {
        this.width = width;
        this.height = height;

        Matter.Common.setDecomp(PolyDecomp);
        this.engine = Matter.Engine.create({
            enableSleeping: true,
        });
        this.engine.gravity = {
            x: 0, y: 0, scale: 0.001,
        }

        this.mainContainer = new Container();
        this.mainContainer.x = width / 2;
        this.mainContainer.y = height / 2;

        this.createBackground();

        this.gameStage = new Container();
        this.gameStage.zIndex = 1;
        this.mainContainer.addChild(this.gameStage);

        // this.hero = new Hero();
        // this.addObject(this.hero);

        for (let i = 0; i < 10; i++) {
            this.addObject(new BlobShip(0xcc3333));
            this.addObject(this.cameraTarget = new BlobShip(0x3333cc));
        }

    }

    createBackground() {
        let star = new Graphics();
        star.clear();
        star.beginFill(0xFFFFFF);
        star.drawCircle(0, 0, 1.5);
        star.endFill();

        const range = 5000;
        const nStars = 500;

        for (let i = 0; i < 3; i++) {
            let field = new Container();
            field.zIndex = -(i + 1);
            this.stars.push(field)
            this.mainContainer.addChild(field);

            for (let i = 0; i < nStars; i++) {
                let s = star.clone();
                s.x = Math.random() * range - range / 2;
                s.y = Math.random() * range - range / 2;
                s.scale.x = s.scale.y = Math.random() * 0.5 + 0.75;
                field.addChild(s);
            }
        }
    }

    addObject(obj: WorldObject) {
        obj.world = this;
        this.objects.push(obj);
        this.gameStage.addChild(obj.g);
        obj.onAddedToWorld();
    }

    removeObject(obj: WorldObject) {
        let index = this.objects.indexOf(obj);
        if (index === -1) return false;
        this.objects.splice(index, 1);
        this.gameStage.removeChild(obj.g);
        return true;
    }

    updateCamera() {
        if (!this.cameraTarget.isInWorld || Math.random() < 0.002) {
            this.cameraTarget = this.objects[Math.floor(this.objects.length * Math.random())]
        }

        // this.cameraX = this.cameraTarget.g.x;
        // this.cameraY = this.cameraTarget.g.y;

        let cameraObjects = this.objects.filter(o => o.shouldStayOnCamera());

        let xs = cameraObjects.map(o => o.g.x);
        let ys = cameraObjects.map(o => o.g.y);

        let left = xs.reduce((a, b) => Math.min(a, b), Number.POSITIVE_INFINITY);
        let right = xs.reduce((a, b) => Math.max(a, b), Number.NEGATIVE_INFINITY);
        let top = ys.reduce((a, b) => Math.min(a, b), Number.POSITIVE_INFINITY);
        let bottom = ys.reduce((a, b) => Math.max(a, b), Number.NEGATIVE_INFINITY);

        let buffer = 50;
        let width = right - left + buffer * 2;
        let height = bottom - top + buffer * 2;

        let scaleX = this.width / width;
        let scaleY = this.height / height;

        this.cameraZoom = Math.min(scaleX, scaleY);
        this.cameraX = (left + right) / 2;
        this.cameraY = (top + bottom) / 2;
    }

    updateGameStage() {
        let snap = 0.05;
        let scale = lerp(this.gameStage.scale.x, this.cameraZoom, snap, 0.001);
        this.gameStage.scale = {x: scale, y: scale};
        let offX = -this.cameraX * this.cameraZoom;
        let offY = -this.cameraY * this.cameraZoom;
        this.gameStage.x = lerp(this.gameStage.x, offX, snap, 0.3);
        this.gameStage.y = lerp(this.gameStage.y, offY, snap, 0.3);

        this.stars.forEach(field => {
            field.scale.x = this.gameStage.scale.x;
            field.scale.y = this.gameStage.scale.y;
            field.x = (this.gameStage.x) / (field.zIndex + 6) * -1
            field.y = (this.gameStage.y) / (field.zIndex + 6) * -1;
        })
    }

    update(delta) {
        // let func = (x, y) => 3 * x;
        // func(3, 4);

        // let forEach = function(array, thingToDo) {
        //     for (let item of array) {
        //         thingToDo(item);
        //     }
        // }

        // this.cameraZoom *= 1.001;

        this.updateCamera();
        this.updateGameStage();

        Matter.Engine.update(this.engine, 1000 / 60 * delta);

        this.objects.forEach(obj => {
            obj.update(delta);
        });
    }
}
