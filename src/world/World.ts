import { Application, Container, Point, Runner } from "pixi.js";
import { BaseObject } from "../objects/BaseObject";
import { Battler } from "../objects/Battler";
import { Hero } from "../objects/Hero";
import { PhysicsObject } from "../objects/PhysicsObject";
import { Updatable } from "../util/Action";
// import * as Keyboard from "pixi.js-keyboard";
// import * as Mouse from "pixi.js-mouse";

export class World {
  app: Application;
  hero: Hero;

  minX: number;
  maxX: number;
  minY: number;
  maxY: number;

  get width() { return this.maxX - this.minX; }
  get height() { return this.maxY - this.minY; }

  gravity = 0;

  objects = [] as BaseObject[];

  gameStage: Container;

  constructor(app: Application) {
    this.app = app;

    this.gameStage = new Container();
    this.gameStage.x = this.app.view.width / 2;
    this.gameStage.y = this.app.view.height / 2;
    this.app.stage.addChild(this.gameStage);

    this.maxX = this.app.view.width / 2;
    this.minX = -this.app.view.width / 2;
    this.maxY = this.app.view.height / 2;
    this.minY = -this.app.view.height / 2;

    this.hero = new Hero();
    this.addObject(this.hero);

    for (let i = 0; i < 5; i++) {
      this.addObject(new Battler(0xcc3333));
      this.addObject(new Battler(0x3333cc));
    }
  }

  addObject(obj: BaseObject) {
    obj.world = this;
    this.objects.push(obj);
    this.gameStage.addChild(obj.g);
    obj.onAddedToWorld();
  }

  removeObject(obj: BaseObject) {
    let index = this.objects.indexOf(obj);
    if (index === -1) return false;
    this.objects.splice(index, 1);
    this.gameStage.removeChild(obj.g);
    return true;
  }

  tick(delta) {
    // let func = (x, y) => 3 * x;
    // func(3, 4);

    // let forEach = function(array, thingToDo) {
    //     for (let item of array) {
    //         thingToDo(item);
    //     }
    // }

    // for (let obj of this.objects) {
    //     obj.update();
    // }

    const buffer = 30;
    this.objects.forEach(obj => {
      obj.update(delta);
      if (!(obj instanceof PhysicsObject)) return;
      // try bouncing instead of wrapping...if exceed x bound, flip vx, if exceed y bound, flip vy, but may need a small constant push so they don't get stuck on the wall
      // let b = 10;
      if (obj.g.x > this.maxX - obj.size) obj.vx *= -1;
      if (obj.g.y > this.maxY - obj.size) obj.vy *= -1;
      if (obj.g.x < this.minX + obj.size) obj.vx *= -1;
      if (obj.g.y < this.minY + obj.size) obj.vy *= -1;
      // if (obj.g.x > this.maxX + buffer) obj.g.x -= this.width + buffer * 2;
      // if (obj.g.y > this.maxY + buffer) obj.g.y -= this.height + buffer * 2;
      // if (obj.g.x < this.minX - buffer) obj.g.x += this.width + buffer * 2;
      // if (obj.g.y < this.minY - buffer) obj.g.y += this.height + buffer * 2;
    });
  }
}
