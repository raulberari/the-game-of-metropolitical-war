/* eslint-disable jsx-a11y/heading-has-content */
import "./index.css";
import { v4 as uuidv4 } from "uuid";

import config from "./config/new-york.json";

import { Display } from "rot-js";
import { isCellValid, isSpaceAvailable } from "./Hegemon";
import { Board } from "./Board";
import { Root } from "./Root";
import ReactDOM from "react-dom";
import {
  isPointOnRails,
  isVertexValid,
  sortHexesInsideInsurgent,
} from "./Insurgent";
import { Game, Hegemon, Insurgent } from "./types";

//@ts-ignore
import backgroundMusicAudio from "./sounds/tears-in-rain.mp3";
const backgroundMusic = new Audio(backgroundMusicAudio);
backgroundMusic.volume = 0.2;
backgroundMusic.preload = "auto";
backgroundMusic.loop = true;
backgroundMusic.autoplay = true;

export const renderBoard = (config: any, backgroundMusic: HTMLAudioElement) => {
  const cellToColor: Record<number, string> = {
    0: "rgb(255, 255, 255)",
    1: "rgb(58, 76, 105)",
    2: "rgb(77, 76, 76)",
    3: "rgba(58, 76, 105, 0.4)",
  };

  var display = new Display({
    width: config.height * 2,
    height: config.width,
    layout: "hex",
    border: 0.4,
    spacing: 4,
    transpose: true,
  });

  for (let x = 0; x < config.width; x++) {
    for (let y = x % 2; y < config.height * 2; y += 2) {
      let bg = cellToColor[config.board[y][x]];

      display.draw(y, x, "", "rgb(125, 125, 125)", bg);
    }
  }
  const gameContainer = display.getContainer()!;
  const boardDiv = document.getElementById("board")!;
  boardDiv.appendChild(gameContainer);
  // Muzica maestre
  backgroundMusic.play();

  // const textElements = [];
  // for (const location of config.locations) {
  //   textElements.push(
  //     <p
  //       style={{
  //         position: "absolute",
  //         top: location.top,
  //         left: location.left,
  //         fontFamily: "Nova Square",
  //         color: location.color,
  //         fontWeight: 500,
  //         fontSize: location.fontSize,
  //         userSelect: "none",
  //         transform: location.rotate,
  //         zIndex: 1,
  //       }}
  //     >
  //       {location.name}
  //     </p>
  //   );
  // }
  // Render board text
  for (const location of config.locations) {
    const p = document.createElement("p");

    p.textContent = location.name;
    p.style.position = "absolute";
    p.style.color = "black";
    p.style.top = location.top;
    p.style.left = location.left;
    p.style.fontFamily = "Nova Square";
    p.style.color = location.color;
    p.style.fontWeight = "500";
    p.style.fontSize = location.fontSize;
    p.style.userSelect = "none";
    p.style.transform = location.rotate;
    p.style.zIndex = "1";

    boardDiv.appendChild(p);
  }

  // Render title
  document.getElementById("title")!.innerHTML = config.title;
  document.getElementById("year")!.innerHTML = config.year;
};

const generateHegemons = (hegemons: Hegemon[], count: number) => {
  for (let idx = 0; idx < count; idx++) {
    let piece: Hegemon;
    if (!isSpaceAvailable(hegemons, config.board)) {
      break;
    }

    do {
      const col = Math.floor(Math.round(Math.random() * 19));
      const row = Math.floor(Math.random() * 30);

      piece = { id: uuidv4(), col: col, row: row, moves: config.hegemonMoves };
    } while (!isCellValid(piece, hegemons, config.board));

    hegemons.push(piece);
  }
};

