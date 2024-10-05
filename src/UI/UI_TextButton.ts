import * as PIXI from 'pixi.js'
import { Game, GameSelection } from '../Game';

export class UI_TextButton {

    // game object specifics
    private game!: Game;
    private uiAssets: any;
    private container: PIXI.Container;
    private parent:PIXI.Container;    

    // button specifics
    private buttonSprite: PIXI.Sprite | undefined;
    private buttonText!: PIXI.Text;
    private gameSelection!: GameSelection;
    private buttonDown: boolean = false;

    // button click anim
    private butonClickDownLength: number = 0.25; // how long to show the button depressed
    private butonClickDownTimer: number = 0;

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

        this.buttonSprite = new PIXI.Sprite(this.uiAssets.button);
        this.buttonSprite.anchor = 0.5;
        this.buttonSprite.height = 160;
        this.buttonSprite.eventMode = 'static';
        this.buttonSprite.cursor = 'pointer';
        this.buttonSprite.on('pointerdown', ()=> {this.ButtonClicked()});

        this.container.addChild(this.buttonSprite);
        
        
        this.buttonText = new PIXI.Text({ text: 'BUTTON' })
        this.buttonText.x = 0;
        this.buttonText.y = 0;
        this.buttonText.anchor = 0.5;
        this.container.addChild(this.buttonText)
    }

    public Container(): PIXI.Container {
        return this.container;
    }
    
    public SetButtonText(text:string): void {
        this.buttonText.text = text;
    }

    public SetButtonGameSelection(gameSelection: GameSelection): void {
        this.gameSelection = gameSelection;
    }

    private ButtonClicked(): void {
        if(this.buttonDown)
            return;
        this.game.MenuButonPressed(this.gameSelection);
        this.PressButtonDown();
    }

    public Update(deltaTime:number): void {
        if(this.buttonDown) {
            this.butonClickDownTimer += deltaTime;
            if(this.butonClickDownTimer >= this.butonClickDownLength) {
                this.ReleaseButtonDown();
                this.butonClickDownTimer = 0;
            }
        }
    }

    private PressButtonDown(): void {
        this.buttonDown = true;
        this.container.x += 10;
        this.container.y -= 10;
    }

    private ReleaseButtonDown(): void {
        this.buttonDown = false;
        this.container.x -= 10;
        this.container.y += 10;
    }

}