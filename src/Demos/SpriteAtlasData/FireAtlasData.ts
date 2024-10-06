export class FireAtlasData{

    public static AtlasData = {
        frames: {
            flame1: {
                frame: { x: 0, y:0, w:128, h:128 },
                sourceSize: { w: 256, h: 256 },
                spriteSourceSize: { x: 0, y: 0, w: 256, h: 256 }
            },
            flame2: {
                frame: { x: 128, y:0, w:128, h:128 },
                sourceSize: { w: 256, h: 256 },
                spriteSourceSize: { x: 0, y: 0, w: 256, h: 256 }
            },
            flame3: {
                frame: { x: 256, y:0, w:128, h:128 },
                sourceSize: { w: 256, h: 256 },
                spriteSourceSize: { x: 0, y: 0, w: 256, h: 256 }
            },
            flame4: {
                frame: { x: 384, y:0, w:128, h:128 },
                sourceSize: { w: 256, h: 256 },
                spriteSourceSize: { x: 0, y: 0, w: 256, h: 256 }
            },
            flame5: {
                frame: { x: 0, y:128, w:128, h:128 },
                sourceSize: { w: 256, h: 256 },
                spriteSourceSize: { x: 0, y: 0, w: 256, h: 256 }
            },
            flame6: {
                frame: { x: 128, y:128, w:128, h:128 },
                sourceSize: { w: 256, h: 256 },
                spriteSourceSize: { x: 0, y: 0, w: 256, h: 256 }
            },
            flame7: {
                frame: { x: 256, y:128, w:128, h:128 },
                sourceSize: { w: 256, h: 256 },
                spriteSourceSize: { x: 0, y: 0, w: 256, h: 256 }
            },
            flame8: {
                frame: { x: 384, y:128, w:128, h:128 },
                sourceSize: { w: 256, h: 256 },
                spriteSourceSize: { x: 0, y: 0, w: 256, h: 256 }
            },
        },
        meta: {
            image: 'images/flame2.png',
            format: 'RGBA8888',
            size: { w: 256, h: 256 },
            scale: 1
        },
        animations: {
            fire: ['flame1','flame2','flame3','flame4','flame5','flame6','flame7','flame8']
        }
    }
}

