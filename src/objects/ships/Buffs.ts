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

    remove(properties) {
        this.ship.removeBuff(this);
        // can add specific removal logic to particular buffs if necessary
        return properties;
    }

    update(properties: BaseProperties) {
        this.elapsedFrames += 1;
        if (this.elapsedFrames >= this.duration) {
            properties = this.remove(properties);
            return properties;
        }

        return properties; // i want the elapsed frames logic, then just enforce that Buff.update needs to return a BaseProperties object
        // abstract class can enforce the latter, but not do the former
        // but i don't need the super.update to actually return properties...
    }
}

export class IncreaseHealth extends Buff {
    duration = 2 * 60 + 1;
    // adding 1 because of the ordering of health removal when removing this one as opposed to the fire rate one; need to fix

    remove(properties) {
        let currentHealthProp = this.ship.stats.currentHealth / this.ship.stats.maxHealth
        properties.maxHealth -= 50;
        properties.currentHealth = currentHealthProp * properties.maxHealth;
        super.remove(properties);
    }

    update(properties: BaseProperties) {
        super.update(properties);        
        let currentHealthProp = this.ship.stats.currentHealth / this.ship.stats.maxHealth
        properties.maxHealth += 50;        
        properties.currentHealth = currentHealthProp * properties.maxHealth
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