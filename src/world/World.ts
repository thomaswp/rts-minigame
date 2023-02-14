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
import { FighterShip } from "../objects/ships/FighterShip";
import { ObjectContainer } from "./BaseObject";
import { Game } from "./Game";
import { Sync } from "../net/client/Sync";
import { IncreaseFireRate, IncreaseHealth } from "../objects/ships/Buffs";

export class World implements ObjectContainer {
    // for (let i = 0; i < 10; i++) {
    //     this.addObject(new BlobShip(0xcc3333));
    //     this.addObject(new BlobShip(0x3333cc));
    // }
    
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

    // cameraTarget: WorldObject;
    game: Game;

    roundFrameCount = 0;

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

        // this.addObject(new BlobShip(0x3333cc)); // adding this so the camera has an initial target, but how can we initialize the world with an empty arena?
        // i guess ideally we want a starting camera dimensions, with nothing on the field, then the ability to add a bunch of objects and only begin the simulation when we click go

        // for (let i = 0; i < 10; i++) {
        //     this.addObject(new BlobShip(0xcc3333));
        //     this.addObject(new BlobShip(0x3333cc));
        // }

        Sync.messenger.roundStarted.on(() => this.startRound());
        Sync.messenger.roundEnded.on(() => this.endRound());

    }

    startRound() {
        this.roundFrameCount = 0;
        Sync.state.players.forEach(p => {
            p.ships.forEach(ship => {
                var bs = new FighterShip(p.color);

                bs.addBuff(new IncreaseHealth());
                bs.addBuff(new IncreaseFireRate());
                
                bs.g.x = ship.x;
                bs.g.y = ship.y;
                this.addObject(bs);
            });
        });

        let lastRFC = 0;
        setInterval(() => {
            // console.log(this.roundFrameCount - lastRFC, 
            //     this.roundFrameCount, 
            //     Sync.state.lastServerFrameCount);            
            lastRFC = this.roundFrameCount;
        }, 1000)
    }

    endRound() {
        this.clear();
    }

    clear() {
        while (this.objects.length > 0) this.removeObject(this.objects[0]);
    }

    checkForRoundEnd() {
        if (this.isRoundOver()) {
            Sync.messenger.tryEndRound.send();
        }
    }

    isRoundOver() {
        let battlers = this.objects.filter(o => o instanceof Battler) as Battler[];
        if (battlers.length == 0) return true;
        let team = battlers[0].team;
        return battlers.every(b => b.team == team);
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
                s.x = Sync.random.floatRange(-range / 2, range / 2);
                s.y = Sync.random.floatRange(-range / 2, range / 2);
                s.scale.x = s.scale.y = Sync.random.floatRange(0.5, 1.5);
                field.addChild(s);
            }
        }
    }

    addObject(obj: WorldObject) {
        // console.log('added ', obj.constructor.name, obj);
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
        // if (!this.cameraTarget.isInWorld || Sync.random.chance(0.002)) {
        //     this.cameraTarget = this.objects[Sync.random.int(0, this.objects.length - 1)];
        // }

        // this.cameraX = this.cameraTarget.g.x;
        // this.cameraY = this.cameraTarget.g.y;

        let cameraObjects = this.objects.filter(o => o.shouldStayOnCamera());
        if (cameraObjects.length == 0) return;

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

    updateLogic() {
        Matter.Engine.update(this.engine, 1000 / 60);

        this.objects.forEach(obj => {
            obj.update();
        });
        this.roundFrameCount++;
    }

    update() {
        // let func = (x, y) => 3 * x;
        // func(3, 4);

        // let forEach = function(array, thingToDo) {
        //     for (let item of array) {
        //         thingToDo(item);
        //     }
        // }

        // this.cameraZoom *= 1.001;

        if (!Sync.isConnected) return;

        this.updateLogic();

        const maxSkipFrames = 5;
        let frames = 0;

        while (this.roundFrameCount < Sync.state.lastServerFrameCount && 
            frames < maxSkipFrames
        ) {
            this.updateLogic();
            frames++;
        }

        this.updateCamera();
        this.updateGameStage();
    }
}
