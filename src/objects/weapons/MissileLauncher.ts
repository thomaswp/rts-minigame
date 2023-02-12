import { PhysicsObject } from "../PhysicsObject";
import { Missile } from "../projectile/Missile";
import { Battler } from "../ships/Battler";
import { Weapon } from "./Weapon";

export class MissileLauncher extends Weapon {

    get fireInterval(): number {
        return 150;
    }

    wantsToFire(target: PhysicsObject): boolean {
        let disToTarget = this.parent.distanceTo(target);
        return disToTarget < 1000;
    }

    fire(target: PhysicsObject): void {
        // TODO: Remove cast and use physics collisions instead
        let missile = new Missile(this.parent.team, 10, target as Battler, 1.5);
        this.parent.fireProjectile(missile);

        let dirToTarget = this.parent.directionTo(target.x, target.y);
        missile.vx += Math.cos(dirToTarget) * 2;
        missile.vy += Math.sin(dirToTarget) * 2;
    }
    
}