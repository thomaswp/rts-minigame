import { Buff } from "./Buffs";

export class BaseProperties {
    maxHealth: number;
    currentHealth: number;
    turnRate: number;
    maxFuel: number;
    fuelRegen: number;
    speed: number;
    scale: number;
    fireInterval: number;
    evasionInterval: number;
    numProjectiles: number; // ?

  constructor(
    maxHealth = 10, 
    turnRate = .01,
    maxFuel = 99999, 
    fuelRegen = 1, 
    speed = 1, 
    scale = 1, 
    fireInterval = 60 * 2, 
    evasionInterval = 60 * 2, 
    numProjectiles = 1
) {
    this.maxHealth = maxHealth
    this.currentHealth = maxHealth
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
        properties.currentHealth = this.currentProperties.currentHealth;
        // so as of this point 'properties' is the base starting properties of the ship
        // with the current/actively updating properties like health and shield and fuel overwritten with their current values
        // got to be a better way
        // console.log(this.buffs);
        let buffs = [...this.buffs]
        buffs.forEach(buff => {buff.update(properties)});
        this.currentProperties = properties;

        // things like remaining health, shield, fuel need to be handled differently
        // because otherwise i'm overwriting them...need to rethink
        // could use an isapplied flag, and only calculate buffs once, if they haven't been applied yet,
        // but i like the flexibility of continuously calculating them, because they
        // could be depending on other dynamic factors
        // these kinds of properties could exist outside of 'properties', but that doesn't seem right
        // could keep track of 'damage taken' or 'fuel used' at the ship level, though that seems clumsy
        // maybe just manually overwriting them inside this ship properties update?
    }
}

// battler will have startingProperties: BaseProperties and properties: ShipProperties
// in its constructor it will set this.properties = new ShipProperties(startingProperties)
// specific ship types will have startingProperties = new BaseProperties(list out all the ship's properties)

// battler will call properties.update() in its update function
// then anywhere it needs its properties, it references properties.currentProperties
// probably create a get stats() {return this.properties.currentProperties}