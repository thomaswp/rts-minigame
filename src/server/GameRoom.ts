import { Room, Client } from "colyseus";
import { State } from "../sync/GameSchema";

export class GameRoom extends Room<State> {
    maxClients = 4;

    onCreate (options) {
        console.log("StateHandlerRoom created!", options);

        this.setState(new State());

        this.onMessage("addShip", (client, data) => {
            console.log("Room received message from", client.sessionId, ":", data);
            this.state.addShip(client.sessionId, data);
        });

        this.onMessage("startRound", (client, data) => {
            console.log("Room received message from", client.sessionId, ":", data);
            this.state.roundNumber++;
            this.state.seed = Math.random();
            this.clients.forEach(c => c.send("startRound"));
        });
    }

    onAuth(client, options, req) {
        return true;
    }

    onJoin (client: Client) {
        this.state.createPlayer(client.sessionId);
    }

    onLeave (client) {
        this.state.removePlayer(client.sessionId);
    }

    onDispose () {
        console.log("Dispose StateHandlerRoom");
    }

}
