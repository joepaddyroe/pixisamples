import * as PIXI from 'pixi.js'
import { Helpers, Vector2 } from '../Helpers';
import { CardAtlasData } from './SpriteAtlasData/CardAtlasData';

export class CardsSystem {

    private container: PIXI.Container;
    private cardSpriteSheet!: PIXI.Spritesheet;
    private maxCards: number = 144;
    private cards: CardSpriteSheet[] = [];

    // demo specific
    private currentCardIndex: number = this.maxCards-1;
    private currentTimeOnCard: number = 0;
    private timeToMoveCard: number = 2;

    public Container(): PIXI.Container {
        return this.container;
    }

    constructor() {
        this.container = new PIXI.Container();
        this.container.pivot = 0.5;
        this.container.sortableChildren = true;
        this.BuildSpriteData();
    }


    private async BuildSpriteData(): Promise<any> {

        const atlasData = CardAtlasData.AtlasData;

        const spritesheet = new PIXI.Spritesheet(
            PIXI.Texture.from(atlasData.meta.image),
            atlasData
        );

        // Generate all the Textures asynchronously
        await spritesheet.parse();

        this.cardSpriteSheet = spritesheet;

        this.AddCardSpriteSheets();
    }

    private AddCardSpriteSheets(): void {
        for(let i: number = 0; i < this.maxCards; i++) {
            this.cards.push(new CardSpriteSheet(this.container, this.cardSpriteSheet))
            this.cards[i].SetPosition(new Vector2(-300, 50 - (i * 4)));
        }
    }

    public Update(deltaTime: number): void {
        
        this.currentTimeOnCard += deltaTime;
        if(this.currentTimeOnCard >= this.timeToMoveCard) {            
            if(this.currentCardIndex > 0) {
                this.currentTimeOnCard = 0;
                this.currentCardIndex--;
            } else {
                return;
            }
        }

        const progress: number = this.currentTimeOnCard / this.timeToMoveCard;

        let targetPosition: Vector2 = new Vector2(300, -200);

        let currentPosition: Vector2 = this.cards[this.currentCardIndex].GetPosition();
        currentPosition = currentPosition.Lerp(currentPosition, targetPosition, progress);

        // this.cards[this.currentCardIndex].SetPosition(currentPosition);
    }

}

export class CardSpriteSheet {

    private container: PIXI.Container;
    private animation: PIXI.AnimatedSprite;
   
    constructor(container: PIXI.Container, spriteSheet: PIXI.Spritesheet) {

        this.container = new PIXI.Container();
        this.container.scale = 0.5;

        // spritesheet is ready to use!
        this.animation = new PIXI.AnimatedSprite(spriteSheet.animations.cards);
      
        // this.animation.height = 512;
        // this.animation.width = 512;
        this.animation.anchor = 0.5;
        this.animation.currentFrame = (Math.floor(Math.random() * 12) + 1) - 1
        // set the animation speed
        //this.animation.animationSpeed = 0.1666;
        //this.animation.play();
        
        // add it to the stage to render
        this.container.addChild(this.animation);      
        this.animation.pivot.set(this.container.x+64, this.container.y+64)        
        container.addChild(this.container);
        this.container.pivot.set(container.x, container.y)
    }

    public Container(): PIXI.Container {
        return this.container;
    }

    public SetPosition(position: Vector2): void {
        this.container.position.set(position.X, position.Y);
    }

    public GetPosition(): Vector2 {
        return new Vector2(this.container.position.x, this.container.position.y);
    }
}