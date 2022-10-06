import * as Matter from "matter-js";
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

    update(): void {
        super.update();
        let enemy = this.getNearestEnemy()
        if (enemy && this.distanceTo(enemy) < this.size + enemy.size) {
            enemy.stats.currentHealth -= 1;
            // some kind of animation here? fade on the projectile is weird, but maybe some kind of easy effect on the enemy?
            this.die();
        }
        if (this.elapsedFrames > this.lifespan) {
            this.lifespan = Number.POSITIVE_INFINITY;
            this.run(() => {
                this.g.alpha *= 0.9;
                return this.g.alpha < 0.01;
            }).then(() => this.die());
        }
    }
}