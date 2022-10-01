import seedrandom from 'seedrandom'
import * as Matter from 'matter-js';
import * as Colyseus from "colyseus.js"

export class Random {

    private rng: () => number;

    constructor(seed: number) {
        console.log(seedrandom);
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

export class Sync {

    static random: Random;

    static init(seed: number) {
        this.random = new Random(seed);
        Matter.Common['_seed'] = this.random.float();

        // console.log(this.random.float(), this.random.int(0, 100), this.random.boolean());

        var host = window.document.location.host.replace(/:.*/, '');

        var client = new Colyseus.Client(location.protocol.replace("http", "ws") + "//" + host + (location.port ? ':' + location.port : ''));
        var room;
        client.joinOrCreate("game_room").then(room_instance => {
            room = room_instance

            var players = {};

            // listen to patches coming from the server
            room.state.players.onAdd = function (player, sessionId) {

                player.onChange = function (changes) {
                    console.log(changes);
                }

                players[sessionId] = {}; //TODO
            }

            room.state.players.onRemove = function (player, sessionId) {
                document.body.removeChild(players[sessionId]);
                delete players[sessionId];
            }

            
            room.onMessage("hello", (message) => {
                console.log(message);
            });
        });
    }

}