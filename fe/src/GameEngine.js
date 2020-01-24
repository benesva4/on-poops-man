/* eslint-disable default-case */
import { useState, useEffect } from 'react'
import io from 'socket.io-client'
import useInterval from './intervalHook'

// Creates the socket connection
const socket = io('http://localhost:3001')

export const useGameEngine = () => {
  // Initializes the game's state
  const [gameState, setGameState] = useState()
  const [cursorPosition, setCursorPosition] = useState([0, 0])
  const [movement, setMovement] = useState({
    up: false,
    right: false,
    down: false,
    left: false,
  })

  // Set up a gameState socket listener
  useEffect(() => {
    socket.on('gameState', gameState => {
      setGameState(gameState)
    })
  }, [])

  // Run the game loop
  useInterval(() => {
    socket.emit('move', movement)
    socket.emit('vector', getVector())
  }, 1000 / 60)

  // Define the key down event handler
  const onKeyDown = event => {
    switch (event.key) {
      case 'w':
        setMovement({ ...movement, up: true })
        break
      case 'd':
        setMovement({ ...movement, right: true })
        break
      case 's':
        setMovement({ ...movement, down: true })
        break
      case 'a':
        setMovement({ ...movement, left: true })
        break
    }
  }

  // Define the key up event handler
  const onKeyUp = event => {
    switch (event.key) {
      case 'w':
        setMovement({ ...movement, up: false })
        break
      case 'd':
        setMovement({ ...movement, right: false })
        break
      case 's':
        setMovement({ ...movement, down: false })
        break
      case 'a':
        setMovement({ ...movement, left: false })
        break
    }
  }

  const getVector = () => {
    if (!gameState) return [0, 0]
    const player = gameState.players[socket.id]
    const diffX = cursorPosition[0] - player.position.x
    const diffY = cursorPosition[1] - player.position.y
    const length = Math.sqrt(diffX * diffX + diffY * diffY)
    const dx = diffX / length
    const dy = diffY / length

    return [dx, dy]
  }

  const onMouseMove = ({ clientX, clientY, target }) => {
    const { offsetLeft, offsetTop } = target
    setCursorPosition([
      clientX - offsetLeft - 100 / 2,
      clientY - offsetTop - 20 / 2,
    ])
  }

  const shoot = () => {
    socket.emit('shoot')
  }
  const gameHandlers = {
    onKeyDown,
    onKeyUp,
    onMouseMove,
    shoot,
  }

  return [gameState, gameHandlers]
}
