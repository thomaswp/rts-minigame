import { Container, DisplayObject } from "pixi.js";
import { InterfaceObject } from "./InterfaceObject";
import * as Colyseus from "colyseus.js"
import { Ship, GameState } from "../net/common/GameSchema";
import { ShipIcon } from "./ShipIcon";
import { Sync } from "../net/client/Sync";
import { BaseObject, ObjectContainer } from "../world/BaseObject";
import { removeFrom } from "../util/MathUtil";
import { UI } from "./UI";
import { Game } from "../world/Game";

// TODO: This is a problem with the "World" system
// It assumes all things world updates have to be its container's direct
// children. Ideally there should be intermediate containers like this,
// But they shouldn't all have to be object containers...
export class ShipDisplay extends InterfaceObject implements ObjectContainer {

    container: Container;
    objects = [] as BaseObject<UI>[];

    constructor() {
        super();
        this.container = new Container();
        Sync.listeners.push(() => this.addListeners());
        this.g.x = Game.width / 2;
        this.g.y = Game.height / 2;
    }

    removeObject(object: BaseObject<UI>): boolean {
        this.container.removeChild(object.g);
        return removeFrom(this.objects, object);
    }

    getDisplayObject(): DisplayObject {
        return this.container;
    }

    private addShip(ship: Ship) {
        let icon = new ShipIcon(ship, 20);
        this.objects.push(icon);
        this.container.addChild(icon.g);
    }

    addListeners() {
        let state = Sync.state;
        // listen to patches coming from the server
        state.players.onAdd = (player, sessionId) => {
            player.ships.onAdd = (ship) => {
                this.addShip(ship);
            }
        }

        state.players.onRemove = (player, sessionId) => {
            // TODO
        }
    }

    update(): void {
        this.objects.forEach(o => o.update());
    }
    
}