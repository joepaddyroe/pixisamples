"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PIXI = require("pixi.js");
var app = new PIXI.Application({
    width: 800,
    height: 600,
    backgroundColor: 0x1099bb,
    view: document.getElementById('game-canvas'),
});
PIXI.Assets.load(['../images/vader.jpeg'], function () {
    var myTexture = PIXI.Texture.from('../images/vader.jpeg');
    var mySprite = new PIXI.Sprite(myTexture);
    mySprite.anchor.set(0.5);
    mySprite.x = app.screen.width / 2;
    mySprite.y = app.screen.height / 2;
    app.stage.addChild(mySprite);
    app.ticker.add(function (_delta) {
        mySprite.rotation += 0.05;
    });
});
