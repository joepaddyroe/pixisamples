import * as PIXI from 'pixi.js'
import { UI_TextButton } from './UI_TextButton';
import { Game, GameSelection } from '../Game';

export class UI_Menu {

    // game object specifics
    private game: Game;
    private uiAssets: any;
    private container: PIXI.Container;
    private parent:PIXI.Container;

    // button specifics
    private textButtons: UI_TextButton[] = [];
    private buttonNames: string[] = ['Ace of Shadows','Magic Words','Phoenix Flame'];
    private gameSelections: GameSelection[] = [GameSelection.ACE_OF_SHADOWS, GameSelection.MAGIC_WORDS, GameSelection.PHOENIX_FLAME];
      

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

        const menuBackgroundSprite = new PIXI.Sprite(this.uiAssets.menuBackground)

        menuBackgroundSprite.anchor.set(0.5);
        menuBackgroundSprite.x = 0;
        menuBackgroundSprite.y = 0;
        menuBackgroundSprite.width = 512;
        menuBackgroundSprite.height = 916;
        this.container.addChild(menuBackgroundSprite);

        for(let i: number = 0; i < 3; i++) {
            this.textButtons[i] = new UI_TextButton(this.game, this.container, this.uiAssets);
            this.textButtons[i].Container().position.y = -200 + (i * 200);
            this.textButtons[i].SetButtonText(this.buttonNames[i]);
            this.textButtons[i].SetButtonGameSelection(this.gameSelections[i]);
        }
        
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