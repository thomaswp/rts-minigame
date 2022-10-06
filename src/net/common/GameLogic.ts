import { GameState } from "./GameSchema";
import { Messenger } from "./Messenger";

export class GameLogic {

    currentClientID: string;

    constructor(messenger: Messenger, state: GameState) {
        messenger.addShip.on(args => {
            state.addShip(this.currentClientID, args.ship);
        });

        messenger.roundStarted.on(() => {
            state.startRound();
            messenger.roundStarted.send({ seed: state.seed });
        });
    }
}