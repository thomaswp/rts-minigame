import { Container } from "pixi.js";
import { WorldObject } from "../objects/WorldObject";
import { Sync } from "../net/client/Sync";
import { removeFrom } from "../util/MathUtil";
import { BaseObject, ObjectContainer } from "../world/BaseObject";
import { Game } from "../world/Game";
import { AddShipButton } from "./AddShipButton";
import { Button } from "./Button";
import { InterfaceObject } from "./InterfaceObject";
import { ShipDisplay } from "./ShipDisplay";
import { StartGameButton } from "./StartGameButton";
import { AddAIButton } from "./AddAIButton";

export class UI implements ObjectContainer {
    mainContainer: Container;
    game: Game;

    objects = [] as InterfaceObject[];

    constructor() {
        this.mainContainer = new Container();

        let button = new AddShipButton(30, 0xFF00FF);
        button.g.x = 50;
        button.g.y = 50;
        this.addObject(button);

        let startButton = new StartGameButton();
        startButton.g.x = 50;
        startButton.g.y = 140;
        this.addObject(startButton);

        let addAIButton = new AddAIButton();
        addAIButton.g.x = 50;
        addAIButton.g.y = 230;
        this.addObject(addAIButton);

        this.addObject(new ShipDisplay());

        Sync.messenger.roundStarted.on(() => {
            this.mainContainer.visible = false;
        });
        Sync.messenger.roundEnded.on(() => {
            this.mainContainer.visible = true;
        });
    }

    removeObject(object: InterfaceObject): boolean {
        return removeFrom(this.objects, object);
    }

    addObject(obj: InterfaceObject) {
        // console.log('added ', obj.constructor.name, obj);
        obj.world = this;
        this.objects.push(obj);
        this.mainContainer.addChild(obj.g);
        obj.onAddedToWorld();
    }

    update() {
        this.objects.forEach(obj => {
            obj.update();
        });
    }
}