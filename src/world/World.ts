import { Application, ArrayResource, Container, Graphics, Point, Runner } from "pixi.js";
import { BaseObject } from "../objects/BaseObject";
import { Battler } from "../objects/Battler";
import { Hero } from "../objects/Hero";
import { PhysicsObject } from "../objects/PhysicsObject";
import { Updatable } from "../util/Action";
// import * as Keyboard from "pixi.js-keyboard";
// import * as Mouse from "pixi.js-mouse";
import * as Matter from 'matter-js';
import * as PolyDecomp from 'poly-decomp'
import * as hull from 'hull.js'
import { lerp } from "../util/MathUtil";
import { BlobShip } from "../objects/BlobShip";

export class World {
    app: Application;
    hero: Hero;

    minX: number;
    maxX: number;
    minY: number;
    maxY: number;

    get width() { return this.maxX - this.minX; }
    get height() { return this.maxY - this.minY; }

    gravity = 0;

    objects = [] as BaseObject[];

    gameStage: Container;
    stars = [] as Container[];

    engine: Matter.Engine;

    cameraX = 0;
    cameraY = 0;
    cameraZoom = 1;

    cameraTarget: BaseObject;

    constructor(app: Application) {
        this.app = app;

        Matter.Common.setDecomp(PolyDecomp);
        this.engine = Matter.Engine.create({
            enableSleeping: true,
        });
        this.engine.gravity = {
            x: 0, y: 0, scale: 0.001,
        }

        this.createBackground();

        this.gameStage = new Container();
        this.gameStage.x = this.app.view.width / 2;
        this.gameStage.y = this.app.view.height / 2;
        this.gameStage.zIndex = 1;
        this.app.stage.addChild(this.gameStage);

        this.maxX = this.app.view.width / 2;
        this.minX = -this.app.view.width / 2;
        this.maxY = this.app.view.height / 2;
        this.minY = -this.app.view.height / 2;

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
            this.app.stage.addChild(field);

            for (let i = 0; i < nStars; i++) {
                let s = star.clone();
                s.x = Math.random() * range - range / 2;
                s.y = Math.random() * range - range / 2;
                s.scale.x = s.scale.y = Math.random() * 0.5 + 0.75;
                field.addChild(s);
            }
        }
    }

    addObject(obj: BaseObject) {
        obj.world = this;
        this.objects.push(obj);
        this.gameStage.addChild(obj.g);
        obj.onAddedToWorld();
    }

    removeObject(obj: BaseObject) {
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

        let scaleX = this.app.view.width / width;
        let scaleY = this.app.view.height / height;

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
        let hw = this.app.view.width / 2;
        let hh = this.app.view.height / 2;
        this.gameStage.x = lerp(this.gameStage.x, offX + hw, snap, 0.3);
        this.gameStage.y = lerp(this.gameStage.y, offY + hh, snap, 0.3);

        this.stars.forEach(field => {
            field.scale.x = this.gameStage.scale.x;
            field.scale.y = this.gameStage.scale.y;
            field.x = (this.gameStage.x - hw) / (field.zIndex + 6) * -1 + hw;
            field.y = (this.gameStage.y - hh) / (field.zIndex + 6) * -1 + hh;
        })
    }

    tick(delta) {
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

        // const buffer = 30;
        this.objects.forEach(obj => {
            obj.update(delta);
        //     if (!(obj instanceof PhysicsObject)) return;
        //     // try bouncing instead of wrapping...if exceed x bound, flip vx, if exceed y bound, flip vy, but may need a small constant push so they don't get stuck on the wall
        //     // let b = 10;
        //     if (obj.g.x > this.maxX - obj.size) obj.vx *= -1;
        //     if (obj.g.y > this.maxY - obj.size) obj.vy *= -1;
        //     if (obj.g.x < this.minX + obj.size) obj.vx *= -1;
        //     if (obj.g.y < this.minY + obj.size) obj.vy *= -1;
            // if (obj.g.x > this.maxX + buffer) obj.g.x -= this.width + buffer * 2;
            // if (obj.g.y > this.maxY + buffer) obj.g.y -= this.height + buffer * 2;
            // if (obj.g.x < this.minX - buffer) obj.g.x += this.width + buffer * 2;
            // if (obj.g.y < this.minY - buffer) obj.g.y += this.height + buffer * 2;
        });
    }
}
