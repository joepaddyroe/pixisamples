import * as PIXI from 'pixi.js'
import { Helpers } from './Helpers';

export class FPSCounter {

    private container: PIXI.Container;
    private fpsText: PIXI.Text;
    private fpsLowText: PIXI.Text;
    private fpsHighText: PIXI.Text;
    private fpsHigh: number = 0;
    private fpsLow: number = 100000000;
    private textUpdateFrequency: number = 1;
    private currentUpdateTime: number = 0;
    private resetTime: number = 5;
    private currentResetTime: number = 0;

    public Container(): PIXI.Container {
        return this.container;
    }

    constructor() {
        this.container = new PIXI.Container()

        let background = new PIXI.Graphics().rect(0, 0, 150, 80).fill(0xff0000)
        this.container.addChild(background)

        this.fpsText = new PIXI.Text({ text: 'FPS: 0' })
        this.container.addChild(this.fpsText)
        this.fpsText.y = 0;
        
        this.fpsLowText = new PIXI.Text({ text: 'LOW: 0' })
        this.container.addChild(this.fpsLowText)
        this.fpsLowText.y = 25;

        this.fpsHighText = new PIXI.Text({ text: 'HIGH: 0' })
        this.container.addChild(this.fpsHighText)
        this.fpsHighText.y = 50;

    }

    public SetFPS(ticker: PIXI.Ticker): void {

        if(this.fpsHigh < ticker.FPS) {
            this.fpsHigh = ticker.FPS;
        }
        if(this.fpsLow > ticker.FPS) {
            this.fpsLow = ticker.FPS;
        }

        this.currentUpdateTime += ticker.deltaMS/1000;
        this.currentResetTime += ticker.deltaMS/1000;

        if(this.currentUpdateTime < this.textUpdateFrequency) {
            return;
        } else {
            this.currentUpdateTime = 0;
        }

        this.fpsText.text = 'FPS: ' + ticker.FPS.toFixed(2);
        this.fpsLowText.text = 'LOW: ' + this.fpsLow.toFixed(2);
        this.fpsHighText.text = 'HIGH: ' + this.fpsHigh.toFixed(2);

        if(this.currentResetTime > this.resetTime) {
            this.currentResetTime = 0;
            this.fpsLow = 100000000;
            this.fpsHigh = 0;
        }
    }
}

