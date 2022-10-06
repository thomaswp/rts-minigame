import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";

export class Ship extends Schema {
    @type("string") type: string;
    @type("number") x: number;
    @type("number") y: number;
    @type("number") team: number;
}

export class Player extends Schema {
    @type("string") name: string;
    @type("boolean") connected: boolean;
    @type([Ship]) ships = new ArraySchema<Ship>();
}

export class GameState extends Schema {
    @type({ map: Player })
    players = new MapSchema<Player>();

    @type("number") roundNumber = 0;
    @type("number") seed = 0;

    @type("boolean") isRunning = false;
    @type("number") lastServerFrameCount = 0;
    private tickInterval;
    private roundStartTime = null as number;

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

    startRound() {
        this.roundNumber++;
        this.seed = Math.random();
        this.isRunning = true;
        this.lastServerFrameCount = 0;
        this.roundStartTime = new Date().getTime();
        this.tickInterval = setInterval(() => {
            let elapsed = new Date().getTime() - this.roundStartTime;
            let frames = elapsed * 60 / 1000;
            // console.log(elapsed, frames);
            this.lastServerFrameCount = frames;
        }, 2000);
    }

    endRound() {
        this.isRunning = false;
        this.lastServerFrameCount = 0;
        this.roundStartTime = null;
        clearInterval(this.tickInterval);
        this.tickInterval = null;
    }
}
