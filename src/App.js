import React, { useState, useEffect, useRef } from "react";
// import { useGameEngine } from "./GameEngine";
import "./App.css";
import styled from "styled-components";

const playgroundWidth = 800;
const playgroundHeight = 600;

const playerWidth = 100;
const playerHeight = 20;

const speed = 3;

const Playground = styled.div`
  width: ${playgroundWidth}px;
  height: ${playgroundHeight}px;
  border: 1px solid black;
  position: relative;
  cursor: crosshair;
`;

const Player = styled.div`
  background: linear-gradient(to left, white, red);
  position: absolute;
  top: 0;
  left: 0;
  width: ${playerWidth}px;
  height: ${playerHeight}px;
`;

function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function App() {
  // const [gameState, gameHandlers] = useGameEngine();
  const [playerPosition, setPlayerPosition] = useState([0, 0]);
  const [cursorPosition, setCursorPosition] = useState([0, 0]);
  const [angle, setAngle] = useState(0);
  const [moveLeft, setMoveLeft] = useState(false);
  const [moveRight, setMoveRight] = useState(false);
  const [moveUp, setMoveUp] = useState(false);
  const [moveDown, setMoveDown] = useState(false);

  const checkMove = () => {
    const move = [0, 0];

    if (moveLeft) {
      move[0] = -1;
    }
    if (moveRight) {
      move[0] = 1;
    }
    if (moveUp) {
      move[1] = -1;
    }
    if (moveDown) {
      move[1] = 1;
    }

    const x = move[0] * speed + playerPosition[0];
    const newX = x > playgroundWidth || x < 0 ? playerPosition[0] : x;
    const y = move[1] * speed + playerPosition[1];
    const newY = y > playgroundHeight || y < 0 ? playerPosition[1] : y;

    setPlayerPosition([newX, newY]);
  };

  useInterval(checkMove, 1000 / 60);

  const handleKeyDown = ({ key }) => {
    if (key === "d") {
      setMoveRight(true);
      return;
    }
    if (key === "a") {
      setMoveLeft(true);
      return;
    }
    if (key === "w") {
      setMoveUp(true);
      return;
    }
    if (key === "s") {
      setMoveDown(true);
      return;
    }
  };

  const handleKeyUp = ({ key }) => {
    if (key === "d") {
      setMoveRight(false);
      return;
    }
    if (key === "a") {
      setMoveLeft(false);
      return;
    }
    if (key === "w") {
      setMoveUp(false);
      return;
    }
    if (key === "s") {
      setMoveDown(false);
      return;
    }
  };

  const handleMouseMove = ({ clientX, clientY, target }) => {
    const { offsetLeft, offsetTop } = target;
    setCursorPosition([
      clientX - offsetLeft - playerWidth / 2,
      clientY - offsetTop - playerHeight / 2
    ]);
  };

  useEffect(() => {
    const angle = (() => {
      const diffX = playerPosition[0] - cursorPosition[0];
      const diffY = playerPosition[1] - cursorPosition[1];
      const tan = diffY / diffX;
      const angle = Math.atan(tan) / (Math.PI / 0.5);

      if (diffX >= 0 && diffY >= 0) {
        return angle;
      }
      if (diffX <= 0 && diffY >= 0) {
        return angle - 0.5; // + 0.25 turn
      }
      if (diffX <= 0 && diffY <= 0) {
        return angle + 0.5;
      }
      return angle;
    })();

    setAngle(angle);
  }, [cursorPosition, playerPosition]);

  const stylePosition = {
    transform: `translateX(${playerPosition[0]}px) translateY(${playerPosition[1]}px) rotate(${angle}turn)`
  };

  return (
    <Playground
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      tabIndex={1}
      onMouseMove={handleMouseMove}
    >
      <Player style={stylePosition} />
    </Playground>
  );
}

export default App;
