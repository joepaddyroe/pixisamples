import * as PIXI from 'pixi.js'

import { Helpers } from './Helpers';
import { FPSCounter } from './FPSCounter';

export class Game {

    private gameApp: PIXI.Application;
    private gameAssets: any;
    private assetsLoaded: boolean = false;
    private gameContainer!: PIXI.Container;

    constructor(app: PIXI.Application) {
        this.gameApp = app;        
        this.Init();
    }

    private Init() : void {    

        this.gameContainer = new PIXI.Container();
        this.gameApp.stage.addChild(this.gameContainer);
        this.gameContainer.pivot = 0.5        
              
        this.OnWindowResize();       
    }

    public OnWindowResize(): void {
        
        this.gameApp.renderer.resize(window.innerWidth, window.innerHeight);
        this.gameContainer.position.set(window.innerWidth/2, window.innerHeight/2);
    }

    public async LoadGameAssets() : Promise<any> {

        this.gameAssets = await PIXI.Assets.loadBundle('game');

        let x = 0;
        let y = 0;

        this.gameApp.canvas.addEventListener('mousemove', (e) =>
        {
            x = e.clientX;
            y = e.clientY;
        });
    }

    private AssetsLoaded(): void {
        this.assetsLoaded = true;
    }

    public Update(deltaTime: number): void {

        if(!this.assetsLoaded)
            return;


    }

}