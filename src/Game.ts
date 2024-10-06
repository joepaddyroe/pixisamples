import * as PIXI from 'pixi.js'

import { Helpers } from './Helpers';
import { FPSCounter } from './FPSCounter';
import { UI } from './UI';
import { ParticleSystem } from './Demos/ParticleSystem';
import { CardsSystem } from './Demos/CardsSystem';
import { TextAndImageTool } from './Demos/TextAndImageTool';


/*
Main Game content holder
Responsible for scaling and positioning Game components like the main background or the Demo content
which is rooted in the "demoContainer" Container, when resolution or orientation changes
It also updates any Game items in need of delta updates
Here we also recieve commands from UI elements like buttons and it here that we 
Remove previous demos and add new ones for play
*/


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
    private demoContainer!: PIXI.Container;

    // demos specific
    private currentGameSelection: GameSelection = GameSelection.NONE;
    private flameParticleSystem!: ParticleSystem | null;
    private cardsSystem!: CardsSystem | null;
    private imageTextTool!: TextAndImageTool | null;

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
        
        this.demoContainer = new PIXI.Container();
        this.gameContainer.addChild(this.demoContainer);
        this.demoContainer.position.set(0, 0);
        this.demoContainer.pivot = 0.5;
              
        this.OnWindowResize();       
    }

    public OnWindowResize(): void {
                
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

        this.gameApp.renderer.resize(window.innerWidth, window.innerHeight);

        this.gameContainer.position.set(window.innerWidth/2, window.innerHeight/2);
        this.gameContainer.scale = scale;        
    }

    // organise all objects for landscape view
    private SetLandscape(): void {
        if(!this.assetsLoaded)
            return;

        this.backgroundSprite.scale = 1.1;
        this.backgroundSprite.x = 0;
        this.backgroundSprite.y = 50;

        this.demoContainer.y = 200;
        this.demoContainer.scale = 1;
    }

    // organise all objects for portrait view
    private SetPotrait(): void {
        if(!this.assetsLoaded)
            return;

        this.backgroundSprite.scale = 1.5;
        this.backgroundSprite.x = 50;
        this.backgroundSprite.y = -window.innerHeight/6;

        this.demoContainer.y = -(window.innerHeight/6);
        this.demoContainer.scale = 1.5;
    }


    public async LoadGameAssets() : Promise<any> {

        this.gameAssets = await PIXI.Assets.loadBundle('game');

        let x = 0;
        let y = 0;

        // not used but left it in as its handy
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
        this.largeCoverBackgroundSprite.scale = 2;
        this.largeCoverBackgroundSprite.tint = 0x555555;
        this.gameContainer.addChild(this.largeCoverBackgroundSprite);

        this.backgroundSprite = new PIXI.Sprite(this.gameAssets.background);
        this.backgroundSprite.anchor.set(0.5)
        this.backgroundSprite.scale = 1.3;
        this.gameContainer.addChild(this.backgroundSprite);
    }

    // updating any objects that are in fact instanced
    // note we wait here until the assetsLoaded flag is true
    public Update(deltaTime: number): void {

        if(!this.assetsLoaded)
            return;

        if(this.flameParticleSystem != null)
            this.flameParticleSystem.Update(deltaTime);

        if(this.cardsSystem != null)
            this.cardsSystem.Update(deltaTime);

        if(this.imageTextTool != null)
            this.imageTextTool.Update(deltaTime);
    }

    // triggered by button onClick event in UI_TextButton
    // removes previous demo item from demoContainer if one was there
    // then instances anew demo and attaches to the demoContainer
    // NOTE: we check for full screen clicks and early return through same menu and system which needs fixing.
    // just pointing out to avoid confusion

    public MenuButonPressed(gameSelection: GameSelection): void {
               
        if(gameSelection == GameSelection.FULL_SCREEN) {
            var elem = document.getElementById("game-canvas");
                if (elem?.requestFullscreen) {
                    elem?.requestFullscreen();
                } 
            return;
        }

        if(this.currentGameSelection == gameSelection)
            return;

        if(this.currentGameSelection != GameSelection.NONE)
            this.CleanupDemo(this.currentGameSelection);

        this.currentGameSelection = gameSelection;

        switch(gameSelection) {
            case GameSelection.ACE_OF_SHADOWS:
                this.BuildCardSystem();
                break;
            case GameSelection.MAGIC_WORDS:
                this.BuildImageTextTool();
                break;
            case GameSelection.PHOENIX_FLAME:
                this.BuildParticleSystem();
                break;
        }
    }

    private CleanupDemo(gameSelection: GameSelection): void {

        switch(gameSelection) {
            case GameSelection.ACE_OF_SHADOWS:
                if(this.cardsSystem != null)
                    this.demoContainer.removeChild(this.cardsSystem.Container());
                this.cardsSystem = null;
                break;
            case GameSelection.MAGIC_WORDS:                
                if(this.imageTextTool != null)
                    this.demoContainer.removeChild(this.imageTextTool.Container());
                this.imageTextTool = null;
                break;
            case GameSelection.PHOENIX_FLAME:
                if(this.flameParticleSystem != null)
                    this.demoContainer.removeChild(this.flameParticleSystem.Container());
                this.flameParticleSystem = null;
                break;
        }
    }


    // Demos
    // building individual demos and setting initial values

    private BuildParticleSystem(): void {

        this.flameParticleSystem = new ParticleSystem();
        this.demoContainer.addChild(this.flameParticleSystem.Container());

        this.flameParticleSystem.Container().position.set(0,0);
        this.flameParticleSystem.Container().scale = 2.5;
    }

    private BuildCardSystem(): void {
        this.cardsSystem = new CardsSystem();
        this.demoContainer.addChild(this.cardsSystem.Container());
    }

    private BuildImageTextTool(): void {
        this.imageTextTool = new TextAndImageTool(this.gameAssets);
        this.demoContainer.addChild(this.imageTextTool.Container());
    }

}

// I shoe horned the full screen selector in here
// simply for speed and convenience
export enum GameSelection {
    ACE_OF_SHADOWS,
    MAGIC_WORDS,
    PHOENIX_FLAME,
    FULL_SCREEN,
    NONE
}