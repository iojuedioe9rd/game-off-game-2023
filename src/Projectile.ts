import { isUndefined } from "lodash"
import Enemy from "./Enemy"


export default class Projectile {
    speed: number = 5
    power: number = 20
    ctx: CanvasRenderingContext2D
    pos: vec2
    cellSize: number

    constructor(ctx: CanvasRenderingContext2D, pos: vec2, cellSize: number) {
        this.ctx = ctx
        this.pos = pos
        this.cellSize = cellSize
    }

    async update(enemies: Enemy[]): Promise<void> {

        function DistSquared(pt1: vec2, pt2: vec2) {
            var diffX = pt1.x - pt2.x;
            var diffY = pt1.y - pt2.y;
            return (diffX*diffX+diffY*diffY);
        }

        function GetCentre(pos: vec2, cellSize: number)
        {
            return {
                x: pos.x + cellSize / 2,
                y: pos.y + cellSize / 2
            }
        }

        if(isUndefined (enemies[0])) return
        var closest: Enemy = enemies[0]
        var shortestDistance = DistSquared(this.pos, enemies[0].pos)

        for (let i = 0; i < enemies.length; i++) {
            var d = DistSquared(this.pos, enemies[i].pos)
            if (d < shortestDistance)
            {
                closest = enemies[i]
                shortestDistance = d
            }
            
        }

        const yDis = GetCentre(closest.pos, this.cellSize / 10).y - GetCentre(this.pos, this.cellSize / 10).y
        const xDis = GetCentre(closest.pos, this.cellSize / 10).x - GetCentre(this.pos, this.cellSize / 10).x
        const angle = Math.atan2(yDis, xDis)
        
        this.pos.x += Math.cos(angle) * this.speed
        this.pos.y += Math.sin(angle) * this.speed
        
    }

    async draw(): Promise<void> {
        this.ctx.fillStyle = "black"
        this.ctx.beginPath()
        this.ctx.arc(this.pos.x, this.pos.y, this.cellSize / 10, 0, Math.PI * 2)
        this.ctx.fill()
    }
}