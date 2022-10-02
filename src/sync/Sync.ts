import seedrandom from 'seedrandom'
import * as Matter from 'matter-js';
import * as Colyseus from "colyseus.js"
import { Player, Ship, State } from './GameSchema';

export class Random {

    private rng: () => number;

    constructor(seed: number) {
        this.rng = seedrandom(seed);
    }

    float(): number {
        return this.rng();
    };

    floatRange(min: number, max: number) {
        return this.float() * (max - min) + min;
    }

    int(min: number, max: number): number {
        return Math.round(this.floatRange(min, max));
    };

    boolean(): boolean {
        return this.float() < 0.5;
    };

    chance(chanceZeroToOne: number): boolean {
        return this.float() < chanceZeroToOne;
    }
}

export interface ServerListener {
    init?: (room: Colyseus.Room<State>) => void;
    roundStarted?: () => void;
} 

export class Sync {

    static random: Random;
    static client: Colyseus.Client;
    static room: Colyseus.Room<State>;
    static onShipCreated: (ship: Ship) => void;

    static listeners = [] as ServerListener[]


    static init(seed: number) {
        this.random = new Random(seed);

        // console.log(this.random.float(), this.random.int(0, 100), this.random.boolean());

        const host = window.document.location.host.replace(/:.*/, '');
        const endpoint = location.protocol.replace("http", "ws") + "//" + host + 
            (location.port ? ':' + location.port : '');

        this.client = new Colyseus.Client(endpoint);
        this.client.joinOrCreate("game_room").then(room_instance => {
            this.room = room_instance as Colyseus.Room<State>;
            this.listeners.forEach(l => {
                if (l.init) l.init(this.room)
            });

            // TODO: Use constant message names
            this.room.onMessage("startRound", () => {
                let state = this.room.state;
                console.log(state.seed);
                this.random = new Random(this.room.state.seed);
                Matter.Common['_seed'] = this.random.float();
                this.listeners.forEach(l => {
                    if (l.roundStarted) l.roundStarted()
                });
            });
        });
    }

}