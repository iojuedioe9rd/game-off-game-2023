import {useRef, useCallback} from 'react'
import { useDeepCompareEffect, useLocalStorage } from 'cats-react-hooks'
import "./App.scss"
import Game from './Game'
import { isNull } from 'lodash'

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameData, setGameData] = useLocalStorage<any>("gameData", undefined)



  var GetGameData = useCallback(async () => {return gameData}, [gameData])
  
    
  

  useDeepCompareEffect(() => {
    if(!isNull( canvasRef.current))
    {
        const ctx = canvasRef.current.getContext("2d")

        if(!isNull(ctx))
        {
            var game = new Game(ctx, GetGameData, setGameData)

            game.Init()

            async function loop()
            {
                await game.Update()
                await game.Draw()
                if (!game.gameOver) id = requestAnimationFrame(loop)
            }
            var id = requestAnimationFrame(loop)
            setGameData("123")

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
