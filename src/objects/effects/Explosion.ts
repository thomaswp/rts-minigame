import { upgradeConfig } from "@pixi/particle-emitter";
import { Texture } from "pixi.js";
import { exhaustConfig } from "./particles/exhaust";
import { ParticleEffect } from "./ParticleEffect";
import { explosionConfig } from "./particles/explosion";

export class Explosion extends ParticleEffect {

    remainingFrames: number;

    constructor(x: number, y: number, duration = 20) {
        super(upgradeConfig(explosionConfig, [Texture.from("img/particle.png")]));
        this.g.x = x;
        this.g.y = y;
        this.remainingFrames = duration;
    }

    update(): void {
        super.update();

        if (this.isFadingOut) return;
        this.remainingFrames--;
        if (this.remainingFrames <= 0) {
            this.fadeOut();
        }
    }
}