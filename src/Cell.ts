export default class Cell {
    pos: vec2
    ctx: CanvasRenderingContext2D
    cellSize: number
    constructor(ctx: CanvasRenderingContext2D, {x, y}: vec2, cellSize: number)
    {
        this.ctx = ctx
        this.cellSize = cellSize
        this.pos = {x, y}
    }

    async update()
    {

    }

    async draw()
    {
        this.ctx.strokeStyle = "black"
        this.ctx.strokeRect(this.pos.x, this.pos.y, this.cellSize, this.cellSize)
    }


}