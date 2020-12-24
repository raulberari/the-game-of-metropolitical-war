import { v4 as uuidv4 } from "uuid";
import {
  isInsurgentAdjacentToHex,
  sortHexesInsideInsurgent,
} from "./Insurgent";
import { Hegemon, Hexagon, Insurgent, Point } from "./types";

export const isCellValid = (
  hegemon: Hegemon | Hexagon,
  hegemons: Hegemon[],
  board: number[][]
) => {
  if (
    hegemon.row < 0 ||
    hegemon.col < 0 ||
    hegemon.row >= board.length / 2 ||
    hegemon.col >= board[0].length
  ) {
    return false;
  }
  for (const piece of hegemons) {
    if (piece.col === hegemon.col && piece.row === hegemon.row) {
      return false;
    }
  }

  if (board[(hegemon.col % 2) + hegemon.row * 2][hegemon.col] === 2) {
    return false;
  }
  return true;
};

export const getCellValue = (hegemon: Hegemon | Hexagon, board: number[][]) => {
  if (
    hegemon.row < 0 ||
    hegemon.col < 0 ||
    hegemon.row >= board.length / 2 ||
    hegemon.col >= board[0].length
  ) {
    return 1;
  }
  return board[(hegemon.col % 2) + hegemon.row * 2][hegemon.col];
};

export const compareHexes = (h1: Hegemon | Hexagon, h2: Hegemon | Hexagon) => {
  // Returns the bigger one
  if (h1.col === h2.col) {
    return h1.row > h2.row;
  }

  return h1.col > h2.col;
};

export const areHexesEqual = (h1: Hegemon | Hexagon, h2: Hegemon | Hexagon) => {
  return h1.col === h2.col && h1.row === h2.row;
};

export const isSpaceAvailable = (hegemons: Hegemon[], board: number[][]) => {
  for (let j = 0; j < board[0].length; j++) {
    for (let i = j % 2; i < board.length; i += 2) {
      if (board[i][j] !== 2) {
        let found = false;
        for (const hegemon of hegemons) {
          if ((hegemon.col % 2) + hegemon.row * 2 === i && hegemon.col === j) {
            found = true;
            if (found) break;
          }
        }
        if (!found) {
          return true;
        }
      }
    }
  }
  return false;
};

export const getHegemonGroup = (
  hegemon: Hegemon,
  hegemons: Hegemon[],
  group: Hegemon[],
  board: number[][]
) => {
  let exists = false;
  for (const h of group) {
    if (areHexesEqual(h, hegemon)) {
      exists = true;
      break;
    }
  }
  if (!exists) {
    group.push(hegemon);
  }
  const neighbors = getHexNeighbors(hegemon, hegemons, board, false);

  for (const neighbor of neighbors) {
    let isHegemon = false;
    let foundHegemon: Hegemon = { id: uuidv4(), col: -1, row: -1, moves: 3 };
    for (const heg of hegemons) {
      if (areHexesEqual(heg, neighbor)) {
        isHegemon = true;
        foundHegemon = heg;
        break;
      }
    }
    if (isHegemon) {
      let exists = false;
      for (const h of group) {
        if (areHexesEqual(h, foundHegemon)) {
          exists = true;
          break;
        }
      }
      if (!exists) {
        group.push(foundHegemon);
        getHegemonGroup(foundHegemon, hegemons, group, board);
      }
    }
  }
  return group;
};

export const getHexNeighbors = (
  hegemon: Hexagon | Hegemon,
  hegemons: Hegemon[],
  board: number[][],
  available: boolean
) => {
  let neighbors: Hexagon[] = [];
  if (hegemon.col < 0 || hegemon.row < 0) {
    return neighbors;
  }

  // bottom
  neighbors.push({ id: uuidv4(), col: hegemon.col, row: hegemon.row + 1 });

  // up
  neighbors.push({ id: uuidv4(), col: hegemon.col, row: hegemon.row - 1 });

  // right-up
  const rightUp: Hexagon = {
    id: uuidv4(),
    col: hegemon.col + 1,
    row: hegemon.row,
  };
  if (hegemon.col % 2 === 0) {
    rightUp.row--;
  }
  neighbors.push(rightUp);

  // right-bottom
  const rightBottom: Hexagon = {
    id: uuidv4(),
    col: hegemon.col + 1,
    row: hegemon.row + 1,
  };
  if (hegemon.col % 2 === 0) {
    rightBottom.row--;
  }
  neighbors.push(rightBottom);

  // left-up
  const leftUp: Hexagon = {
    id: uuidv4(),
    col: hegemon.col - 1,
    row: hegemon.row,
  };
  if (hegemon.col % 2 === 0) {
    leftUp.row--;
  }
  neighbors.push(leftUp);

  // left-bottom
  const leftBottom: Hexagon = {
    id: uuidv4(),
    col: hegemon.col - 1,
    row: hegemon.row + 1,
  };
  if (hegemon.col % 2 === 0) {
    leftBottom.row--;
  }
  neighbors.push(leftBottom);

  if (available) {
    neighbors = neighbors.filter((hex) => isCellValid(hex, hegemons, board));
  } else {
    neighbors = neighbors.filter(
      (hex) =>
        hex.col >= 0 &&
        hex.row >= 0 &&
        hex.row < board.length / 2 &&
        hex.col < board[0].length
    );
  }
  return JSON.parse(JSON.stringify(neighbors));
};

