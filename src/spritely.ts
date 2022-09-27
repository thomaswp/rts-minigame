import * as PIXI from "pixi.js";

window.onload = function() {
  let app = new PIXI.Application({ backgroundColor: 0x1099bb });
  document.body.appendChild(app.view);

  // Scale mode for all textures, will retain pixelation
  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

  let ship = PIXI.Sprite.from("img/sample.png");

  ship.anchor.set(0.5);

  const screen_center = { x: app.screen.width / 2, y: app.screen.height / 2 };
  ship.x = screen_center.x;
  ship.y = screen_center.y;

  ship.interactive = true;
  ship.buttonMode = true;

  ship
    .on("pointerdown", onDragStart)
    .on("pointerup", onDragEnd)
    .on("pointerupoutside", onDragEnd)
    .on("pointermove", onDragMove);

  app.stage.addChild(ship);

  function onclick() {
    ship.scale.x *= 1.25;
    ship.scale.y *= 1.25;
  }

  function onDragStart(event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
  }

  function onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    // set the interaction data to null
    this.data = null;
  }

  function onDragMove() {
    if (this.dragging) {
      const newPosition = this.data.getLocalPosition(this.parent);
      this.x = newPosition.x;
      this.y = newPosition.y;
    }
  }

  let elapsed = 0.0;
  app.ticker.add(delta => {
    ship.rotation += 0.02 * delta;
    // elapsed += delta;
    // ship.x = screen_center.x + Math.cos(elapsed / 50.0) * 100.0;
    // ship.y = screen_center.y + Math.cos(elapsed / 30.0) * 100.0;
  });
};
