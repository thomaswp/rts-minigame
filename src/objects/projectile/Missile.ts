import Matter from "matter-js";
import { Body } from "matter-js";
import { PhysicsObject } from "../PhysicsObject";
import { Battler } from "../ships/Battler";
import { Projectile } from "./Projectile";

const HEIGHT_RATIO = 0.2;

export class Missile extends Projectile {

    damage: number;
    target: Battler;

    private get height() { return this.width * HEIGHT_RATIO; }
    private get width() { return this.size * 2; }

    updateGraphics() {
        let canvas = this.graphics;
        canvas.clear();
        canvas.lineStyle(1, 0x333333);
        canvas.beginFill(this.team);
        canvas.drawRect(-this.width / 2, -this.height / 2, this.width, this.height);
        canvas.endFill();
    }

    createBody(): Body {
        let body = Matter.Bodies.rectangle(this.g.x, this.g.y, this.width, this.height);
        body.frictionAir = 0.02;
        return body;
    }

    constructor(team: number, size: number, target: Battler, damage: number) {
        super(team, 60 * 5, size);
        this.damage = damage;
        this.target = target;
    }

    respondToCollision(other: PhysicsObject): void {
        if (other instanceof Battler) {
            other.stats.currentHealth -= this.damage;
        }
        this.die();
    }

    update(): void {
        super.update();
        this.accelerateInDir(this.direction, 0.2);
        if (this.target == null) return;
        this.rotateTowardsObj(this.target, 0.1);
        // Matter.Body.setAngularVelocity
    }
}