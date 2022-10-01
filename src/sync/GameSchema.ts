import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";

export class Ship extends Schema {
    @type("string") type: string;
    @type("number") x: number;
    @type("number") y: number;
}

export class Player extends Schema {
    @type("string") name: string;
    @type([Ship]) ships = new ArraySchema<Ship>();
}

export class State extends Schema {
    @type({ map: Player })
    players = new MapSchema<Player>();

    createPlayer(sessionId: string) {
        this.players.set(sessionId, new Player());
    }

    removePlayer(sessionId: string) {
        this.players.delete(sessionId);
    }

    addShip(sessionId: string, data: Ship) {
        let player = this.players.get(sessionId);
        if (!player) return;
        console.log("adding", data);
        player.ships.push(Object.assign(new Ship(), data));
    };
}
