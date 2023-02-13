import { upgradeConfig } from "@pixi/particle-emitter";
import { Texture } from "pixi.js";
import { exhaustConfig } from "./particles/exhaust";
import { ParticleEffect } from "./ParticleEffect";

export class Exhaust extends ParticleEffect {

    constructor() {
        super(upgradeConfig(exhaustConfig, [Texture.from("img/particle.png")]));
    }
}