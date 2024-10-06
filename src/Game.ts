import * as PIXI from 'pixi.js'

import { Helpers } from './Helpers';
import { FPSCounter } from './FPSCounter';
import { UI } from './UI';
import { ParticleSystem } from './Demos/ParticleSystem';
import { CardsSystem } from './Demos/CardsSystem';

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

        this.gameContainer.position.set(window.innerWidth/2, window.innerHeight/2);
        this.gameContainer.scale = scale;        
    }

    private SetLandscape(): void {
        if(!this.assetsLoaded)
            return;

        this.backgroundSprite.scale = 1.1;
        this.backgroundSprite.x = 0;
        this.backgroundSprite.y = 50;

        this.demoContainer.y = 200;
        this.demoContainer.scale = 1;
    }

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

    public Update(deltaTime: number): void {

        if(!this.assetsLoaded)
            return;

        if(this.flameParticleSystem != null)
            this.flameParticleSystem.Update(deltaTime);

        if(this.cardsSystem != null)
            this.cardsSystem.Update(deltaTime);
    }

    public MenuButonPressed(gameSelection: GameSelection): void {
               
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
                
                break;
            case GameSelection.PHOENIX_FLAME:
                this.BuildParticleSystem();
                break;
            case GameSelection.FULL_SCREEN:
                var elem = document.getElementById("game-canvas");
                if (elem?.requestFullscreen) {
                    elem?.requestFullscreen();
                } 
                // else if (elem?.webkitRequestFullscreen) { /* Safari */
                //     elem?.webkitRequestFullscreen();
                // } 
                // else if (elem?.msRequestFullscreen) { /* IE11 */
                //     elem?.msRequestFullscreen();
                // }
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
                break;
            case GameSelection.PHOENIX_FLAME:
                if(this.flameParticleSystem != null)
                    this.demoContainer.removeChild(this.flameParticleSystem.Container());
                this.flameParticleSystem = null;
                break;
        }
    }

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

}

export enum GameSelection {
    ACE_OF_SHADOWS,
    MAGIC_WORDS,
    PHOENIX_FLAME,
    FULL_SCREEN,
    NONE
}