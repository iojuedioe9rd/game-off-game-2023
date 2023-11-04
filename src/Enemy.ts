export default class Enemy {
    pos: vec2
    ctx: CanvasRenderingContext2D
    speed: number
    cellSize: number
    constructor(ctx: CanvasRenderingContext2D, verticalPos: number, cellSize: number)
    {
        this.pos = {x: ctx.canvas.width, y: verticalPos}
        this.ctx = ctx
        this.speed = Math.random() * 0.2 + 0.4
        this.cellSize = cellSize
    }

    async update()
    {

    }

    async draw()
    {
        
    }
}