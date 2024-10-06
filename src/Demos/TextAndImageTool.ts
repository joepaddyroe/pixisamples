import * as PIXI from 'pixi.js'
import { Helpers, Vector2 } from '../Helpers';
import { CardAtlasData } from './SpriteAtlasData/CardAtlasData';

export class TextAndImageTool {

    private container: PIXI.Container;
    private gameAssets: any;

    // demo specific
    private doRandomSwapTimer: number = 0;
    private randomSwapDuration: number = 2; // how long it takes to move a card
    private alphaFadeIn: number = 0;
    private imageSprite!: PIXI.Sprite;
    private richText!: PIXI.Text;

    // font list
    private fontList: string[] = ['Arial', 'Comic Sans MS', 'Helvetica', 'Georgia', 'Times New Roman', 'Trebuchet', 'Tahoma', 'Palatino Lino Type', 'Impact'];
    private fontStyles: PIXI.TextStyleFontStyle[] = ['normal', 'italic', 'oblique'];
    private fontWeights: PIXI.TextStyleFontWeight[] = ['normal', 'bold', 'bolder', 'lighter', '100', '200', '300', '400', '500', '600', '700', '800', '900'];

    public Container(): PIXI.Container {
        return this.container;
    }

    constructor(gameAssets: any) {
        this.container = new PIXI.Container();
        this.container.pivot = 0.5;
        this.imageSprite = new PIXI.Sprite();
        this.gameAssets = gameAssets;
        this.container.addChild(this.imageSprite);
        this.DoImageTextSwap();
    }

    public Update(deltaTime: number): void {
        
        this.doRandomSwapTimer += deltaTime;
        if(this.doRandomSwapTimer > this.randomSwapDuration) {
            this.doRandomSwapTimer = 0;
            this.DoImageTextSwap();
        }

        if(this.alphaFadeIn < 1) {
            this.alphaFadeIn += deltaTime;
            this.alphaFadeIn = Helpers.ClampNumber(this.alphaFadeIn, 0, 1);
        }

        if(this.richText)
            this.richText.alpha = this.alphaFadeIn;
    }

    private DoImageTextSwap(): void {

        this.alphaFadeIn = 0;

        if(this.richText != null)
            this.container.removeChild(this.richText);
               
        const fill = new PIXI.FillGradient(0, 0, 0, 36 * 1.7 * 7);

        const colors = [this.GetRandomHexColour(), this.GetRandomHexColour()].map((color) => PIXI.Color.shared.setValue(color).toNumber());

        colors.forEach((number, index) =>
        {
            const ratio = index / colors.length;

            fill.addColorStop(ratio, number);
        });

        let font = this.fontList[Math.floor((Math.random() * this.fontList.length-1) + 1)];
        let fontSize = Math.floor((Math.random() * 50) + 30);
        let fontStyle = this.fontStyles[Math.floor((Math.random() * this.fontStyles.length-1) + 1)];
        let fontWeight = this.fontWeights[Math.floor((Math.random() * this.fontWeights.length-1) + 1)];
        let shouldFill: boolean = Math.floor((Math.random() * 3) + 1) == 1;
        let shouldWordWrap: boolean = Math.floor((Math.random() * 3) + 1) == 1;

        let style = new PIXI.TextStyle();
        style.fontFamily = font;
        style.fontSize = fontSize;
        style.fontStyle = fontStyle;
        style.fontWeight = fontWeight;
        style.fill = fill;

        style.wordWrap = shouldWordWrap;
        style.wordWrapWidth = Math.floor((Math.random() * 400) + 1)

        this.richText = new PIXI.Text({
            text: this.GenerateRandomSentence(),
            style,
        });

        this.richText.anchor = 0.5;

        this.container.addChild(this.richText);

    }

    private GetRandomHexColour(): string {
        const randomColor = Math.floor(Math.random() * 0xFFFFFF);
        return `#${randomColor.toString(16).padStart(6, '0')}`;
    }

    private GenerateRandomSentence(): string {

        const subjects = ['The cat', 'A dog', 'My friend', 'The teacher', 'An artist', 'A scientist', 'A musician', 'The baker', 'The bird', 'The child'];
        const verbs = ['runs', 'jumps', 'paints', 'sings', 'teaches', 'eats', 'creates', 'builds', 'draws', 'explores'];
        const objects = ['in the park', 'on the roof', 'in the yard', 'under the tree', 'in the city', 'at work', 'by the lake', 'on the mountain'];
    
        const subject = subjects[Math.floor(Math.random() * subjects.length)];
        const verb = verbs[Math.floor(Math.random() * verbs.length)];
        const object = objects[Math.floor(Math.random() * objects.length)];
    
        this.SetImageSprite(object);

        return `${subject} ${verb} ${object}.`;

    }

    private SetImageSprite(objectName: string): void {      

        if(this.imageSprite != null)
            this.container.removeChild(this.imageSprite);

        let imageAlias = objectName.replace(/\s/g, '');
        this.imageSprite = new PIXI.Sprite(PIXI.Assets.get(imageAlias));
        this.imageSprite.anchor = 0.5;

        this.container.addChild(this.imageSprite);
    }

}