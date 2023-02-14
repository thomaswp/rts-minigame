import { DisplayObject, Graphics } from "pixi.js";
import { InterfaceObject } from "./InterfaceObject";

export abstract class Button extends InterfaceObject {
    
    graphics: Graphics;
    isDown: boolean;
    isOver: boolean;

    constructor() {
        super();
        this.graphics = new  Graphics();
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

    abstract updateGraphics(): void;
    abstract onPressed(): void;

    onButtonDown() {
        this.isDown = true;
    }

    onButtonUp() {
        this.isDown = false;
        if (this.isOver) {
            this.onPressed();            
        }
    }

    onButtonOver() {
        this.isOver = true;
    }

    onButtonOut() {
        this.isOver = false;
    }
}