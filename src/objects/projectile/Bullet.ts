import * as Matter from "matter-js";
import { PhysicsObject } from "../PhysicsObject";
import { Battler } from "../ships/Battler";
import { Projectile } from "./Projectile";

export class Bullet extends Projectile {


    createBody(): Matter.Body {
        let body = Matter.Bodies.circle(this.g.x, this.g.y, this.size);
        body.frictionAir = 0.02;
        return body;
    }

    updateGraphics() {
        let canvas = this.graphics;
        canvas.clear();
        canvas.lineStyle(2, this.team);
        canvas.beginFill(this.team);
        canvas.drawCircle(0, 0, 4);
        canvas.endFill();
    }

    respondToCollision(other: PhysicsObject): void {
        if (other instanceof Battler) {
            other.stats.currentHealth -= 1;
        }
        this.die();
    }

    update(): void {
        super.update();
        if (this.elapsedFrames > this.lifespan) {
            this.lifespan = Number.POSITIVE_INFINITY;
            this.run(() => {
                this.g.alpha *= 0.9;
                return this.g.alpha < 0.01;
            }).then(() => this.die());
        }
    }
}