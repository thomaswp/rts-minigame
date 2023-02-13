import { PhysicsObject } from "../PhysicsObject";
import { Bullet } from "../projectile/Bullet";
import { WorldObject } from "../WorldObject";
import { Weapon } from "./Weapon";

export class Cannon extends Weapon {

    get fireInterval(): number {
        return 200;
    }

    wantsToFire(target: PhysicsObject): boolean {
        let disToTarget = this.parent.distanceTo(target);
        return disToTarget < 550;
    }

    fire(target: PhysicsObject): void {
        let bullet = new Bullet(this.parent.team, 90);
        this.parent.fireProjectile(bullet);

        let dirToTarget = this.parent.directionTo(target.x, target.y);
        bullet.vx += Math.cos(dirToTarget) * 10;
        bullet.vy += Math.sin(dirToTarget) * 10;
    }

}