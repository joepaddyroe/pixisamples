import * as PIXI from 'pixi.js'
import { UI_TextButton } from './UI_TextButton';
import { Game, GameSelection } from '../Game';

/*
Main UI content holder
Responsible for scaling and positioning UI components like the menu or the fps container
When resolution or orientation changes
It also updates any UI items in need of delta updates
*/


export class UI_Menu {

    // game object specifics
    private game: Game;
    private uiAssets: any;
    private container: PIXI.Container;
    private parent:PIXI.Container;

    // button specifics
    private textButtons: UI_TextButton[] = [];
    private buttonNames: string[] = ['Ace of Shadows','Magic Words','Phoenix Flame', 'Full Screen'];
    private gameSelections: GameSelection[] = [GameSelection.ACE_OF_SHADOWS, GameSelection.MAGIC_WORDS, GameSelection.PHOENIX_FLAME, GameSelection.FULL_SCREEN];
    private menuBackgroundSprite!: PIXI.Sprite;

    constructor(game: Game, parent: PIXI.Container, uiAssets: any) {
        this.game = game;   
        this.uiAssets = uiAssets;
        this.parent = parent;     
        this.container = new PIXI.Container();
        this.container.pivot = 0.5;
        this.Init();
    }

    private Init(): void {        
        this.parent.addChild(this.container);

        this.menuBackgroundSprite = new PIXI.Sprite(this.uiAssets.menuBackground)

        this.menuBackgroundSprite.anchor.set(0.5);
        this.menuBackgroundSprite.x = 0;
        this.menuBackgroundSprite.y = 0;
        this.menuBackgroundSprite.width = 512;
        this.menuBackgroundSprite.height = 916;
        this.container.addChild(this.menuBackgroundSprite);

        for(let i: number = 0; i < this.gameSelections.length; i++) {
            this.textButtons[i] = new UI_TextButton(this.game, this.container, this.uiAssets);
            this.textButtons[i].Container().position.y = -250 + (i * 200);
            this.textButtons[i].SetButtonText(this.buttonNames[i]);
            this.textButtons[i].SetButtonGameSelection(this.gameSelections[i]);
        }
        
    }

    public SetOrientationLandscape(): void {
        this.menuBackgroundSprite.anchor.set(0.5);
        this.menuBackgroundSprite.x = 0;
        this.menuBackgroundSprite.y = 0;
        this.menuBackgroundSprite.width = 512;
        this.menuBackgroundSprite.height = 916;
        this.menuBackgroundSprite.angle = 0;

        for(let i: number = 0; i < this.gameSelections.length; i++) {
            this.textButtons[i].Container().position.x = -70;
            this.textButtons[i].Container().position.y = -250 + (i * 200);
        }

        this.container.scale = 1;
    }

    public SetOrientationPortrait(): void {
        this.menuBackgroundSprite.anchor.set(0.5);
        this.menuBackgroundSprite.x = 0;
        this.menuBackgroundSprite.y = 0;
        this.menuBackgroundSprite.width = 1000;
        this.menuBackgroundSprite.height = 2100;
        this.menuBackgroundSprite.angle = 90;

        for(let i: number = 0; i < this.gameSelections.length; i++) {
            this.textButtons[i].Container().position.x = 400;
            this.textButtons[i].Container().position.y = -375 + (i * 150);;
        }

        this.container.scale = 1.5;
    }

    public Container(): PIXI.Container {
        return this.container;
    }

    public Update(deltaTime:number): void {
        for(let i: number = 0; i < this.textButtons.length; i++) {
            this.textButtons[i].Update(deltaTime);
        }
    }    

}