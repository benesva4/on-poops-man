const initialize = () => {
  // Game state
  const state = {
    players: {},
    bullets: [],
  }

  // Helper functions
  const randomCoord = max => Math.floor(Math.random() * max)

  const createPlayer = id => {
    state.players[id] = {
      health: 100,
      position: { x: randomCoord(800), y: randomCoord(600), vector: [0, 0] },
    }
  }

  const createBullet = playerId => {
    const currentPlayer = state.players[playerId]
    const { x, y, vector } = currentPlayer.position

    state.bullets = [
      ...state.bullets,
      {
        position: { ...currentPlayer.position },
      },
    ]
  }

  const updateBullets = () => {
    state.bullets.map(({ position }) => {
      position.x = position.x + position.vector[0] * 6
      position.y = position.y + position.vector[1] * 6
    })

    state.bullets = state.bullets.filter(
      ({ position }) =>
        position.x > 0 &&
        position.y > 0 &&
        position.x < 800 &&
        position.y < 600,
    )
  }

  const getPlayer = id => state.players[id]
  const getPlayers = () => state.players
  const getState = () => state

  return {
    createPlayer,
    getPlayer,
    getPlayers,
    getState,
    createBullet,
    updateBullets,
  }
}

export default initialize
