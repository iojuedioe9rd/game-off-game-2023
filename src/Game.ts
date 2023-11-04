import Cell from "./Cell"

export default class Game {
    ctx: CanvasRenderingContext2D
    cellSize = 100
    cellGap = 3
    gameGrid: Cell[]
    controlsBar: size
    constructor(ctx: CanvasRenderingContext2D)
    {
        this.controlsBar = {
            width: ctx.canvas.width,
            height: this.cellSize
        }
        this.ctx = ctx
        this.gameGrid = []
        this.createGrid()
    }

    Init()
    {
     
        
        
    }

    private async createGrid() {
        for (var y = this.cellSize; y < this.ctx.canvas.height; y += this.cellSize) {
            for (var x = this.cellSize; x < this.ctx.canvas.width; x += this.cellSize) {
                this.gameGrid.push(new Cell(this.ctx, {x,y}, this.cellSize)) 
            }
            
        }
    }

    private async handleGameGrid({isUpdate = false, isDraw = false})
    {
        for (let index = 0; index < this.gameGrid.length; index++) {
            if(isUpdate) await this.gameGrid[index].update()
            if(isDraw) await this.gameGrid[index].draw()
            
        }
    }

    async Update()
    {
        await this.handleGameGrid({isUpdate: true})
    }



    async Draw()
    {
        await this.handleGameGrid({isDraw: true})

        // draw controls bar
        this.ctx.fillStyle = "blue"
        this.ctx.fillRect(0, 0, this.controlsBar.width, this.controlsBar.height);
    }
}