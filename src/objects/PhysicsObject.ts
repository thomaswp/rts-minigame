import { WorldObject } from "./WorldObject";
import * as Matter from 'matter-js';

function v(x: number, y: number) {
    return Matter.Vector.create(x, y);
}

export abstract class PhysicsObject extends WorldObject {
    
    get x() { return this.body.position.x; }
    get y() { return this.body.position.y; }

    set x(value) { Matter.Body.setPosition(this.body, v(value, this.body.position.y)); }
    set y(value) { Matter.Body.setPosition(this.body, v(this.body.position.x, value)); }

    get vx() { return this.body.velocity.x; }
    get vy() { return this.body.velocity.y; }

    set vx(value) { Matter.Body.setVelocity(this.body, v(value, this.body.velocity.y)); }
    set vy(value) { Matter.Body.setVelocity(this.body, v(this.body.velocity.x, value)); }

    get direction() { return this.body.angle; };
    set direction(value) { 
        while (value < -Math.PI) value += Math.PI * 2;
        if (value > Math.PI) value %= Math.PI * 2;
        Matter.Body.setAngle(this.body, value);
        this.g.rotation = value;
    };  

    get decellerationFactor() { return this.body.frictionAir; }
    set decellerationFactor(value) { this.body.frictionAir = value; }

    body: Matter.Body;

    abstract createBody(): Matter.Body;

    onAddedToWorld() {
        super.onAddedToWorld();
        this.body = this.createBody();
        Matter.Body.setPosition(this.body, v(this.g.x, this.g.y));
        Matter.Composite.add(this.world.engine.world, this.body);
    }

    die(): void {
        super.die();
        Matter.Composite.remove(this.world.engine.world, this.body);
    }

    update() {
        super.update();

        this.g.x = this.body.position.x;
        this.g.y = this.body.position.y;
        this.g.rotation = this.body.angle;
    }

    accelerateInDir(direction, magnitude) {
        this.vx += Math.cos(direction) * magnitude;
        this.vy += Math.sin(direction) * magnitude;
    }

    rotateTowardsObj(obj: PhysicsObject, by: number) {
        this.rotateTowardsAngle(this.directionToObj(obj), by);
    }

    rotationDirectionTowards(angle: number) {
        let diff = this.direction - angle;
        if (diff < 0) diff += Math.PI * 2;
        if (diff == 0) return 0;
        return diff > 0 && diff < Math.PI  ? -1 : 1;
    }

    rotateTowardsAngle(angle: number, by: number) {
        let rotationDir = this.rotationDirectionTowards(angle);
        this.direction += rotationDir * by;
    }
}