import { Emitter, EmitterConfigV3, upgradeConfig } from "@pixi/particle-emitter";
import { Container, DisplayObject, Texture } from "pixi.js";
import { WorldObject } from "../WorldObject";
import { exhaustConfig } from "./particles/exhaust";
import { Action } from "../../util/Action";

export abstract class ParticleEffect extends WorldObject {

    readonly particleContainer: Container;
    readonly emitter: Emitter;

    isFadingOut = false;

    constructor(upgradedConfig: EmitterConfigV3) {
        super();
        this.particleContainer = new Container();
        this.emitter = new Emitter(
            this.particleContainer,
            upgradedConfig
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
        if (this.isFadingOut) return;
        this.isFadingOut = true;
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