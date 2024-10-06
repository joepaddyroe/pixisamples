import * as PIXI from 'pixi.js'
import { Helpers, Vector2 } from '../Helpers';
import { CardAtlasData } from './SpriteAtlasData/CardAtlasData';

export class TextAndImageTool {

    private container: PIXI.Container;
    //private cards: CardSpriteSheet[] = [];

    // demo specific
    private doRandomSwapTimer: number = 0;
    private randomSwapDuration: number = 2; // how long it takes to move a card

    public Container(): PIXI.Container {
        return this.container;
    }

    constructor() {
        this.container = new PIXI.Container();
        this.container.pivot = 0.5;
    }

}