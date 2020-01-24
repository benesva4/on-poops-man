import React from 'react'
import { useGameEngine } from './GameEngine'
import './App.css'
import styled from 'styled-components'

const playgroundWidth = 800
const playgroundHeight = 600

const playerWidth = 100
const playerHeight = 20

const Playground = styled.div`
  width: ${playgroundWidth}px;
  height: ${playgroundHeight}px;
  border: 1px solid black;
  position: relative;
  cursor: crosshair;
`

const Player = styled.div`
  background: linear-gradient(to left, white, red);
  position: absolute;
  top: 0;
  left: 0;
  width: ${playerWidth}px;
  height: ${playerHeight}px;
`

const Bullet = styled.div`
  background: #39ff14;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;
  width: 10px;
  height: 10px;
`

const stylePlayerPosition = (x, y, vector) => {
  const diffX = vector[0]
  const diffY = vector[1]
  const tan = diffY / diffX
  let angle = Math.atan(tan) / (Math.PI / 0.5)

  if (diffX < 0 && diffY > 0) {
    angle = angle - 0.5 // + 0.25 turn
  }
  if (diffX < 0 && diffY < 0) {
    angle = angle + 0.5
  }

  return {
    transform: `translateX(${x}px) translateY(${y}px) rotate(${angle}turn)`,
  }
}

const styleBulletPosition = (x, y, angle) => ({
  transform: `translateX(${x}px) translateY(${y}px)`,
})

function App() {
  const [gameState, gameHandlers] = useGameEngine()
  if (!gameState) return <div>Loading, please hold on</div>

  return (
    <Playground
      tabIndex={1}
      onKeyUp={gameHandlers.onKeyUp}
      onKeyDown={gameHandlers.onKeyDown}
      onMouseMove={gameHandlers.onMouseMove}
      onClick={gameHandlers.shoot}
    >
      {Object.values(gameState.players).map(({ position }, index) => {
        const { x, y, vector } = position

        return <Player key={index} style={stylePlayerPosition(x, y, vector)} />
      })}
      {Object.values(gameState.bullets).map(({ position }, index) => {
        const { x, y } = position

        return <Bullet key={index} style={styleBulletPosition(x, y)} />
      })}
    </Playground>
  )
}

export default App
