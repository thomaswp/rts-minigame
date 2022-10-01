
export interface Updatable {
    update(): void;
}

export interface Updater {
    updatables: Updatable[];
}

export type UpdateFunction = () => (boolean | void)

export class Action implements Updatable {

    runner: Updater;
    updater: UpdateFunction;
    onSuccess: (value: void | PromiseLike<void>) => void;
    nextAction: Action;

    constructor(runner: Updater, update: UpdateFunction) {
        this.runner = runner;
        this.updater = update;
    }

    run() {
        this.runner.updatables.push(this);
        return this;
    }

    update() {
        let result = this.updater();
        if (result === undefined || result) {
            let index = this.runner.updatables.indexOf(this);
            if (index !== -1) this.runner.updatables.splice(index, 1);
            if (this.nextAction) this.nextAction.run();
        }
    }

    then(update: UpdateFunction) {
        this.nextAction = new Action(this.runner, update);
        return this.nextAction;
    }

    wait(frames: number) {
        return this.then(() => {
            frames -= 1;
            return frames <= 0;
        })
    }
}