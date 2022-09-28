import { BaseObject } from "./BaseObject";

export abstract class PhysicsObject extends BaseObject {
    vx = 0;
    vy = 0;
    decellerationFactor = 1;

    update(delta: number) {
        super.update(delta);

        this.vy += this.world.gravity * delta;
        this.vx *= this.decellerationFactor;
        this.vy *= this.decellerationFactor;
        this.g.x += this.vx * delta;
        this.g.y += this.vy * delta;
    }
}