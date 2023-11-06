import HealthSystem from "./HealthSystem"
import Projectile from "./Projectile"
import Sprite from "./Sprite"
import cat1 from "./assets/cat1.png"

export default class Defender extends Sprite  {
    ctx: CanvasRenderingContext2D
    cellSize: number
    healthSystem: HealthSystem
    shooting: boolean
    timer: number
    died: boolean = false
    getProjectiles: () => Promise<Projectile[]>
    setProjectiles: (newProjectiles: Projectile[]) => Promise<void>
    constructor(ctx: CanvasRenderingContext2D, {x,y}: vec2, cellSize: number, getProjectiles: () => Promise<Projectile[]>, setProjectiles: (newProjectiles: Projectile[]) => Promise<void>)
    {
        super(ctx, {
            position: {x,y},
            imageSrc: cat1,
            size: {x: cellSize, y: cellSize}

        })
        this.pos = {x,y}
        this.ctx = ctx
        this.cellSize = cellSize
        this.shooting = false
        this.timer = 0
        this.healthSystem  = new HealthSystem(100, {onDied: this.onDied})
        console.log(this)
        this.getProjectiles = getProjectiles
        this.setProjectiles = setProjectiles
    }

    private onDied ()
    {
        this.died = true
    }

    async update()
    {
        await super.updateSprite()
        this.timer++
        if(this.timer % 100 === 0)
        {
            var projectiles = await this.getProjectiles()
            projectiles.push(new Projectile(this.ctx, {x: this.pos.x + this.cellSize / 2, y: this.pos.y + this.cellSize / 2}, this.cellSize))
            await this.setProjectiles(projectiles)
        }
    }

    async draw()
    {
        await super.draw()
        this.ctx.fillStyle = "gold"
        this.ctx.font = "20px Orbitron"
        this.ctx.fillText(Math.floor(this.healthSystem.Health).toString(), this.pos.x + 15, this.pos.y + 30)
    }
}