import { isEqual } from "lodash"
import Cell from "./Cell"
import bgUrl from "./assets/indev.png"
import Defender from "./Defender"
import {Dispatch} from "react"
import Enemy from "./Enemy"
import noob from "./assets/noob.wav"
import collision from "./collision"
import Projectile from "./Projectile"
export default class Game {
    ctx: CanvasRenderingContext2D
    cellSize = 100
    cellGap = 3
    gameGrid: Cell[]
    controlsBar: size
    enemies: Enemy[] = []
    mouse: mouseData
    canvasPos: DOMRect
    bg: HTMLImageElement
    projectiles: Projectile[] = []
    defenders: Defender[]
    defenderCost = 100
    numberOfResources = 300
    getGameData: () => Promise<any>
    setGameData: Dispatch<any>
    frame: number = 0
    enemiesInterval = 600
    gameOver = !!false
    gameOverWav: HTMLAudioElement
    
    constructor(ctx: CanvasRenderingContext2D, getGameData: () => Promise<any>, setGameData: Dispatch<any>)
    {
        this.getGameData = getGameData
        this.setGameData = setGameData
        setGameData("123")
        this.defenders = []
        this.bg = new Image()
        this.gameOverWav = new Audio(noob)
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
                this.defenders.push(new Defender(ctx, {x: gridPosX, y: gridPosY}, this.cellSize, async () => {return this.projectiles}, async (newProjectiles: Projectile[]) => {this.projectiles = newProjectiles}))
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
        this.ctx.font = "30px Orbitron"
        this.ctx.fillText(`Resources: ${this.numberOfResources.toString()}`, 20, 55)

        if(this.gameOver)
        {
            this.ctx.fillStyle = "black"
            this.ctx.font = "90px Orbitron"
            this.ctx.fillText("GAME OVER", 135, 330)
        }
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


    private async handleProjectiles({isUpdate = false, isDraw = false})
    {
        for (let i = 0; i < this.projectiles.length; i++) {
            if(isUpdate) await this.projectiles[i].update(this.enemies)
            if(isDraw) await this.projectiles[i].draw()

            if(isUpdate)
            {
                for (var j = 0; j < this.enemies.length; j++) {
                    if(this.enemies[j] && this.projectiles[i])
                    {
                        var enemyRect: rect = {
                            x: this.enemies[j].pos.x,
                            y: this.enemies[j].pos.y,
                            width: this.cellSize,
                            height: this.cellSize
                        }

                        var projectileRect: rect = {
                            x: this.projectiles[i].pos.x,
                            y: this.projectiles[i].pos.y,
                            width: this.cellSize / 10,
                            height: this.cellSize / 10,
                        }

                        if(collision(projectileRect, enemyRect))
                        {
                            this.enemies[j].healthSys.Damage(this.projectiles[i].power)
                            this.projectiles = this.projectiles.splice(i, 1);
                            i--;
                        }
                    }
                    
                }

                if (this.projectiles[i] && this.projectiles[i].pos.x > this.canvasPos.width - this.cellSize)
                {
                    this.projectiles.splice(i, 1)
                    i--
                }

                console.log(`projectiles ${this.projectiles.length}`)
            }
            
        }
    }
    private async handleEnemies({isUpdate = false, isDraw = false})
    {
        for (var index = 0; index < this.enemies.length; index++) {
            if(isUpdate) await this.enemies[index].update()
            if(isDraw) await this.enemies[index].draw()
            
            if(this.enemies[index].pos.x < 0)
            {
                this.gameOver = true
                this.gameOverWav.play()
            }
        }

        if(isUpdate)
        {
            if(this.frame % Math.floor(this.enemiesInterval) === 0)
            {
                var verticalPos = Math.floor(Math.random() * 5 + 1) * this.cellSize
                this.enemies.push(new Enemy(this.ctx, verticalPos, this.cellSize))
                if(this.enemiesInterval > 120) this.enemiesInterval -= Math.floor(100 * Math.random())
                console.trace(this.enemiesInterval)
            }
            
        }
    }

    private async handleDefenders({isUpdate = false, isDraw = false})
    {
        for (var i = 0; i < this.defenders.length; i++) {
            if(isUpdate) await this.defenders[i].update()
            if(isDraw) await this.defenders[i].draw()

            for (var j = 0; j < this.enemies.length; j++) {
                try {
                    var defenderRect: rect = {
                        x: this.defenders[i].pos.x,
                        y: this.defenders[i].pos.y,
                        width: this.defenders[i].size.x,
                        height: this.defenders[i].size.y
                    }
    
                    var enemyRect: rect = {
                        x: this.enemies[j].pos.x,
                        y: this.enemies[j].pos.y,
                        width: this.enemies[j].size.x,
                        height: this.enemies[j].size.y
                    }
                    if(this.defenders[i] && collision(defenderRect, enemyRect))
                    {
                        this.enemies[j].movement = 0
                        this.defenders[i].healthSystem.Damage(0.2)
                    }
    
                    if (this.defenders[i] && this.defenders[i].healthSystem.Health <= 0){
                        this.defenders.splice(i, 1);
                        i--;
                        this.enemies[j].movement = this.enemies[j].speed;
                    }
                } catch (error) {
                    console.warn(error)
                    this.gameOver = true
                }
                
                
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
        this.frame++
        console.log(await this.getGameData())
        if(!isEqual(this.canvasPos.toJSON(), this.ctx.canvas.getBoundingClientRect().toJSON()))
        {
            this.canvasPos = this.ctx.canvas.getBoundingClientRect()
            
        }
        
            
        
        await this.handleGameGrid({isUpdate: true})
        await this.handleEnemies({isUpdate: true})
        await this.handleProjectiles({isUpdate: true})
        await this.handleDefenders({isUpdate: true})
    }



    async Draw()
    {
        this.ctx.clearRect(0,0, this.ctx.canvas.width, this.ctx.canvas.height)
        this.ctx.drawImage(this.bg, 0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
        await this.handleGameGrid({isDraw: true})
        await this.handleEnemies({isDraw: true})
        await this.handleProjectiles({isDraw: true})
        await this.handleDefenders({isDraw: true})


        // draw controls bar
         this.ctx.fillStyle = "blue"
         await this.ctx.fillRect(0, 0, this.controlsBar.width, this.controlsBar.height);

         await this.handleGameStatus()
    }
}
