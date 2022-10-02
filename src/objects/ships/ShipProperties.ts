import { Buff } from "./Buffs";

export class BaseProperties {
    maxHealth: number;
    turnRate: number;
    maxFuel: number;
    fuelRegen: number;
    speed: number;
    scale: number;
    fireInterval: number;
    evasionInterval: number;
    numProjectiles: number; // ?

  constructor(
    maxHealth: number, 
    turnRate: number,
    maxFuel: number, 
    fuelRegen: number, 
    speed: number, 
    scale: number, 
    fireInterval: number, 
    evasionInterval: number, 
    numProjectiles: number
) {
    this.maxHealth = maxHealth
    this.turnRate = turnRate
    this.maxFuel = maxFuel
    this.fuelRegen = fuelRegen
    this.speed = speed
    this.scale = scale
    this.fireInterval = fireInterval
    this.evasionInterval = evasionInterval
    this.numProjectiles = numProjectiles
  }

}

export class ShipProperties {
    startingProperties: BaseProperties;
    currentProperties: BaseProperties;
    buffs = [] as Buff[];

    constructor(startingProperties: BaseProperties) {
        this.startingProperties = startingProperties;
        this.currentProperties = startingProperties;
    }

    update() {
        // for each buff in buffs, call buff.update(properties: BaseProperties)
        // each buff.update takes a BaseProperties, does its modifications, then returns a BaseProperties
        // so you would start the chain fresh each time with startingProperties, 
        // then assign the final result after all buffs are applied to currentProperties
        let properties = {...this.startingProperties}; // {...object} is copying the object instead of just copying the reference
        this.buffs.forEach(buff => {buff.update(properties)});
        this.currentProperties = properties;
    }
}

// battler will have startingProperties: BaseProperties and properties: ShipProperties
// in its constructor it will set this.properties = new ShipProperties(startingProperties)
// specific ship types will have startingProperties = new BaseProperties(list out all the ship's properties)

// battler will call properties.update() in its update function
// then anywhere it needs its properties, it references properties.currentProperties
// probably create a get stats() {return this.properties.currentProperties}