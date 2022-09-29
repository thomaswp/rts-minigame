
export interface Updatable {
    update(delta: number): void;
}

export interface Updater {
    updatables: Updatable[];
}

export type UpdateFunction = (delta: number) => (boolean | void)

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

    update(delta: number) {
        let result = this.updater(delta);
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
        return this.then(delta => {
            frames -= delta;
            return frames <= 0;
        })
    }
}