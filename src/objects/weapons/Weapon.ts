import { Sync } from "../../net/client/Sync";
import { PhysicsObject } from "../PhysicsObject";
import { Projectile } from "../projectile/Projectile";
import { Battler } from "../ships/Battler";
import { WorldObject } from "../WorldObject";


export abstract class Weapon {

    readonly parent: Battler;

    private framesSinceFired = 0;

    get x() { return this.parent.x; }
    get y() { return this.parent.y; }

    constructor(parent: Battler) {
        this.parent = parent;
    }

    abstract get fireInterval(): number;
    abstract wantsToFire(target: PhysicsObject) : boolean;
    abstract fire(target: PhysicsObject) : void;

    addFireOffsetNoise() {
        this.framesSinceFired = Sync.random.int(0, this.fireInterval);
    }

    canFire(target: PhysicsObject): boolean {
        if (!target) return false;
        if (this.framesSinceFired < this.fireInterval) return false;
        if  (!this.wantsToFire(target)) return false;
        return true;

    }

    update(target: PhysicsObject) : void {
        this.framesSinceFired++;
        if (this.canFire(target)) {
            this.fire(target);
            this.framesSinceFired = 0;
        }
    }
}