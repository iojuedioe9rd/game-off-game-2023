import { isEqual } from "lodash"
import Cell from "./Cell"
import bgUrl from "./assets/indev.png"
import Defender from "./Defender"
import {Dispatch} from "react"
export default class Game {
    ctx: CanvasRenderingContext2D
    cellSize = 80
    cellGap = 3
    gameGrid: Cell[]
    controlsBar: size
    mouse: mouseData
    canvasPos: DOMRect
    bg: HTMLImageElement
    defenders: Defender[]
    defenderCost = 100
    numberOfResources = 300
    getGameData: () => Promise<any>
    setGameData: Dispatch<any>
    
    constructor(ctx: CanvasRenderingContext2D, getGameData: () => Promise<any>, setGameData: Dispatch<any>)
    {
        this.getGameData = getGameData
        this.setGameData = setGameData
        setGameData("123")
        this.defenders = []
        this.bg = new Image()
        this.bg.src = bgUrl
        this.controlsBar = {
            width: ctx.canvas.width,
            height: this.cellSize
        }
        this.canvasPos = ctx.canvas.getBoundingClientRect()
        ctx.canvas.addEventListener("mousemove", e => {
            this.mouse.x = e.x - this.canvasPos.x
            this.mouse.y = e.y - this.canvasPos.y
        })

        ctx.canvas.addEventListener("click", () => {
            const gridPosX = (this.mouse.x as number) - ((this.mouse.x as number) % this.cellSize)
            const gridPosY = (this.mouse.y as number) - ((this.mouse.y as number) % this.cellSize)

            if (gridPosY < this.cellSize) return

            for (let i = 0; i < this.defenders.length; i++) {
                if(this.defenders[i].pos.x === gridPosX && this.defenders[i].pos.y === gridPosY) return;
                
                
            }

            var defenderCost = 100
            if(this.numberOfResources >= defenderCost)
            {
                this.defenders.push(new Defender(ctx, {x: gridPosX, y: gridPosY}, this.cellSize))
                this.numberOfResources -= defenderCost
            }
        })
        

        
        
        
        ctx.canvas.addEventListener("mouseleave", () => {
            this.mouse.x = undefined
            this.mouse.y = undefined
        })
        this.mouse = {
            x: undefined,
            y: undefined,
            width: 0.1,
            height: 0.1
        }
        this.ctx = ctx
        this.gameGrid = []
        this.createGrid()
    }

    private async handleGameStatus() {
        this.ctx.fillStyle = "gold"
        this.ctx.font = "30px Arial"
        this.ctx.fillText(`Resources: ${this.numberOfResources.toString()}`, 20, 55)
    }

    Init()
    {
     console.trace(this.canvasPos)
        
        
    }

    private async createGrid() {
        console.log(this.getGameData())

        for (var y = this.cellSize; y < this.ctx.canvas.height; y += this.cellSize) {
            for (var x = this.cellSize; x < this.ctx.canvas.width; x += this.cellSize) {
                this.gameGrid.push(new Cell(this.ctx, {x,y}, this.cellSize, async () => {
                    return this.mouse
                })) 
            }
            
        }
    }

    private async handleDefenders({isUpdate = false, isDraw = false})
    {
        for (let index = 0; index < this.defenders.length; index++) {
            if(isUpdate) await this.defenders[index].update()
            if(isDraw) await this.defenders[index].draw()
            
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
        console.log(await this.getGameData())
        if(!isEqual(this.canvasPos.toJSON(), this.ctx.canvas.getBoundingClientRect().toJSON()))
        {
            this.canvasPos = this.ctx.canvas.getBoundingClientRect()
            
        }
        
            
        

        await this.handleGameGrid({isUpdate: true})
        await this.handleDefenders({isUpdate: true})
    }



    async Draw()
    {
        this.ctx.clearRect(0,0, this.ctx.canvas.width, this.ctx.canvas.height)
        this.ctx.drawImage(this.bg, 0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
        await this.handleGameGrid({isDraw: true})
        await this.handleDefenders({isDraw: true})


        // draw controls bar
         this.ctx.fillStyle = "blue"
         await this.ctx.fillRect(0, 0, this.controlsBar.width, this.controlsBar.height);

        await this.handleGameStatus()
    }
}
