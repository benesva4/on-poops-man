import express from 'express'
import cors from 'cors'
import http from 'http'
import sockets from 'socket.io'

const app = express()

app.use(cors())

const server = http.createServer(app)
const io = sockets(server)

const players = {}
const randomCoord = max => Math.floor(Math.random() * max)
const newPlayer = () => ({
  health: 100,
  position: { x: randomCoord(800), y: randomCoord(600), angle: 0 },
})

io.on('connection', socket => {
  console.log('New player has joined the game.')

  players[socket.id] = newPlayer()

  socket.on('move', movement => {
    const currentPlayer = players[socket.id]

    if (movement.up) {
      currentPlayer.position.y -= 3
    }
    if (movement.right) {
      currentPlayer.position.x += 3
    }
    if (movement.down) {
      currentPlayer.position.y += 3
    }
    if (movement.left) {
      currentPlayer.position.x -= 3
    }
  })

  socket.on('disconnect', function() {
    delete players[socket.id]
    console.log('A player got disconnected.')
  })

  socket.on('angle', angle => {
    const currentPlayer = players[socket.id]

    if (currentPlayer && currentPlayer.position)
      currentPlayer.position.angle = angle
  })
})

setInterval(() => io.sockets.emit('gameState', players), 1000 / 60)

server.listen(3001, function() {
  console.log('listening on http://localhost:3001')
})
