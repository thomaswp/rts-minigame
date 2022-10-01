import { DisplayObject, Graphics } from "pixi.js";
import { BlobShip } from "../objects/ships/BlobShip";
import { InterfaceObject } from "./InterfaceObject";

export class Button extends InterfaceObject {
    
    graphics: Graphics;
    color: number;
    size: number
    // isDown: boolean;
    // isOver: boolean;

    constructor(size: number, color: number) {
        super();   
        this.graphics = new  Graphics();
        this.size = size;
        this.color = color;
        this.updateGraphics();
        this.graphics.interactive = true;
        this.graphics.buttonMode = true;
        this.graphics.on('pointerdown', this.onButtonDown, this) // final "this" is so "this" refers to the button object instead of the graphics object
                     .on('pointerup', this.onButtonUp, this) // also could do this.onButtonUp.bind(this)
                     .on('pointerupoutside', this.onButtonUp, this)
                     .on('pointerover', this.onButtonOver, this)
                     .on('pointerout', this.onButtonOut, this);
    }

    getDisplayObject(): DisplayObject {
        return this.graphics;
    }

    updateGraphics() {
        let myShape = this.graphics;
        myShape.clear();
        myShape.lineStyle(2, this.color / 2);
        myShape.beginFill(this.color);
        let size = this.size;
        myShape.drawCircle(0, 0, size);
        myShape.drawCircle(size, 0, 3);
        myShape.endFill();

        return myShape;
    }

    onButtonDown() {
        this.isDown = true;
        
    }

    onButtonUp() {
        this.isDown = false; // "this" inside of here seems to refer to both the graphics object and the button object, which is confusing vs code (and me)
        // console.log('Up!');
        // console.log(this.constructor.name); // confirms 'this' refers to the button now
        // console.log(this.isDown); // confirms setting this.isDown is working, even though 'this' should refer to the button, which doesn't have an isDown property
        // console.log(this); // again confirms 'this' is the button, but it's somehow both?
        // console.log(super.constructor.name); //InterfaceObject
        if (this.isOver) {
            if (Math.random() < .5) {
                this.world.game.world.addObject(new BlobShip(0xcc3333)); // this.world.game.world is not the most intuitive
            } else {
                this.world.game.world.addObject(new BlobShip(0x3333cc)); // would look like this.world.game.ui going the other way (a world object accessing a ui object)
            }
            
        }
        
    }

    onButtonOver() {
        this.isOver = true;
    }

    onButtonOut() {
        this.isOver = false;
    }
    
    update(delta: number): void {
        super.update(delta);
        this.updateGraphics();
        let scale =  1 + 0.05 * Math.cos(this.elapsedFrames / 20);
        this.g.scale.x = this.g.scale.y = scale;
    }
}