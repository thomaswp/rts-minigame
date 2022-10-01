import * as PIXI from "pixi.js";
import { Game } from "./world/Game";
import { World } from "./world/World";

window.onload = function() {
    // Create the application helper and add its render target to the page
    let app = new PIXI.Application({ 
        width: 800, 
        height: 500,
    });
    document.body.appendChild(app.view);

    let game = new Game(app);

    app.ticker.add(delta => {
        game.update(delta);  
    });
};
