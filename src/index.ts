import * as PIXI from 'pixi.js'
import { Game } from './Game';
import { UI } from './UI';

const app = new PIXI.Application();

class Startup {
    constructor() {
        this.Init();
    }

    private async Init() : Promise<any> {  

        await app.init({
            width: screen.width,
            height: screen.height,
            backgroundColor: 0x000000,
            canvas: document.getElementById('game-canvas') as HTMLCanvasElement,
        });

        await PIXI.Assets.init({manifest: "assetBundles/manifest.json"});
       
        const game: Game = new Game(app);
        game.LoadGameAssets();

        const ui: UI = new UI(app);
        ui.LoadUIAssets();

        app.ticker.add((_delta) => {
            game.Update(_delta.elapsedMS/1000)
            ui.Update(_delta.elapsedMS/1000)
        })

        window.addEventListener('resize', () => {
            game.OnWindowResize();
            ui.OnWindowResize();
        });
    }
}

const startup = new Startup()

 