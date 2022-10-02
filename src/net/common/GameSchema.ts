import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";

export class Ship extends Schema {
    @type("string") type: string;
    @type("number") x: number;
    @type("number") y: number;
    @type("number") team: number;
}

export class Player extends Schema {
    @type("string") name: string;
    @type([Ship]) ships = new ArraySchema<Ship>();
}

export class GameState extends Schema {
    @type({ map: Player })
    players = new MapSchema<Player>();

    @type("number") roundNumber = 0;
    @type("number") seed = 0;

    createPlayer(sessionId: string) {
        this.players.set(sessionId, new Player());
    }

    removePlayer(sessionId: string) {
        this.players.delete(sessionId);
    }

    addShip(sessionId: string, data: Ship) {
        let player = this.players.get(sessionId);
        if (!player) return;
        player.ships.push(Object.assign(new Ship(), data));
    };
}
