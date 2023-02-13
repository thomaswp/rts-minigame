import { Emitter, upgradeConfig } from "@pixi/particle-emitter";
import { Container, DisplayObject, Texture } from "pixi.js";
import { WorldObject } from "../WorldObject";
import { sparkle } from "./particles/sparkle";
import { Action } from "../../util/Action";

export class Exhaust extends WorldObject {

    particleContainer: Container;
    emitter: Emitter;

    constructor() {
        super();
        this.particleContainer = new Container();
        let texture = Texture.from("img/particle.png");
        this.emitter = new Emitter(
            this.particleContainer,
            upgradeConfig(sparkle, [texture])
        );
        this.emitter.emit = true;
    }

    getDisplayObject(): DisplayObject {
        return this.particleContainer;
    }

    shouldStayOnCamera(): boolean {
        return false;
    }

    update(): void {
        super.update();
        this.emitter.update(1/60);
    }

    fadeOut() {
        this.emitter.emit = false;
        new Action(this)
        .wait(this.emitter.maxLifetime * 60)
        .then(() => this.die())
        .run();
    }

    die(): void {
        super.die();
        this.emitter.destroy();
    }
}