export const getAllHegemonPlaces = (
  hegemons: Hegemon[],
  insurgents: Insurgent[],
  board: number[][]
): Hexagon[] => {
  let hexagons: Hexagon[] = [];

  for (let x = 0; x < board[0].length; x++) {
    for (let y = 0; y < board.length / 2; y++) {
      const hex = {
        id: uuidv4(),
        col: x,
        row: y,
      };
      if (isCellValid(hex, hegemons, board)) {
        let intersects = false;
        for (const ins of insurgents) {
          for (const h of getHexNeighbors(hex, hegemons, board, false)) {
            if (isInsurgentAdjacentToHex(ins, h)) {
              intersects = true;
              break;
            }
          }
        }

        if (!intersects) {
          hexagons.push(hex);
        }
      }
    }
  }
  return hexagons;
};

export const getHexPoints = (hex: Hexagon | Hegemon) => {
  // 6 points
  const points: Point[] = [];

  // left
  const left: Point = {
    id: uuidv4(),
    hex1: JSON.parse(JSON.stringify(hex)),
    hex2: {
      id: uuidv4(),
      col: hex.col - 1,
      row: hex.col % 2 === 0 ? hex.row - 1 : hex.row,
    },
    hex3: {
      id: uuidv4(),
      col: hex.col - 1,
      row: hex.col % 2 === 0 ? hex.row : hex.row + 1,
    },
    distance: 1,
  };
  sortHexesInsideInsurgent(left);
  points.push(left);

  // right
  const right: Point = {
    id: uuidv4(),
    hex1: JSON.parse(JSON.stringify(hex)),
    hex2: {
      id: uuidv4(),
      col: hex.col + 1,
      row: hex.col % 2 === 0 ? hex.row - 1 : hex.row,
    },
    hex3: {
      id: uuidv4(),
      col: hex.col + 1,
      row: hex.col % 2 === 0 ? hex.row : hex.row + 1,
    },
    distance: 1,
  };
  sortHexesInsideInsurgent(right);
  points.push(right);

  // left up
  const leftUp: Point = {
    id: uuidv4(),
    hex1: JSON.parse(JSON.stringify(hex)),
    hex2: {
      id: uuidv4(),
      col: hex.col - 1,
      row: hex.col % 2 === 0 ? hex.row - 1 : hex.row,
    },
    hex3: {
      id: uuidv4(),
      col: hex.col,
      row: hex.row - 1,
    },
    distance: 1,
  };
  sortHexesInsideInsurgent(leftUp);
  points.push(leftUp);

  // right up
  const rightUp: Point = {
    id: uuidv4(),
    hex1: JSON.parse(JSON.stringify(hex)),
    hex2: {
      id: uuidv4(),
      col: hex.col + 1,
      row: hex.col % 2 === 0 ? hex.row - 1 : hex.row,
    },
    hex3: {
      id: uuidv4(),
      col: hex.col,
      row: hex.row - 1,
    },
    distance: 1,
  };
  sortHexesInsideInsurgent(rightUp);
  points.push(rightUp);

  // left down
  const leftDown: Point = {
    id: uuidv4(),
    hex1: JSON.parse(JSON.stringify(hex)),
    hex2: {
      id: uuidv4(),
      col: hex.col - 1,
      row: hex.col % 2 === 0 ? hex.row : hex.row + 1,
    },
    hex3: {
      id: uuidv4(),
      col: hex.col,
      row: hex.row + 1,
    },
    distance: 1,
  };
  sortHexesInsideInsurgent(leftDown);
  points.push(leftDown);

  // right down
  const rightDown: Point = {
    id: uuidv4(),
    hex1: JSON.parse(JSON.stringify(hex)),
    hex2: {
      id: uuidv4(),
      col: hex.col + 1,
      row: hex.col % 2 === 0 ? hex.row : hex.row + 1,
    },
    hex3: {
      id: uuidv4(),
      col: hex.col,
      row: hex.row + 1,
    },
    distance: 1,
  };
  sortHexesInsideInsurgent(rightDown);
  points.push(rightDown);

  return points;
};
