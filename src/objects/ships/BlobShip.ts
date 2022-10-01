import { Battler } from "./Battler";
import * as Matter from 'matter-js';
import { Projectile } from "../projectile/Projectile";

export class BlobShip extends Battler {
     
    fireInterval: number = 60 * 2;
    evasionInterval: number = 60 * 2;
    thrust = 0;
    turnSpeed = .01;
    maxFuel = 999999999;
    fuel = this.maxFuel;
    private framesSinceFired = 0;
    private framesSinceEvaded = 0;

    createBody(): Matter.Body {
        let body = Matter.Bodies.circle(this.g.x, this.g.y, this.size);
        return body;
    }

    onAddedToWorld(): void {
        super.onAddedToWorld();
        this.updateTarget();
    }

    updateGraphics() {
        let myShape = this.graphics;
        myShape.clear();
        if (!this.dying) {
            myShape.alpha = 1 - ((this.maxHealth - this.health) / this.maxHealth / 2)
        }
        myShape.lineStyle(2, this.team / 2);
        myShape.beginFill(this.team);
        myShape.drawCircle(0, 0, this.size);
        myShape.drawCircle(this.size, 0, 3);
        myShape.endFill();

        return myShape;
    }

    shootBullet() {
        let bullet = new Projectile(this.team, 90);
        this.shoot(bullet);
    }

    applyThrust() {
        if (this.thrust > this.fuel) this.thrust = 0;
        let dx = this.dx;
        let dy = this.dy;
        this.vx += dx * this.thrust / 60;
        this.vy += dy * this.thrust / 60;
        this.fuel -= this.thrust;
    }
    

    update(delta: number): void {
        super.update(delta);

        this.applyThrust();

        if (this.dying) return;

        this.framesSinceFired += delta;
        this.framesSinceEvaded += delta;

        if (!this.target) return;

        let targetX = this.target.g.x;
        let targetY = this.target.g.y;
        targetX += Math.cos(-this.target.direction) * 0;
        targetY += Math.sin(-this.target.direction) * 0;

        let dirToTarget = this.directionTo(targetX, targetY);
        let disToTarget = this.distanceToXY(targetX, targetY);

        let oldTarget = this.target;
        if (disToTarget > 300) {
            this.updateTarget();
            if (oldTarget != this.target) return;
        }

        let diff = this.direction - dirToTarget;
        if (diff < 0) diff += Math.PI * 2;
        let rotationDir;
        if (diff > 0 && diff < Math.PI) {
            rotationDir = -3 * delta;
        } else {
            rotationDir = 3 * delta;
        }
        this.direction += rotationDir * this.turnSpeed;

        
        if (this.fuel < this.maxFuel) {
            this.fuel += 1;
        }

        // moving relative to target
        if (this.fuel > this.maxFuel / 2) {
            if (disToTarget > 200) {
                // this.accelerateInDir(dirToTarget, 0.1);
                this.thrust = 5;
            } else if (disToTarget < 150 && disToTarget >= 100) {
                this.thrust *= .98;
            } else if (disToTarget < 100) {
                this.thrust = -1;
            }
            // else if (this.chasingMe) {
            //     let distanceToChaser = this.distanceTo(this.chasingMe);
            //     if (distanceToChaser < 300) {
            //         let dirToChaser = this.directionTo(this.chasingMe.g.x, this.chasingMe.g.y);
            //         this.accelerateInDir(-dirToChaser + Math.random(), 0.1);
            //         // this.thrust = 5;
            //     }
            // }
        }

        // moving relative to chaser, i.e. 'evasion'
        let closestEnemy = this.getNearestEnemy(this.enemiesChasing);
        if (closestEnemy) {
            let distanceToChaser = this.distanceTo(closestEnemy);
            if (distanceToChaser <= 350 && this.framesSinceEvaded >= this.evasionInterval) {
                if (Math.random() > .25) return; // just a temporary hack so they don't all 'evade' for the first time at the exact same instant
                let dirToChaser = this.directionTo(closestEnemy.g.x, closestEnemy.g.y);
                let magnitude = (350 - distanceToChaser) / 200; // evade harder if the enemy is closer, may want this to be nonlinear, also not sure if i like it logically
                this.accelerateInDir(-dirToChaser, magnitude);
                if (Math.random() < .5) {
                    this.accelerateInDir(dirToChaser + Math.PI / 2, magnitude);
                } else {
                    this.accelerateInDir(dirToChaser - Math.PI / 2, magnitude);
                }
                // console.log('run!')
                this.framesSinceEvaded = 0;
            }
        }

        if (this.framesSinceFired >= this.fireInterval && disToTarget <= 200) {
            this.shootBullet();
            this.framesSinceFired = 0;
        }
    }
}
