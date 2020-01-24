/* eslint-disable default-case */
import { useState, useEffect } from "react";
import io from "socket.io-client";
import useInterval from "./intervalHook";

// Creates the socket connection
const socket = io("http://192.168.1.147:3001");

export const useGameEngine = () => {
  // Initializes the game's state
  const [gameState, setGameState] = useState();
  const [cursorPosition, setCursorPosition] = useState([0, 0]);
  const [movement, setMovement] = useState({
    up: false,
    right: false,
    down: false,
    left: false
  });

  // Set up a gameState socket listener
  useEffect(() => {
    socket.on("gameState", gameState => {
      setGameState(gameState);
    });
  }, []);

  // Run the game loop
  useInterval(() => {
    socket.emit("move", movement);

    const angle = (() => {
      if (gameState) {
        const diffX = cursorPosition[0] - gameState[socket.id]?.position.x || 0;
        const diffY = cursorPosition[1] - gameState[socket.id]?.position.y || 0;
        const tan = diffY / diffX;
        const angle = Math.atan(tan) / (Math.PI / 0.5);

        if (diffX > 0 && diffY > 0) {
          return angle;
        }
        if (diffX < 0 && diffY > 0) {
          return angle - 0.5; // + 0.25 turn
        }
        if (diffX < 0 && diffY < 0) {
          return angle + 0.5;
        }
        return angle;
      }
    })();

    socket.emit("angle", angle);
  }, 1000 / 60);

  // Define the key down event handler
  const onKeyDown = event => {
    switch (event.key) {
      case "w":
        setMovement({ ...movement, up: true });
        break;
      case "d":
        setMovement({ ...movement, right: true });
        break;
      case "s":
        setMovement({ ...movement, down: true });
        break;
      case "a":
        setMovement({ ...movement, left: true });
        break;
    }
  };

  // Define the key up event handler
  const onKeyUp = event => {
    switch (event.key) {
      case "w":
        setMovement({ ...movement, up: false });
        break;
      case "d":
        setMovement({ ...movement, right: false });
        break;
      case "s":
        setMovement({ ...movement, down: false });
        break;
      case "a":
        setMovement({ ...movement, left: false });
        break;
    }
  };

  const onMouseMove = ({ clientX, clientY }) => {
    setCursorPosition([clientX, clientY]);
  };

  const gameHandlers = {
    onKeyDown,
    onKeyUp,
    onMouseMove
  };

  return [gameState, gameHandlers];
};
