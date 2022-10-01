import { Application } from "pixi.js";
import { UI } from "../ui/UI";
import { World } from "./World";

export class Game {
    app: Application;
    
    world: World;
    ui: UI;

    constructor(app: Application) {
        this.app = app;

        // Add a ticker callback to move the sprite back and forth
        this.world = new World(app.view.width, app.view.height);
        this.app.stage.addChild(this.world.mainContainer);

        this.ui = new UI();
        this.app.stage.addChild(this.ui.mainContainer);
    }


    update(delta: number) {
        this.world.update(delta);
        this.ui.update(delta);
    }
}