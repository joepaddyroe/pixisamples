import * as PIXI from 'pixi.js'

import { Helpers } from './Helpers';
import { FPSCounter } from './FPSCounter';

export class UI {

    private gameApp: PIXI.Application;
    private uiAssets: any;
    private assetsLoaded: boolean = false;
    private uiContainer!: PIXI.Container;

    private fpsCounter!: FPSCounter;

    constructor(app: PIXI.Application) {
        this.gameApp = app;        
        this.Init();
    }

    private Init(): void {
        this.uiContainer = new PIXI.Container();
        this.gameApp.stage.addChild(this.uiContainer);

        this.OnWindowResize();
    }

    public OnWindowResize(): void {
        
        let referenceWidth: number = 1920;
        let referenceHeight: number = 1080;

        let currentWidth: number = window.innerWidth;
        let currentHeight: number = window.innerHeight;

        const scaleX = currentWidth / referenceWidth;
        const scaleY = currentHeight / referenceHeight;

        let scaleFactor = Math.max(scaleX, scaleY);
        scaleFactor = Helpers.ClampNumber(scaleFactor, 1, 2.5)

        this.uiContainer.scale = scaleFactor;
    }

    public async LoadUIAssets() : Promise<any> {

        this.uiAssets = await PIXI.Assets.loadBundle('ui');

        const mySprite = new PIXI.Sprite(this.uiAssets.button)

        mySprite.anchor.set(0.5)
        mySprite.x = this.gameApp.screen.width / 2
        mySprite.y = this.gameApp.screen.height / 2

        this.uiContainer.addChild(mySprite)      
        
        this.fpsCounter = new FPSCounter();
        this.uiContainer.addChild(this.fpsCounter.Container())
        this.fpsCounter.Container().position.set(0, 0)

        this.AssetsLoaded();
    }

    private AssetsLoaded(): void {
        this.assetsLoaded = true;
    }

    public Update(deltaTime: number): void {
        
        if(!this.assetsLoaded)
            return;

        this.fpsCounter.SetFPS(this.gameApp.ticker);

    }
}