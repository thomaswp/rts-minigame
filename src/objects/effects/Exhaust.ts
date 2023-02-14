import { upgradeConfig } from "@pixi/particle-emitter";
import { Texture } from "pixi.js";
import { exhaustConfig } from "./particles/exhaust";
import { ParticleEffect } from "./ParticleEffect";

export class Exhaust extends ParticleEffect {

    constructor(config = exhaustConfig) {
        super(upgradeConfig(config, [Texture.from("img/particle.png")]));
    }

    onAddedToWorld(): void {
        this.g.zIndex = -10;
    }
}