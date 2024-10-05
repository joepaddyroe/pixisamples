import * as PIXI from 'pixi.js'

import { Helpers } from './Helpers';
import { FPSCounter } from './FPSCounter';
import { UI_TextButton } from './UI/UI_TextButton';
import { UI_Menu } from './UI/UI_Menu';
import { Game } from './Game';

export class UI {

    private gameApp: PIXI.Application;
    private uiAssets: any;
    private assetsLoaded: boolean = false;
    private uiContainer!: PIXI.Container;
    private game!: Game;

    private referenceWidth: number = 1920;
    private referenceHeight: number = 1080;
    private uiAnchorRight!: PIXI.Container;
    private fpsCounter!: FPSCounter;
    private uiMenu!: UI_Menu;    

    constructor(app: PIXI.Application) {
        this.gameApp = app;       
        this.Init();
    }

    public SetGameRef(game: Game): void {
        this.game = game; 
    }

    private Init(): void {
        this.uiContainer = new PIXI.Container();
        this.gameApp.stage.addChild(this.uiContainer);

        this.uiAnchorRight = new PIXI.Container();
        this.uiContainer.addChild(this.uiAnchorRight);

        this.OnWindowResize();
    }

    public OnWindowResize(): void {
        
        // let referenceWidth: number = 1920;
        // let referenceHeight: number = 1080;

        // let currentWidth: number = window.innerWidth;
        // let currentHeight: number = window.innerHeight;

        // const scaleX = currentWidth / referenceWidth;
        // const scaleY = currentHeight / referenceHeight;

        // let scaleFactor = Math.min(scaleX, scaleY);

        // this.uiAnchorRight.position.set(window.innerWidth-(128*scaleY), window.innerHeight/2)
        // this.uiAnchorRight.scale = scaleY;

        

        let scale = 1;

        if(window.innerWidth > window.innerHeight) { //height governs
            scale = window.innerHeight / this.referenceHeight;
            this.SetLandscape(scale);
        } else { //width governs
            scale = window.innerWidth / this.referenceWidth;
            this.SetPotrait(scale);
        }        
    }

    private SetLandscape(scale: number): void {
        if(!this.assetsLoaded)
            return;
      
        const aspectRatio: number = this.referenceWidth/this.referenceHeight;
        const currentAspectRatio: number = window.innerWidth/window.innerHeight;

        let currentX: number = 0;

        if(currentAspectRatio < aspectRatio) {
            currentX = window.innerWidth - 120;
        } else {
            //console.log("Why:" + screen.height * aspectRatio)
            currentX = window.innerWidth; 
        }

        this.uiAnchorRight.position.set(currentX, window.innerHeight/2)
        this.uiAnchorRight.scale = scale;
    }

    private SetPotrait(scale: number): void {
        if(!this.assetsLoaded)
            return;

    }


    public async LoadUIAssets() : Promise<any> {

        this.uiAssets = await PIXI.Assets.loadBundle('ui');

        this.uiMenu = new UI_Menu(this.game, this.uiAnchorRight, this.uiAssets);      
        
        this.fpsCounter = new FPSCounter(this.uiAssets);
        this.uiContainer.addChild(this.fpsCounter.Container())
        this.fpsCounter.Container().position.set(0, 0)

        this.AssetsLoaded();
        this.OnWindowResize(); // do this last to make sure all assets are aligned on startup
    }

    private AssetsLoaded(): void {
        this.assetsLoaded = true;

        //let button: UI_TextButton = new UI_TextButton(this.gameApp, this.uiContainer, this.uiAssets);
        
    }

    public Update(deltaTime: number): void {
        
        if(!this.assetsLoaded)
            return;

        this.fpsCounter.SetFPS(this.gameApp.ticker);
        this.uiMenu.Update(deltaTime);
    }
}