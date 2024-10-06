import * as PIXI from 'pixi.js'
import { Helpers, Vector2 } from '../Helpers';
import { FireAtlasData } from './SpriteAtlasData/FireAtlasData';

export class ParticleSystem {

    private container: PIXI.Container;
    private particles: ParticleSpriteSheet[] = [];
    private particleSpriteSheet!: PIXI.Spritesheet;
    private maxParticles: number = 10;
    private playbackSpeed: number = 0.8;
    private speedMin: number = 290;
    private speedMax: number = 420;
    private scaleMin: number = 0.8;
    private scaleMax: number = 1;
    private xWobble: number = 20;
    private duration: number = 0.5;
    private directionVector: Vector2 = new Vector2();
    private rotationSpeed: number = 0;

    public Container(): PIXI.Container {
        return this.container;
    }

    constructor() {
        this.container = new PIXI.Container()
        this.container.sortableChildren = true;        
        this.directionVector = new Vector2(0, -1);
        this.BuildSpriteData();
    }


    private async BuildSpriteData(): Promise<any> {

        const atlasData = FireAtlasData.AtlasData;

        const spritesheet = new PIXI.Spritesheet(
            PIXI.Texture.from(atlasData.meta.image),
            atlasData
        );

        // Generate all the Textures asynchronously
        await spritesheet.parse();

        this.particleSpriteSheet = spritesheet;

        this.AddParticleSpriteSheets();
    }

    private AddParticleSpriteSheets(): void {
        for(let i: number = 0; i < this.maxParticles; i++) {
            this.particles.push(new ParticleSpriteSheet(this, this.container, this.particleSpriteSheet))
            this.particles[i].SetStartTimeOffset((this.duration/this.maxParticles) * i)
        }
    }

    public Update(delta: number): void {
        for(let i: number = 0; i < this.maxParticles; i++) {
            this.particles[i].Update(delta);
        }
    }

    public MaxParticles(): number {
        return this.maxParticles;
    }

    public PlaybackSpeed(): number {
        return this.playbackSpeed;
    }

    public SpeedMin(): number {
        return this.speedMin;
    }

    public SpeedMax(): number {
        return this.speedMax;
    }

    public ScaleMin(): number {
        return this.scaleMin;
    }

    public ScaleMax(): number {
        return this.scaleMax;
    }

    public XWobble(): number {
        return this.xWobble;
    }

    public Duration(): number {
        return this.duration;
    }

    public DirectionVector(): Vector2 {
        return this.directionVector;
    }

    public RotationSpeed(): number {
        return this.rotationSpeed;
    }
}

export class ParticleSpriteSheet {

    private container: PIXI.Container;
    private particleSystem: ParticleSystem;
    private animation: PIXI.AnimatedSprite;
    private currentTElapse: number = 0;
    private startPosition: Vector2 = new Vector2();

    private speed: number = 0;
    private scale: number = 0;
    private xOffset: number = 0;
    private yOffset: number = 0;
    private rotationDirection: number = 1;

    constructor(parentSystem: ParticleSystem, container: PIXI.Container, spriteSheet: PIXI.Spritesheet) {

        this.container = new PIXI.Container();
        this.particleSystem = parentSystem;

        // spritesheet is ready to use!
        this.animation = new PIXI.AnimatedSprite(spriteSheet.animations.fire);
      
        this.animation.alpha = 0;
        this.animation.blendMode = "add";
        //this.animation.tint = "0xf1f40f"     
        this.animation.height = 512;
        this.animation.width = 512;
        // set the animation speed
        //this.animation.animationSpeed = 0.1666;
        //this.animation.play();
        
        // add it to the stage to render
        this.container.addChild(this.animation);      
        this.animation.pivot.set(this.container.x+64, this.container.y+64)        
        container.addChild(this.container);
        this.container.pivot.set(container.x, container.y)

        this.SetRandomSpeed();
        this.SetRandomScale();
        this.SetRandomAnimationFrame();
        this.SetRandomXOffset();
    }

    public SetStartTimeOffset(offset: number): void {
        this.currentTElapse -= offset;
    }

    public SetRandomSpeed(): void {        
        this.speed = Math.random() * (this.particleSystem.SpeedMax() - this.particleSystem.SpeedMin()) + this.particleSystem.SpeedMin();
    }

    public SetRandomScale(): void {
        
        this.scale = Math.random() * (this.particleSystem.ScaleMax() - this.particleSystem.ScaleMin()) + this.particleSystem.ScaleMin();
    }

    public SetRandomXOffset(): void {
        this.xOffset = (Math.random() * this.particleSystem.XWobble()) - this.particleSystem.XWobble();
        this.xOffset *= (Math.floor(Math.random() * 2) + 1) == 1 ? 1 : -1;
    }

    public SetRandomAnimationFrame(): void {
        this.animation.currentFrame = (Math.floor(Math.random() * 8) + 1) - 1
    }

    public ResetAlpha(): void {
        this.animation.alpha = 0;
    }

    public ResetZIndex(): void {
        this.container.zIndex = 1;
    }

    public ResetPosition(): void {
        this.SetPosition(this.startPosition);
    }

    public SetPosition(position: Vector2): void {
        this.container.position.set(position.X, position.Y);
    }

    public SetRandomRotationDirection(): void {
        this.rotationDirection = (Math.floor(Math.random() * 2) + 1) == 1 ? 1 : -1;
    }

    public GetPosition(): Vector2 {
        return new Vector2(this.container.position.x, this.container.position.y);
    }

    private Reset(): void {
        this.currentTElapse = 0;
        this.SetRandomSpeed();
        this.SetRandomScale();
        this.ResetAlpha();
        this.ResetPosition();
        this.SetRandomAnimationFrame();
        this.SetRandomXOffset();
        this.ResetZIndex();
        this.SetRandomRotationDirection();
    }

    

    public Update(delta: number): void {

        delta *= this.particleSystem.PlaybackSpeed()

        this.currentTElapse += delta;

        if(this.currentTElapse < 0) {
            return;
        }

        const maxParticles = this.particleSystem.MaxParticles();
        const duration = this.particleSystem.Duration();
        const rotationSpeed = this.particleSystem.RotationSpeed();

        if(this.currentTElapse >= duration) {
            this.Reset()
        }

        const progress = Helpers.ClampNumber(this.currentTElapse / duration, 0, 1);
        
        let targetPosition: Vector2 = this.GetPosition()
        const velocity: Vector2 = new Vector2(
            this.particleSystem.DirectionVector().X * (this.speed * delta),
            this.particleSystem.DirectionVector().Y * (this.speed * delta),
        );
        targetPosition = targetPosition.Add(velocity)
        targetPosition.X = this.xOffset * Math.sin(progress * 3)
        this.SetPosition(targetPosition);

        this.container.angle += delta * rotationSpeed * this.rotationDirection;

        //this.container.scale = this.scale * Math.sin(progress * 3)
        this.container.scale = this.scale * Math.cos(progress)
        //this.container.scale = this.scale - (progress > 0.5 ? (this.scale * progress) : 0)

        this.animation.alpha = Math.sin(progress * 3) * 0.75
        this.animation.tint = Helpers.ColourBlender("#ff1200", "#ffc000", progress);

        //this.container.zIndex = maxParticles - (progress * maxParticles);

        //this.animation.height = 512 + (256 * progress);
        this.animation.width = 512 - (256 * progress);

        // let animIndex = Math.floor((progress*10) * (0.8));
        // this.animation.currentFrame = animIndex;
    }

}

