import { DisplayObject, Graphics } from "pixi.js";
import { argMax, argMin } from "../util/MathUtil";
import { BaseObject } from "./BaseObject"
import { PhysicsObject } from "./PhysicsObject";
import { Projectile } from "./Projectile";

export class Battler extends PhysicsObject {

    graphics: Graphics;
    size: number;
    fireInterval: number = 60 * 2;
    evasionInterval: number = 60 * 2;
    maxHealth = 10;
    health = this.maxHealth;
    thrust = 0;
    turnSpeed = .01;
    maxFuel = 999999999;
    fuel = this.maxFuel;
    team: number;
    target: Battler;
    chasingMe: BaseObject;
    dying = false;
    // turn speed
    // fuel regen?

    // some sort of basic 'threat' that counts nearby enemies, and if it's high, they move toward nearest ally? or away from nearest enemy? when would that supercede chasing?

    private framesSinceFired = 0;
    private framesSinceEvaded = 0;
    
    get direction() { return this.g.rotation; };
    set direction(value) { 
        while (value < -Math.PI) value += Math.PI * 2;
        if (value > Math.PI) value %= Math.PI * 2;
        this.g.rotation = value; 
    };  
    
    get dx() { return Math.cos(this.direction); }
    get dy() { return Math.sin(this.direction); }

    constructor(team: number, size = 15) {
        super();
        this.decellerationFactor = 0.98;
        this.graphics = new Graphics();
        this.graphics = this.updateGraphics();
        this.team = team;

        this.g.x = 600 * Math.random() - 300; // should we assign positions randomly in the world instead of per battler, and should we try splitting the arena in 2 for each team?
        this.g.y = 400 * Math.random() - 200;
        this.size = size;
    }

    onAddedToWorld(): void {
        this.updateTarget();
    }

    updateTarget() {
        this.target = this.getNearestEnemy();
        if (this.target instanceof Battler) this.target.chasingMe = this;
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

    shoot() {
        let bullet = new Projectile(this.team, 90);
        this.world.addObject(bullet);
        
        let dx = this.dx;
        let dy = this.dy;

        bullet.g.x = this.g.x + this.size * dx;
        bullet.g.y = this.g.y + this.size * dy;
        bullet.vx = this.vx + dx * 10;
        bullet.vy = this.vy + dy * 10;
    }

    applyThrust() {
        if (this.thrust > this.fuel) this.thrust = 0;
        let dx = this.dx;
        let dy = this.dy;
        this.vx += dx * this.thrust / 60;
        this.vy += dy * this.thrust / 60;
        this.fuel -= this.thrust;
    }

    getNearestEnemy() {
        let enemies = this.world.objects
            .filter(o => o instanceof Battler && o.team != this.team);
        return argMin(enemies, e => this.distanceTo(e)) as Battler;
    }

    getDisplayObject(): DisplayObject {
        return this.graphics;
    }

    update(delta: number): void {
        this.applyThrust();
        super.update(delta);
        this.updateGraphics();

        if (this.dying) return;

        this.framesSinceFired += delta;
        this.framesSinceEvaded += delta;
        
        if (this.health <= 0) { //Math.random() < 0.0003
            this.dying = true;
            this.run(delta => {
                this.g.alpha *= 0.9;
                return this.g.alpha < 0.01;
            }).then(() => this.die());
            return;
        }
        
        if (!this.target) {
            this.updateTarget();
            return;
        }

        if (!this.target.isInWorld) {
            this.updateTarget();
        }
        if (this.chasingMe && !this.chasingMe.isInWorld) {
            this.chasingMe = null;
        }

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
        if (this.chasingMe) {
            let distanceToChaser = this.distanceTo(this.chasingMe);
            if (distanceToChaser <= 350 && this.framesSinceEvaded >= this.evasionInterval) {
                if (Math.random() > .25) return; // just a temporary hack so they don't all 'evade' for the first time at the exact same instant
                let dirToChaser = this.directionTo(this.chasingMe.g.x, this.chasingMe.g.y);
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
            this.shoot();
            this.framesSinceFired = 0;
        }
    }

}

