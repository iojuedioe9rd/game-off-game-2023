import HealthSystem from "./HealthSystem"

export default class Defender {
    pos: vec2
    ctx: CanvasRenderingContext2D
    cellSize: number
    healthSystem: HealthSystem = new HealthSystem(100, {})
    shooting: boolean
    projectiles = []
    timer: number
    constructor(ctx: CanvasRenderingContext2D, {x,y}: vec2, cellSize: number)
    {
        this.pos = {x,y}
        this.ctx = ctx
        this.cellSize = cellSize
        this.shooting = false
        this.timer = 0
    }

    async update()
    {

    }

    async draw()
    {
        this.ctx.fillStyle = "blue"
        this.ctx.fillRect(this.pos.x, this.pos.y, this.cellSize, this.cellSize)
        this.ctx.fillStyle = "gold"
        this.ctx.font = "20px Arial"
        this.ctx.fillText(Math.floor(this.healthSystem.Health).toString(), this.pos.x + 15, this.pos.y + 30)
    }
}