// where is addBuff() going to go?
// some function that does ship.properties.buffs.push(buff:Buff)
import { removeFrom } from "../../util/MathUtil";
import { Battler } from "./Battler";
import { BaseProperties } from "./ShipProperties";

// should this be a baseobject? i don't really want it to exist in the 'world', 
// just in the array of buffs for a certain ship properties
// but i am duplicating some of the stuff from baseobject
// and it should be okay because ship properties will always get updated every frame
// just like anything in the world would
export abstract class Buff {
    ship: Battler;
    elapsedFrames = 0;
    isApplied = false;
    duration: number;

    update(properties: BaseProperties) {
        this.elapsedFrames += 1;
        if (this.elapsedFrames >= this.duration) {
            this.ship.removeBuff(this);
            return;
        }

        return properties; // i want the elapsed frames logic, then just enforce that Buff.update needs to return a BaseProperties object
        // abstract class can enforce the latter, but not do the former
        // but i don't need the super.update to actually return properties...
    }
}

export class IncreaseHealth extends Buff {
    duration = 2 * 60;

    update(properties: BaseProperties) {
        super.update(properties);
        properties.maxHealth += 50;
        return properties;
    }

}

export class IncreaseFireRate extends Buff {
    duration = 10 * 60;

    update(properties: BaseProperties) {
        super.update(properties);
        properties.fireInterval *= 0.2;
        return properties;
    }

}