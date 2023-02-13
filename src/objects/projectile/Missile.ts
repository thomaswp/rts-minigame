import Matter from "matter-js";
import { Body } from "matter-js";
import { Exhaust } from "../effects/Exhaust";
import { Explosion } from "../effects/Explosion";
import { PhysicsObject } from "../PhysicsObject";
import { Battler } from "../ships/Battler";
import { Projectile } from "./Projectile";

const HEIGHT_RATIO = 0.2;

export class Missile extends Projectile {

    damage: number;
    target: PhysicsObject;
    exhaust: Exhaust;

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
        body.frictionAir = 0.04;
        return body;
    }

    constructor(team: number, size: number, target: PhysicsObject, damage: number) {
        super(team, 60 * 5, size);
        this.damage = damage;
        this.target = target;
    }

    onAddedToWorld(): void {
        super.onAddedToWorld();
        this.exhaust = new Exhaust();
        this.world.addObject(this.exhaust);
        let scale = 0.3;
        this.exhaust.g.scale = {x: scale, y: scale};
    }

    respondToCollision(other: PhysicsObject): void {
        if (other instanceof Battler) {
            other.stats.currentHealth -= this.damage;
        }
        this.die();
    }

    die(): void {
        super.die();
        this.world.addObject(new Explosion(this.x, this.y));
        this.exhaust.fadeOut();
    }

    shouldStayOnCamera(): boolean {
        return false;
    }

    updateExhaust(): void {
        let x = this.x - Math.cos(this.direction) * this.width / 2;
        let y = this.y - Math.sin(this.direction) * this.width / 2;
        this.exhaust.g.x = x;
        this.exhaust.g.y = y;
        this.exhaust.g.rotation = this.g.rotation;
    }

    update(): void {
        super.update();
        this.updateExhaust();
        this.accelerateInDir(this.direction, 0.25);

        if (this.target != null) {
            this.rotateTowardsObj(this.target, 0.03);
            // Matter.Body.setAngularVelocity
        }
    }
}