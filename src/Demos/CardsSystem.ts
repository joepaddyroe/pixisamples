import * as PIXI from 'pixi.js'
import { Helpers, Vector2 } from '../Helpers';
import { CardAtlasData } from './SpriteAtlasData/CardAtlasData';



/*
This card system class instantiates a predefined number of sprites
in the form of CardSpriteSheet
The CardSpriteSheet is responsible for maintaining the sprite and the position/roation of the card
I have used a PIXI Spritesheet here to hold all of the textures for the cards and then I can select them as animation frames
Currently this is randomly selected
*/

export class CardsSystem {

    private container: PIXI.Container;
    private cardSpriteSheet!: PIXI.Spritesheet;
    private maxCards: number = 144;
    private cards: CardSpriteSheet[] = [];

    // demo specific
    private currentCardIndex: number = this.maxCards-1;
    private currentTimeOnCard: number = 0;
    private timeToMoveCard: number = 1; // delay between card moves
    private cardMoveTime: number = 0;
    private cardMoveDuration: number = 2; // how long it takes to move a card

    public Container(): PIXI.Container {
        return this.container;
    }

    constructor() {
        this.container = new PIXI.Container();
        this.container.pivot = 0.5;
        this.container.sortableChildren = true;
        this.BuildSpriteData();
    }

    // load up the data from the atlas before triggering instantiation of sprites
    private async BuildSpriteData(): Promise<any> {

        const atlasData = CardAtlasData.AtlasData;

        const spritesheet = new PIXI.Spritesheet(
            PIXI.Texture.from(atlasData.meta.image),
            atlasData
        );

        await spritesheet.parse();

        this.cardSpriteSheet = spritesheet;

        this.AddCardSpriteSheets();
    }

    // instatiation of card objects with some postioning
    // to the deck
    private AddCardSpriteSheets(): void {
        for(let i: number = 0; i < this.maxCards; i++) {
            let card: CardSpriteSheet = new CardSpriteSheet(this.container, this.cardSpriteSheet);
            card.SetPosition(new Vector2(-300, 50 - (i * 4)));
            card.SetStartPosition(new Vector2(-300, 50 - (i * 4)));
            this.cards.push(card);            
        }
    }

    // first waiting for the 1 second interval
    // then starting the interpolation of position and rotation
    // to the target position
    // then resetting the  second interval when the card has reached its target
    public Update(deltaTime: number): void {
        
        if(this.currentTimeOnCard > 0) {
            this.currentTimeOnCard -= deltaTime;
            return;
        }

        this.cardMoveTime += deltaTime;        

        if(this.cardMoveTime >= this.cardMoveDuration) {   
            if(this.currentCardIndex > 0) {                
                this.currentCardIndex--;
                this.currentTimeOnCard = this.timeToMoveCard;
                this.cardMoveTime = 0;
            }
        }                

        const progress: number = Helpers.ClampNumber(this.cardMoveTime / this.cardMoveDuration, 0, 1);

        const centre: Vector2 = new Vector2(200, 200);

        const startAngle = Math.PI*2; // Start at 0 degrees (top)
        const endAngle = 0; // End at 180 degrees (bottom)
        const angleStep = (endAngle - startAngle) / (this.cards.length - 1);

        const radius = 260;
        const angle = startAngle + (this.currentCardIndex * angleStep);
        const x = centre.X + radius * Math.cos(angle);
        const y = centre.Y + radius * Math.sin(angle);

        let targetPosition: Vector2 = new Vector2(x, -y);

        let newPosition = Vector2.LerpDirect(this.cards[this.currentCardIndex].GetStartPosition(), targetPosition, progress);

        const cardTargetAngle = Math.atan2(-y - centre.Y, x - centre.X);
        let newAngle = Vector2.LerpNumber(0, cardTargetAngle + Math.PI/2, progress);
        
        this.cards[this.currentCardIndex].SetPosition(newPosition);
        this.cards[this.currentCardIndex].SetZIndex(this.cards.length - this.currentCardIndex);
        this.cards[this.currentCardIndex].SetRotation(newAngle);
    }

}

export class CardSpriteSheet {

    private container: PIXI.Container;
    private animation: PIXI.AnimatedSprite;
    private startPosition!: Vector2;
   
    constructor(container: PIXI.Container, spriteSheet: PIXI.Spritesheet) {

        this.container = new PIXI.Container();
        this.container.scale = 0.5;

        this.animation = new PIXI.AnimatedSprite(spriteSheet.animations.cards);
      
        this.animation.anchor = 0.5;
        this.animation.currentFrame = (Math.floor(Math.random() * 12) + 1) - 1
        
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

    public SetStartPosition(position: Vector2): void {
        this.startPosition = position;       
    }

    public GetPosition(): Vector2 {
        return new Vector2(this.container.position.x, this.container.position.y);
    }

    public GetStartPosition(): Vector2 {
        return this.startPosition;
    }

    public SetZIndex(zIndex: number): void {
        this.container.zIndex = zIndex;
    }

    public SetRotation(rotation:number) : void {
        this.container.rotation = rotation;
    }

    public GetRotation(): number {
        return this.container.rotation;
    }
}