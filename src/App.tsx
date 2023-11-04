import {useRef} from 'react'
import { useDeepCompareEffect } from 'cats-react-hooks'
import "./App.scss"
import Game from './Game'
import { isNull } from 'lodash'

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useDeepCompareEffect(() => {
    if(!isNull( canvasRef.current))
    {
        const ctx = canvasRef.current.getContext("2d")

        if(!isNull(ctx))
        {
            var game = new Game(ctx)

            game.Init()

            async function loop()
            {
                await game.Update()
                await game.Draw()
                id = requestAnimationFrame(loop)
            }
            var id = requestAnimationFrame(loop)

            return () => {
                cancelAnimationFrame(id)
            }
        }
    }
  }, [canvasRef])
  return (
    <div className='app'>
      <div className='game-con'>
        <main>
            <canvas ref={canvasRef} className='game-canvas' width={900} height={600}></canvas>
        </main>
      </div>
    </div>
  )
}
