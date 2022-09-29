import * as PIXI from "pixi.js";
import { World } from "./world/World";

window.onload = function() {
    // Create the application helper and add its render target to the page
    let app = new PIXI.Application({ 
        width: 800, 
        height: 500,
    });
    document.body.appendChild(app.view);

    // Add a ticker callback to move the sprite back and forth
    let world = new World(app);

    app.ticker.add(delta => {
        world.tick(delta);  
    });
};
