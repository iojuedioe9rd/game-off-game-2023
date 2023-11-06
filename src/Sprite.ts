export default class Sprite {
  pos: vec2
  image: HTMLImageElement
  ctx: CanvasRenderingContext2D
  size: vec2
  constructor(ctx: CanvasRenderingContext2D, {position = { x: 0, y: 0 },
        imageSrc,
        size = {x: 100, y: 100}
      }: {position?: vec2, imageSrc: string, frames?: {max: number}, offset?: vec2, size?: vec2})
      {
        this.pos = position
        this.image = new Image()
        this.image.src = imageSrc
        this.size = size
        
      
      this.ctx = ctx
      }

  async updateSprite()
  {
    
  }
  async draw()
  {
    this.ctx.drawImage(this.image, this.pos.x, this.pos.y, this.size.x, this.size.y)
  }


}