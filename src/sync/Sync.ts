import * as seedrandom from 'seedrandom'
import * as Matter from 'matter-js';

export class Random {

    private rng: () => number;

    constructor(seed: number) {
        this.rng = seedrandom(seed);
    }

    float(): number {
        return this.rng();
    };

    floatRange(min: number, max: number) {
        return this.float() * (max - min) + min;
    }

    int(min: number, max: number): number {
        return Math.round(this.floatRange(min, max));
    };

    boolean(): boolean {
        return this.float() < 0.5;
    };

    chance(chanceZeroToOne: number): boolean {
        return this.float() < chanceZeroToOne;
    }
}

export class Sync {

    static random: Random;

    static init(seed: number) {
        this.random = new Random(seed);
        Matter.Common['_seed'] = this.random.float();

        // console.log(this.random.float(), this.random.int(0, 100), this.random.boolean());
    }

}