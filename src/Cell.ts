import { isUndefined } from "lodash"
import collision from "./collision"


export default class Cell {
    pos: vec2
    ctx: CanvasRenderingContext2D
    cellSize: number
    getM: () => Promise<mouseData>
    doDraw = false
    constructor(ctx: CanvasRenderingContext2D, {x, y}: vec2, cellSize: number, getM: () => Promise<mouseData>)
    {
        this.ctx = ctx
        this.cellSize = cellSize
        this.pos = {x, y}
        this.getM = getM
    }

    async update()
    {
        var mouse = await this.getM()

        var rect: rect = {
            x: this.pos.x,
            y: this.pos.y,
            width: this.cellSize,
            height: this.cellSize
        }
        if(!isUndefined(mouse.x) && !isUndefined(mouse.y))
        {
            if(collision(rect, mouse as any))
            {
                this.doDraw = true
            }
        }
        
        
    }

    async draw()
    {
        if(this.doDraw)
        {
            this.ctx.strokeStyle = "black"
        this.ctx.strokeRect(this.pos.x, this.pos.y, this.cellSize, this.cellSize)
        }
        this.doDraw = false
        
    }


}