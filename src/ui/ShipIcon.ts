import { DisplayObject, Graphics } from "pixi.js";
import { Ship } from "../net/common/GameSchema";
import { InterfaceObject } from "./InterfaceObject";

export class ShipIcon extends InterfaceObject {
    
    graphics: Graphics;
    ship: Ship;
    size: number
    isDown: boolean;
    isOver: boolean;

    constructor(ship: Ship, size: number) {
        super();   
        this.graphics = new  Graphics();
        this.size = size;
        this.ship = ship;
        this.updateGraphics();
        this.graphics.interactive = true;
        this.graphics.buttonMode = true;
        this.graphics.on('pointerdown', this.onButtonDown, this) // final "this" is so "this" refers to the button object instead of the graphics object
                     .on('pointerup', this.onButtonUp, this) // also could do this.onButtonUp.bind(this)
                     .on('pointerupoutside', this.onButtonUp, this)
                     .on('pointerover', this.onButtonOver, this)
                     .on('pointerout', this.onButtonOut, this);

        ship.onRemove = () => {
            this.die();
        }

        ship.onChange = () => {
            this.sync();
        }
        this.sync();
    }

    sync() {
        this.updateGraphics();
        this.g.x = this.ship.x;
        this.g.y = this.ship.y;
    }

    getDisplayObject(): DisplayObject {
        return this.graphics;
    }

    updateGraphics() {
        let myShape = this.graphics;
        myShape.clear();
        myShape.lineStyle(2, this.ship.team / 2);
        myShape.beginFill(this.ship.team);
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
        this.isDown = false;
        if (this.isOver) {
                        
        }
        
    }

    onButtonOver() {
        this.isOver = true;
    }

    onButtonOut() {
        this.isOver = false;
    }
    
    update(): void {
        super.update();
        this.updateGraphics();
        // let scale =  1 + 0.05 * Math.cos(this.elapsedFrames / 20);
        // this.g.scale.x = this.g.scale.y = scale;
    }
}