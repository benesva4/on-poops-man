// import React from "react";
// import { useGameEngine } from "./GameEngine";
// import "./App.css";
// import styled from "styled-components";

// const playgroundWidth = 800;
// const playgroundHeight = 600;

// const playerWidth = 10;
// const playerHeight = 5;

// const Playground = styled.div`
//   width: ${playgroundWidth}px;
//   height: ${playgroundHeight}px;
//   border: 1px solid black;
//   position: relative;
// `;

// const Player = styled.div`
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: ${playerWidth}px;
//   height: ${playerHeight}px;
//   background: linear-gradient(to left, yellow, blue);
// `;

// function App() {
//   const [gameState, gameHandlers] = useGameEngine();

//   const stylePosition = (x, y, angle) => ({
//     transform: `translateX(${x}px) translateY(${y}px) rotate(${angle}turn)`
//   });

//   return (
//     <Playground
//       onKeyDown={gameHandlers.onKeyDown}
//       onKeyUp={gameHandlers.onKeyUp}
//       onMouseMove={gameHandlers.onMouseMove}
//       tabIndex={1}
//     >
//       {gameState &&
//         Object.values(gameState).map(({ position }, index) => (
//           <Player
//             key={index}
//             style={stylePosition(position.x, position.y, position.angle)}
//           ></Player>
//         ))}
//     </Playground>
//   );
// }

// export default App;
export default null;
