
export interface Updatable {
    update(): void;
}

export interface Updater {
    updatables: Updatable[];
}

/**
 * A function that will be called every frame until it returns true.
 */
export type UpdateFunction = () => (boolean | void)

export class Action implements Updatable {

    runner: Updater;
    updaters: UpdateFunction[] = [];
    onSuccess: (value: void | PromiseLike<void>) => void;

    constructor(runner: Updater, update?: UpdateFunction) {
        this.runner = runner;
        if (update) this.then(update);
    }

    run() {
        this.runner.updatables.push(this);
        return this;
    }

    remove() {
        let index = this.runner.updatables.indexOf(this);
        if (index !== -1) this.runner.updatables.splice(index, 1);
    }

    update() {
        // If we're out of things to do, remove ourselves from the runner
        if (this.updaters.length == 0) {
            this.remove();
            return;
        }
        
        // Run the next update function
        let next = this.updaters[0];
        if (next()) {
            // If it's completed, remove it and update again
            this.updaters.shift();
            this.update();
        }
    }

    then(update: UpdateFunction) {
        this.updaters.push(update);
        return this;
    }

    wait(frames: number) {
        return this.then(() => {
            frames -= 1;
            return frames <= 0;
        })
    }
}