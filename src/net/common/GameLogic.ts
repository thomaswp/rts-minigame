import { GameState } from "./GameSchema";
import { Messenger } from "./Messenger";

export type JoinOptions = {
    name: string
}

export class GameLogic {

    currentClientID: string;
    state: GameState;
    messenger: Messenger;

    constructor(messenger: Messenger, state: GameState) {
        this.messenger = messenger;
        this.state = state;

        messenger.addShip.on(args => {
            state.addShip(this.currentClientID, args.ship);
        });

        messenger.roundStarted.on(() => {
            state.startRound();
            messenger.roundStarted.send({ seed: state.seed });
        });
    }

    onPlayerJoined(clientID: string, options: JoinOptions) {
        // TODO: read name
        this.state.createPlayer(clientID);
    }

    onPlayerLeft(clientID: string) {

    }
}