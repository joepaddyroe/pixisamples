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
    private counterBackground: PIXI.Sprite;

    public Container(): PIXI.Container {
        return this.container;
    }

    constructor(uiAssets: any) {
        this.container = new PIXI.Container()

        this.counterBackground = new PIXI.Sprite(uiAssets.fpsBackground)
        this.container.addChild(this.counterBackground)

        this.fpsText = new PIXI.Text({ text: 'FPS: 0' })
        this.container.addChild(this.fpsText)
        this.fpsText.x = 50;
        this.fpsText.y = 50;
        
        this.fpsLowText = new PIXI.Text({ text: 'LO: 0' })
        this.container.addChild(this.fpsLowText)
        this.fpsLowText.x = 180;
        this.fpsLowText.y = 50;

        this.fpsHighText = new PIXI.Text({ text: 'HI: 0' })
        this.container.addChild(this.fpsHighText)
        this.fpsHighText.x = 300;
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

        this.fpsText.text = 'FPS:' + ticker.FPS.toFixed(1);
        this.fpsLowText.text = 'LO:' + this.fpsLow.toFixed(1);
        this.fpsHighText.text = 'HI:' + this.fpsHigh.toFixed(1);

        if(this.currentResetTime > this.resetTime) {
            this.currentResetTime = 0;
            this.fpsLow = 100000000;
            this.fpsHigh = 0;
        }
    }
}

