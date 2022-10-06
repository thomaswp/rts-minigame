import { Room, Client } from "colyseus";
import { GameLogic } from "../common/GameLogic";
import { GameState } from "../common/GameSchema";
import { Messenger, Sender } from "../common/Messenger";

export class GameRoom extends Room<GameState> {
    maxClients = 4;

    onCreate (options) {
        console.log("StateHandlerRoom created!", options);

        this.setState(new GameState());

        let messenger = new Messenger();
        let gameLogic = new GameLogic(messenger, this.state);

        let me = this;
        let sender = {
            onMessage(type, callback) {
                me.onMessage(type, (client, data) => {
                    console.log("Room received message from", client.sessionId, ":", data);
                    gameLogic.currentClientID = client.sessionId;
                    callback(data);
                })
            },

            send(type, data) {
                me.clients.forEach(c => c.send(type, data));
            },
        } as Sender;
        messenger.setSender(sender);
    }

    onAuth(client, options, req) {
        return true;
    }

    onJoin (client: Client) {
        this.state.createPlayer(client.sessionId);
    }

    onLeave (client) {
        // this.state.removePlayer(client.sessionId);
    }

    onDispose () {
        console.log("Dispose StateHandlerRoom");
    }

}
