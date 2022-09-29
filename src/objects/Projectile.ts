import { DisplayObject, Graphics } from "pixi.js";
import { Action } from "../util/Action";
import { argMin } from "../util/MathUtil";
import { Battler } from "./Battler";
import { PhysicsObject } from "./PhysicsObject";

export class Projectile extends PhysicsObject {
  graphics: Graphics;
  team: number;
  lifespan: number;

  constructor(team = 0xcc3333, lifespan = 60, size = 4) { // = 0xcc3333
    super();
    this.graphics = new Graphics();
    this.updateGraphics();
    this.decellerationFactor = 0.995;
    this.team = team;
    this.lifespan = lifespan;
    this.size = size;
  }

  updateGraphics() {
    let canvas = this.graphics;
    canvas.clear();
    canvas.lineStyle(2, this.team);
    canvas.beginFill(this.team);
    canvas.drawCircle(0, 0, 4);
    canvas.endFill();
  }

  getDisplayObject(): DisplayObject {
    return this.graphics;
  }

  getNearestEnemy() {
    let enemies = this.world.objects
        .filter(o => o instanceof Battler && o.team != this.team);
    return argMin(enemies, e => this.distanceTo(e)) as Battler;
}

  update(delta: number): void {
    super.update(delta);
    this.updateGraphics();
    let enemy = this.getNearestEnemy()
    if (this.distanceTo(enemy) < this.size + enemy.size) {
      enemy.health -= 1;
      // some kind of animation here? fade on the projectile is weird, but maybe some kind of easy effect on the enemy?
      this.die();
    }
    if (this.elapsedFrames > this.lifespan) {
      this.lifespan = Number.POSITIVE_INFINITY;
      this.run(delta => {
        this.g.alpha *= 0.9;
        return this.g.alpha < 0.01;
      }).then(() => this.die());
    }
  }
}
