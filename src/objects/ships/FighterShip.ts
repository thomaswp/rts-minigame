import { Battler } from "./Battler";
import * as Matter from 'matter-js';
import { Projectile } from "../projectile/Projectile";
import { Bullet } from "../projectile/Bullet";
import { BaseProperties, ShipProperties } from "./ShipProperties";
import { Sync } from "../../net/client/Sync";
import { Cannon } from "../weapons/Cannon";
import { MissileLauncher } from "../weapons/MissileLauncher";
import { Point } from "pixi.js";

export class FighterShip extends Battler {
     
    thrust = 0;
    turnSpeed = 0.03;

    // just testing this for now, still need to actually replace any this.property
    // everywhere with this.stats.property
    constructor(team) {
        super(team);
        this.startingProperties = new BaseProperties(10, .01, 999999999, 1, 1, 1, 60*2, 60*2, 1);
        this.properties = new ShipProperties(this.startingProperties);
        // this.weapons.push(new Cannon(this));

        this.graphics.addChild(
            this.createGraphicsFromPoints(this.createShipPoints(), this.team)
        );

        if (Sync.random.boolean()) {
            this.weapons.push(new MissileLauncher(this));
        } else {
            this.weapons.push(new Cannon(this));
        }
        this.weapons.forEach(w => w.addFireOffsetNoise());
    }


    createBody(): Matter.Body {
        return this.createBodyFromPoints(this.createShipPoints());
    }

    onAddedToWorld(): void {
        super.onAddedToWorld();
        this.updateTarget();
    }

    createShipPoints(): Point[] {
        let size = this.size
        return [
            new Point(size, 0),
            new Point(-size, size * 0.7),
            new Point(-size * 0.7, 0),
            new Point(-size, -size * 0.7),
            new Point(size, 0),
        ];
    }

    applyThrust() {
        let dx = this.dx;
        let dy = this.dy;
        this.vx += dx * this.thrust / 60;
        this.vy += dy * this.thrust / 60;
    }
    

    update(): void {
        super.update();

        this.applyThrust();

        if (this.dying) return;

        if (!this.target) return;

        let targetX = this.target.g.x;
        let targetY = this.target.g.y;
        // targetX += Math.cos(-this.target.direction) * 0;
        // targetY += Math.sin(-this.target.direction) * 0;

        let dirToTarget = this.directionTo(targetX, targetY);
        let disToTarget = this.distanceToXY(targetX, targetY);

        let oldTarget = this.target;
        if (disToTarget > 300) {
            this.updateTarget();
            if (oldTarget != this.target) return;
        }

        this.rotateTowardsAngle(dirToTarget, this.turnSpeed);
        

        if (disToTarget > 500) {
            // this.accelerateInDir(dirToTarget, 0.1);
            this.thrust = 3;
        } else if (disToTarget < 200) {
            this.thrust = -1;
        } else {
            this.thrust *= 0.7;
        }
        // else if (this.chasingMe) {
        //     let distanceToChaser = this.distanceTo(this.chasingMe);
        //     if (distanceToChaser < 300) {
        //         let dirToChaser = this.directionTo(this.chasingMe.g.x, this.chasingMe.g.y);
        //         this.accelerateInDir(-dirToChaser + Sync.random.float(), 0.1);
        //         // this.thrust = 5;
        //     }
        // }

        // moving relative to chaser, i.e. 'evasion'
        // let closestEnemy = this.getNearestEnemy(this.enemiesChasing);
        // if (closestEnemy) {
        //     let distanceToChaser = this.distanceTo(closestEnemy);
        //     if (distanceToChaser <= 350 && this.framesSinceEvaded >= this.evasionInterval) {
        //         if (Sync.random.chance(0.75)) return; // just a temporary hack so they don't all 'evade' for the first time at the exact same instant
        //         let dirToChaser = this.directionTo(closestEnemy.g.x, closestEnemy.g.y);
        //         let magnitude = (350 - distanceToChaser) / 200; // evade harder if the enemy is closer, may want this to be nonlinear, also not sure if i like it logically
        //         this.accelerateInDir(-dirToChaser, magnitude);
        //         if (Sync.random.chance(0.5)) {
        //             this.accelerateInDir(dirToChaser + Math.PI / 2, magnitude);
        //         } else {
        //             this.accelerateInDir(dirToChaser - Math.PI / 2, magnitude);
        //         }
        //         // console.log('run!')
        //         this.framesSinceEvaded = 0;
        //     }
        // }
    }
}
