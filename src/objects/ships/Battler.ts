import * as Matter from 'matter-js';
import { DisplayObject, Graphics } from "pixi.js";
import { Sync } from '../../sync/Sync';
import { argMin, removeFrom } from "../../util/MathUtil";
import { PhysicsObject } from "../PhysicsObject";
import { Projectile } from "../projectile/Projectile";
import { Buff } from './Buffs';
import { BaseProperties, ShipProperties } from './ShipProperties';

export abstract class Battler extends PhysicsObject {

    graphics: Graphics;
    size: number;
    maxHealth = 10;
    health = this.maxHealth;
    team: number;
    dying = false;
    target: Battler;
    enemiesChasing = [] as Battler[];
    startingProperties: BaseProperties;
    properties: ShipProperties;

    get stats() { return this.properties.currentProperties;}
    
    // turn speed
    // fuel regen?

    // some sort of basic 'threat' that counts nearby enemies, and if it's high, they move toward nearest ally? or away from nearest enemy? when would that supercede chasing?

    get dx() { return Math.cos(this.direction); }
    get dy() { return Math.sin(this.direction); }

    constructor(team: number, size = 15) {
        super();
        
        this.startingProperties = new BaseProperties();
        this.properties = new ShipProperties(this.startingProperties);
        
        this.graphics = new Graphics();
        this.graphics = this.updateGraphics();
        this.team = team;
        
        // should we assign positions randomly in the world instead of per battler, and should we try splitting the arena in 2 for each team?
        this.g.x = Sync.random.floatRange(-300, 300);
        this.g.y = Sync.random.floatRange(-200, 200);
        this.size = size;
    }

    abstract updateGraphics();

    shoot(bullet: Projectile) {
        this.world.addObject(bullet);
        
        let dx = this.dx;
        let dy = this.dy;
        
        bullet.x = this.x + this.size * dx;
        bullet.y = this.y + this.size * dy;
        bullet.vx = this.vx + dx * 10;
        bullet.vy = this.vy + dy * 10;
    }

    updateTarget() {
        if (this.target != null) {
            removeFrom(this.target.enemiesChasing, this);
        }
        this.setTarget(this.getNearestEnemy());
    }

    setTarget(target: Battler) {
        this.target = target;
        if (this.target) this.target.enemiesChasing.push(this);
    }

    getNearestEnemy(enemies?: Battler[]) {
        if (!enemies) enemies = this.world.objects
            .filter(o => o instanceof Battler && o.team != this.team) as Battler[];
        return argMin(enemies, e => this.distanceTo(e)) as Battler;
    }

    getDisplayObject(): DisplayObject {
        return this.graphics;
    }

    startToDie() {
        this.dying = true;
        this.run(() => {
            this.g.alpha *= 0.9;
            return this.g.alpha < 0.01;
        }).then(() => this.die());
        return;
    }

    addBuff(buff: Buff) {
        buff.ship = this;
        this.properties.buffs.push(buff);
    }

    removeBuff(buff: Buff) {
        removeFrom(this.properties.buffs, buff);
    }

    update() {
        // console.log(this.stats.currentHealth, '/', this.stats.maxHealth, this.stats.fireInterval);
        super.update();
        this.updateGraphics();
        this.properties.update();

        if (this.dying) {
            return; // we forgot to finish this if statemnt, which was causing a lot of the weird behavior
        }

        if (!this.target || !this.target.isInWorld) {
            this.updateTarget();
        }

        this.enemiesChasing = 
            this.enemiesChasing.filter(e => e && e.isInWorld);

        if (this.properties.currentProperties.currentHealth <= 0) {
            this.startToDie();
            return;
        }
    }

}

