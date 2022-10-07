import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";

export class Ship extends Schema {
    @type("string") type: string;
    @type("number") x: number;
    @type("number") y: number;
    @type("number") color: number;
}

const playerColors = [
    0xcc3333,
    0x33cc33,
    0x3333cc,
    0xcc33cc,
];

export class Player extends Schema {
    @type("string") name: string;
    @type("boolean") connected: boolean;
    @type("number") color: number;
    @type([Ship]) ships = new ArraySchema<Ship>();
}

export class GameState extends Schema {
    @type([Player])
    players = new ArraySchema<Player>();

    @type({ map: "number" })
    clientNumber = new MapSchema<number>();

    @type("number") roundNumber = 0;
    @type("number") seed = 0;

    @type("boolean") isRunning = false;
    @type("number") lastServerFrameCount = 0;
    private tickInterval;
    private roundStartTime = null as number;

    getPlayer(sessionId: string) {
        return this.players[this.clientNumber.get(sessionId)];
    }

    createOrBindPlayer(sessionId: string, name: string) {
        let player = null;
        if (name) {
            player = this.players.filter(
                p => p.name == name && !p.connected
            )[0];
        }
        if (!player) {
            player = this.players.filter(p => !p.connected)[0];
        }
        if (!player) {
            player = new Player()
            this.players.push(player);
            player.color = playerColors[this.players.length - 1];
        }
        player.connected = true;
        player.name = name;
        this.clientNumber.set(sessionId, this.players.indexOf(player));
    }

    onPlayerLeft(sessionId: string) {
        this.getPlayer(sessionId).connected = false;
        this.clientNumber.delete(sessionId);
    }

    addShip(sessionId: string, data: Ship) {
        let player = this.getPlayer(sessionId);
        if (!player) return;
        let ship = Object.assign(new Ship(), data);
        ship.color = player.color;
        player.ships.push(ship);
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
