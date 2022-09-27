import { StuffDoer } from "./DoStuff";
import * as PIXI from "pixi.js";
import { PI_2 } from "pixi.js";

window.onload = function() {
  // Create the application helper and add its render target to the page
  let app = new PIXI.Application({ width: 640, height: 360 });
  document.body.appendChild(app.view);

  // Create the sprite and add it to the stage
  let sprite = PIXI.Sprite.from("img/sample.png");
  // app.stage.addChild(sprite);

  let myShape = new PIXI.Graphics();
  myShape.lineStyle(2, 0x993333);
  myShape.beginFill(0xcc3333);
  myShape.drawRect(-15, -15, 30, 30);
  myShape.endFill();
  myShape.beginFill(0x0000ff);
  myShape.drawCircle(15, 15, 5);
  myShape.endFill();

  console.log(myShape.width);
  myShape.y = 50;

  app.stage.addChild(myShape);

  // Add a ticker callback to move the sprite back and forth
  let elapsed = 0.0;
  app.ticker.add(delta => {
    elapsed += delta;
    myShape.x = 100.0 + Math.cos(elapsed / 50.0) * 100.0 + 50;
    myShape.rotation += (1 / 180) * Math.PI;
  });
};
