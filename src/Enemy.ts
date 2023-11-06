import HealthSystem from "./HealthSystem"
import Sprite from "./Sprite"
import mouse from "./assets/mouse.png"

export default class Enemy extends Sprite {
    pos: vec2
    ctx: CanvasRenderingContext2D
    speed: number
    cellSize: number
    healthSys: HealthSystem
    movement: number

    constructor(ctx: CanvasRenderingContext2D, verticalPos: number, cellSize: number)
    {
        super(ctx, {position: {x: ctx.canvas.width, y: verticalPos}, imageSrc: mouse, size: {x: cellSize, y: cellSize}})
        this.pos = {x: ctx.canvas.width, y: verticalPos}
        this.ctx = ctx
        this.speed = Math.random() * 0.2 + 0.4
        this.cellSize = cellSize
        this.healthSys = new HealthSystem(100, {})
        this.movement = this.speed
    }

    private HealthSystemCall(_old: number, newH: number)
    {
        if(this.healthSys)
        {
            this.size = {x: this.cellSize * (newH / this.healthSys.MaxHealth * this.speed), y: this.cellSize * (newH / this.healthSys.MaxHealth * this.speed)}
        }
        
    }

    async update()
    {
        await super.updateSprite()
        this.pos.x -= this.movement
    }

    async draw()
    {
        await super.draw()   
        this.ctx.fillStyle = "black"
        this.ctx.font = "20px Orbitron"
        this.ctx.fillText(Math.floor(this.healthSys.Health).toString(), this.pos.x + 15, this.pos.y + 30)
    }
}