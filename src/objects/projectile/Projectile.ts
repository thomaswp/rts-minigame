import * as Matter from 'matter-js';
import { DisplayObject, Graphics } from "pixi.js";
import { Action } from "../../util/Action";
import { argMin } from "../../util/MathUtil";
import { Battler } from "../ships/Battler";
import { PhysicsObject } from "../PhysicsObject";

export abstract class Projectile extends PhysicsObject {
    graphics: Graphics;
    team: number;
    lifespan: number;
    size: number;
    
    get monitorsCollisions(): boolean {
        // Default to monitoring collisions for projectiles
        return true;
    }

    constructor(team = 0xcc3333, lifespan = 60, size = 4) { // = 0xcc3333
        super();
        this.graphics = new Graphics();
        this.updateGraphics();
        this.team = team;
        this.lifespan = lifespan;
        this.size = size;
    }

    abstract updateGraphics();

    shouldStayOnCamera() {
        return false;
    }

    getDisplayObject(): DisplayObject {
        return this.graphics;
    }

    getNearestEnemy() {
        let enemies = this.world.objects
            .filter(o => o instanceof Battler && o.team != this.team);
        return argMin(enemies, e => this.distanceTo(e)) as Battler;
    }

    update(): void {
        super.update();
        this.updateGraphics();
    }
}
