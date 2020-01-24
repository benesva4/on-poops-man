import express from 'express'
import cors from 'cors'
import http from 'http'
import sockets from 'socket.io'
import GameEngine from './GameEngine.js'

// Initialize the server
const app = express()
app.use(cors())
const server = http.createServer(app)
const io = sockets(server)

// Initialize the game
const game = GameEngine()

io.on('connection', socket => {
  console.log('New player has joined the game.')

  game.createPlayer(socket.id)

  socket.on('move', movement => {
    const currentPlayer = game.getPlayer(socket.id)

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
    const players = game.getPlayers()
    delete players[socket.id]
    console.log('A player has disconnected.')
  })

  socket.on('vector', vector => {
    const currentPlayer = game.getPlayer(socket.id)

    currentPlayer.position.vector = vector
  })

  socket.on('shoot', bullet => {
    game.createBullet(socket.id)
  })
})

setInterval(() => {
  game.updateBullets()
  io.sockets.emit('gameState', game.getState())
}, 1000 / 60)

server.listen(3001, function() {
  console.log('listening on http://localhost:3001')
})
