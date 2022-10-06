import { Ship } from "./GameSchema";

export interface Sender {
    send(type: string, data: any): void;
    onMessage(type: string, callback: (data: any) => void): void;
}

export type AddShipArgs = { ship: Ship }
export type RoundStartedArgs = { seed: number }

export class Messenger {

    private sender: Sender;
    private messages = [] as Message<any>[];

    readonly addShip: Message<AddShipArgs>;
    readonly roundStarted: Message<RoundStartedArgs>;

    constructor() {
        this.addShip = this.add(new Message<AddShipArgs>('addShip'));
        this.roundStarted = this.add(new Message<RoundStartedArgs>('roundStarted'));
    }

    private add<T>(message: Message<T>): Message<T> {
        this.messages.push(message);
        return message;
    }

    setSender(sender: Sender) {
        this.sender = sender;
        this.messages.forEach(m => m.setSender(sender));
    }
}


export class Message<Data> {

    type: string;
    sender: Sender;
    callbacks = [] as ((data: Data) => void)[];

    constructor(type: string) {
        this.type = type;
    }

    setSender(sender: Sender) {
        this.sender = sender;
        sender.onMessage(this.type, data => {
            this.receive(data);
        })
    }

    receive(data: Data) {
        this.callbacks.forEach(cb => cb(data));
    }

    send(data: Data) {
        if (!this.sender) {
            throw Error("Cannot send before sender is initialized!");
        }
        this.sender.send(this.type, data);
    }

    // TODO: Rename
    on(callback: (data: Data) => void) {
        this.callbacks.push(callback);
    }
}