const generateInsurgent = (insurgents: Insurgent[]) => {
  let piece: Insurgent;
  do {
    const col1 = Math.floor(Math.round(Math.random() * 21 - 1));
    const row1 = Math.floor(Math.random() * 31 - 1);

    let col2 = JSON.parse(JSON.stringify(col1));
    let row2 = JSON.parse(JSON.stringify(row1));
    row2 += 1;

    let col3 = JSON.parse(JSON.stringify(col2));
    let row3 = JSON.parse(JSON.stringify(row2));

    if (Math.random() < 0.5) {
      col3 = col2 - 1;
      row3 = col3 % 2 === 0 ? Math.max(row1, row2) : Math.min(row1, row2);
    } else {
      col3 = col2 + 1;
      row3 = col3 % 2 === 0 ? Math.max(row1, row2) : Math.min(row1, row2);
    }

    piece = {
      id: uuidv4(),
      hex1: {
        id: uuidv4(),
        col: col1,
        row: row1,
      },
      hex2: {
        id: uuidv4(),
        col: col2,
        row: row2,
      },
      hex3: {
        id: uuidv4(),
        col: col3,
        row: row3,
      },
      orientation:
        Math.random() < 0.33 ? "base" : Math.random() < 0.5 ? "down" : "up",
      willBeAttacked: false,
      attacked: 0,
      moves: config.insurgentMoves,
    };
    // Sort hexes before checking
    sortHexesInsideInsurgent(piece);
  } while (!isVertexValid(piece, insurgents, config.board));

  return piece;
};
const generateInsurgentNeighbor = (
  insurgent: Insurgent,
  insurgents: Insurgent[]
) => {
  // No verification

  if (insurgent.hex1.col < insurgent.hex2.col) {
    // 33% chance each
    const chance = Math.random();
    if (chance < 0.33) {
      const right: Insurgent = {
        id: uuidv4(),

        hex1: {
          id: uuidv4(),
          col: insurgent.hex1.col + 2,
          row: insurgent.hex1.row,
        },
        hex2: insurgent.hex2,
        hex3: insurgent.hex3,
        orientation: "base",
        willBeAttacked: false,
        attacked: 0,
        moves: config.insurgentMoves,
      };
      sortHexesInsideInsurgent(right);

      return right;
    } else if (chance < 0.66) {
      const leftUp: Insurgent = {
        id: uuidv4(),

        hex1: insurgent.hex1,
        hex2: insurgent.hex2,
        hex3: {
          id: uuidv4(),
          col: insurgent.hex3.col - 1,
          row:
            insurgent.hex3.col % 2 === 0
              ? insurgent.hex3.row - 2
              : insurgent.hex3.row - 1,
        },
        orientation: "base",
        willBeAttacked: false,
        attacked: 0,
        moves: config.insurgentMoves,
      };
      sortHexesInsideInsurgent(leftUp);
      return leftUp;
    } else {
      const leftBottom: Insurgent = {
        id: uuidv4(),

        hex1: insurgent.hex1,
        hex2: {
          id: uuidv4(),
          col: insurgent.hex2.col - 1,
          row:
            insurgent.hex2.col % 2 === 0
              ? insurgent.hex2.row + 1
              : insurgent.hex2.row + 2,
        },
        hex3: insurgent.hex3,
        orientation: "base",
        willBeAttacked: false,
        attacked: 0,
        moves: config.insurgentMoves,
      };
      sortHexesInsideInsurgent(leftBottom);
      return leftBottom;
    }
  } else {
    // 33% chance each
    const chance = Math.random();
    if (chance < 0.33) {
      const left: Insurgent = {
        id: uuidv4(),

        hex1: insurgent.hex1,
        hex2: insurgent.hex2,
        hex3: {
          id: uuidv4(),
          col: insurgent.hex3.col - 2,
          row: insurgent.hex3.row,
        },
        orientation: "base",
        willBeAttacked: false,
        attacked: 0,
        moves: config.insurgentMoves,
      };
      sortHexesInsideInsurgent(left);
      return left;
    } else if (chance < 0.66) {
      const rightUp: Insurgent = {
        id: uuidv4(),

        hex1: insurgent.hex1,
        hex2: {
          id: uuidv4(),
          col: insurgent.hex2.col + 1,
          row:
            insurgent.hex2.col % 2 === 0
              ? insurgent.hex2.row - 2
              : insurgent.hex2.row - 1,
        },
        hex3: insurgent.hex3,
        orientation: "base",
        willBeAttacked: false,
        attacked: 0,
        moves: config.insurgentMoves,
      };
      sortHexesInsideInsurgent(rightUp);
      return rightUp;
    } else {
      const rightDown: Insurgent = {
        id: uuidv4(),

        hex1: {
          id: uuidv4(),
          col: insurgent.hex1.col + 1,
          row:
            insurgent.hex1.col % 2 === 0
              ? insurgent.hex1.row + 1
              : insurgent.hex1.row + 2,
        },
        hex2: insurgent.hex2,
        hex3: insurgent.hex3,
        orientation: "base",
        willBeAttacked: false,
        attacked: 0,
        moves: config.insurgentMoves,
      };
      sortHexesInsideInsurgent(rightDown);
      return rightDown;
    }
  }
};

const generateInsurgentSwarm = (insurgents: Insurgent[], count: number) => {
  let initialPiece: Insurgent = generateInsurgent(insurgents);

  const swarm: Insurgent[] = [];
  if (count > 0) {
    insurgents.push(initialPiece);
    swarm.push(initialPiece);

    for (let idx = 1; idx < count; idx++) {
      let piece: Insurgent;
      do {
        const randomNo = Math.floor(Math.random() * swarm.length);
        piece = generateInsurgentNeighbor(swarm[randomNo], insurgents);
        if (!isPointOnRails(piece, config.board)) {
          piece.orientation =
            Math.random() < 0.33 ? "base" : Math.random() < 0.5 ? "up" : "down";
        }
      } while (!isVertexValid(piece, insurgents, config.board));
      insurgents.push(piece);
      swarm.push(piece);
    }
  }
};

// Generate hegemons and insurgents
let hegemons: Hegemon[] = [];
let insurgents: Insurgent[] = [];

// generateHegemons(hegemons, 50);
// generateInsurgentSwarm(insurgents, 25);
// generateInsurgentSwarm(insurgents, 25);
// generateInsurgentSwarm(insurgents, 25);

const game: Game = {
  gameplayState: "preStart",
  deadInsurgents: 0,
  deadHegemons: 0,
};
// Render hegemons and insurgents
const element = (
  <Board
    hegemons={hegemons}
    insurgents={insurgents}
    game={game}
    config={config}
    backgroundMusic={backgroundMusic}
  />
);

ReactDOM.render(element, document.getElementById("board")!);

renderBoard(config, backgroundMusic);
