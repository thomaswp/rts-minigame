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
        let missile = new Missile(this.parent.team, 10, target, 1.5);

        let sideAngle = this.parent.direction + Math.PI / 2;
        this.parent.fireProjectile(missile, sideAngle);
        missile.direction = this.parent.direction;

        // let dirToTarget = this.parent.directionTo(target.x, target.y);
        missile.vx += Math.cos(sideAngle) * 2;
        missile.vy += Math.sin(sideAngle) * 2;
    }
    
}