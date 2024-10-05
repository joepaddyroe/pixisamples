import * as PIXI from 'pixi.js'

import { Helpers } from './Helpers';
import { FPSCounter } from './FPSCounter';
import { UI } from './UI';

export class Game {

    // game object specifics
    private gameApp: PIXI.Application;
    private gameAssets: any;
    private assetsLoaded: boolean = false;
    private gameContainer!: PIXI.Container;
    private ui!: UI;

    // game specific
    private backgroundSprite!: PIXI.Sprite;
    private largeCoverBackgroundSprite!: PIXI.Sprite;


    constructor(app: PIXI.Application) {
        this.gameApp = app;        
        this.Init();
    }

    public SetUIRef(ui: UI): void {
        this.ui = ui; 
    }

    private Init() : void {    

        this.gameContainer = new PIXI.Container();
        this.gameApp.stage.addChild(this.gameContainer);
        this.gameContainer.pivot = 0.5        
              
        this.OnWindowResize();       
    }

    public OnWindowResize(): void {
        
        //this.gameApp.renderer.resize(window.innerWidth, window.innerHeight);
        
        let referenceWidth: number = 1920;
        let referenceHeight: number = 1080;

        let scale = 1;

        if(window.innerWidth > window.innerHeight) { //height governs
            scale = window.innerHeight / referenceHeight;
            this.SetLandscape();
        } else { //width governs
            scale = window.innerWidth / referenceWidth;
            this.SetPotrait();
        }

        this.gameContainer.position.set(window.innerWidth/2, window.innerHeight/2);
        this.gameContainer.scale = scale;        
    }

    private SetLandscape(): void {
        if(!this.assetsLoaded)
            return;

        this.backgroundSprite.scale = 1.1;
        this.backgroundSprite.x = 0;
        this.backgroundSprite.y = 50;
    }

    private SetPotrait(): void {
        if(!this.assetsLoaded)
            return;

        this.backgroundSprite.scale = 1.5;
        this.backgroundSprite.x = 50;
        this.backgroundSprite.y = -window.innerHeight/6;
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

        this.AssetsLoaded();
        this.OnWindowResize(); // do this last to make sure all assets are aligned on startup
    }

    private AssetsLoaded(): void {
        this.assetsLoaded = true;

        this.largeCoverBackgroundSprite = new PIXI.Sprite(this.gameAssets.largeCoverBackground);
        this.largeCoverBackgroundSprite.anchor.set(0.5)
        this.largeCoverBackgroundSprite.scale = 3;
        this.gameContainer.addChild(this.largeCoverBackgroundSprite);

        this.backgroundSprite = new PIXI.Sprite(this.gameAssets.background);
        this.backgroundSprite.anchor.set(0.5)
        this.backgroundSprite.scale = 1.3;
        this.gameContainer.addChild(this.backgroundSprite);
    }

    public Update(deltaTime: number): void {

        if(!this.assetsLoaded)
            return;


    }

    public MenuButonPressed(gameSelection: GameSelection): void {
        //console.log("Game Selected: " + GameSelection[gameSelection]);
    }

}

export enum GameSelection {
    ACE_OF_SHADOWS,
    MAGIC_WORDS,
    PHOENIX_FLAME
}