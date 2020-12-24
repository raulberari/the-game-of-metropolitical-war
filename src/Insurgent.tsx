import { areHexesEqual, compareHexes, getCellValue } from "./Hegemon";
import { v4 as uuidv4 } from "uuid";
import { Hegemon, Hexagon, Insurgent, Point } from "./types";

export const isVertexValid = (
  insurgent: Insurgent,
  insurgents: Insurgent[],
  board: number[][]
) => {
  if (
    getCellValue(insurgent.hex1, board) === 1 &&
    getCellValue(insurgent.hex2, board) === 1 &&
    getCellValue(insurgent.hex3, board) === 1
  ) {
    return false;
  }

  if (
    (getCellValue(insurgent.hex1, board) === 2 ||
      getCellValue(insurgent.hex1, board) === 3 ||
      getCellValue(insurgent.hex2, board) === 2 ||
      getCellValue(insurgent.hex2, board) === 3 ||
      getCellValue(insurgent.hex3, board) === 2 ||
      getCellValue(insurgent.hex3, board) === 3) &&
    insurgent.orientation !== "base"
  ) {
    return false;
  }
  for (const piece of insurgents) {
    if (arePointsEqual(piece, insurgent)) {
      return false;
    }
  }

  return true;
};

export const arePointsEqual = (
  i1: Insurgent | Point,
  i2: Insurgent | Point
) => {
  return (
    areHexesEqual(i1.hex1, i2.hex1) &&
    areHexesEqual(i1.hex2, i2.hex2) &&
    areHexesEqual(i1.hex3, i2.hex3)
  );
};

export const isInsurgentAdjacentToHex = (
  i: Insurgent,
  h: Hegemon | Hexagon
) => {
  if (
    areHexesEqual(i.hex1, h) ||
    areHexesEqual(i.hex2, h) ||
    areHexesEqual(i.hex3, h)
  ) {
    return true;
  }

  return false;
};

export const sortHexesInsideInsurgent = (ins: Insurgent | Point) => {
  // Sort hexes before checking
  if (compareHexes(ins.hex1, ins.hex3)) {
    [ins.hex1, ins.hex3] = [ins.hex3, ins.hex1];
  }
  if (compareHexes(ins.hex1, ins.hex2)) {
    [ins.hex1, ins.hex2] = [ins.hex2, ins.hex1];
  }
  if (compareHexes(ins.hex2, ins.hex3)) {
    [ins.hex2, ins.hex3] = [ins.hex3, ins.hex2];
  }
};

export const isPointOnWater = (point: Point, board: number[][]) => {
  if (
    getCellValue(point.hex1, board) === 1 &&
    getCellValue(point.hex2, board) === 1 &&
    getCellValue(point.hex3, board) === 1
  ) {
    return true;
  }
  return false;
};

export const isPointOnRails = (point: Point | Insurgent, board: number[][]) => {
  if (
    getCellValue(point.hex1, board) === 2 ||
    getCellValue(point.hex2, board) === 2 ||
    getCellValue(point.hex3, board) === 2 ||
    getCellValue(point.hex1, board) === 3 ||
    getCellValue(point.hex2, board) === 3 ||
    getCellValue(point.hex3, board) === 3
  ) {
    return true;
  }
  return false;
};

export const isPointValid = (
  point: Point,
  points: Point[],
  prev: Point,
  selectedInsurgent: Insurgent,
  move: number,
  insurgents: Insurgent[],
  board: number[][]
) => {
  // Prevent going on water
  if (
    getCellValue(point.hex1, board) === 1 &&
    getCellValue(point.hex2, board) === 1 &&
    getCellValue(point.hex3, board) === 1
  ) {
    return false;
  }

  // TODO
  if (point.distance > selectedInsurgent.moves) {
    return false;
  }

  // Prevent going over water
  let firstCommon: Hexagon = point.hex1;
  let secondCommon: Hexagon = point.hex2;

  if (
    !areHexesEqual(prev.hex1, point.hex1) &&
    !areHexesEqual(prev.hex2, point.hex1) &&
    !areHexesEqual(prev.hex3, point.hex1)
  ) {
    firstCommon = point.hex2;
    secondCommon = point.hex3;
  }

  if (
    !areHexesEqual(prev.hex1, point.hex2) &&
    !areHexesEqual(prev.hex2, point.hex2) &&
    !areHexesEqual(prev.hex3, point.hex2)
  ) {
    firstCommon = point.hex1;
    secondCommon = point.hex3;
  }

  if (
    !areHexesEqual(prev.hex1, point.hex3) &&
    !areHexesEqual(prev.hex2, point.hex3) &&
    !areHexesEqual(prev.hex3, point.hex3)
  ) {
    firstCommon = point.hex1;
    secondCommon = point.hex2;
  }

  if (
    getCellValue(firstCommon, board) === 1 &&
    getCellValue(secondCommon, board) === 1
  ) {
    return false;
  }

  // Prevent going through other insurgents
  for (const piece of insurgents) {
    if (arePointsEqual(piece, point)) {
      return false;
    }
  }

  // Prevent doubled points
  for (const p of points) {
    if (arePointsEqual(point, p)) {
      return false;
    }
  }

  return true;
};

export const isPointBetweenThreeHegemons = (
  point: Point,
  hegemons: Hegemon[]
) => {
  let exists1 = false;
  let exists2 = false;
  let exists3 = false;

  for (const hegemon of hegemons) {
    if (areHexesEqual(hegemon, point.hex1)) {
      exists1 = true;
    }
    if (areHexesEqual(hegemon, point.hex2)) {
      exists2 = true;
    }
    if (areHexesEqual(hegemon, point.hex3)) {
      exists3 = true;
    }
  }
  return exists1 && exists2 && exists3;
};

const listIncludesPoint = (points: Point[], point: Point) => {
  for (var p of points) {
    if (arePointsEqual(p, point)) {
      return true;
    }
  }
  return false;
};

export const getInsurgentNeighbors = (
  selectedInsurgent: Insurgent,
  insurgents: Insurgent[],
  board: number[][]
) => {
  let neighbors: Point[] = [];

  // add the initial point
  neighbors.push({
    id: uuidv4(),
    hex1: selectedInsurgent.hex1,
    hex2: selectedInsurgent.hex2,
    hex3: selectedInsurgent.hex3,
    distance: 0,
  });

  const railPoints: Point[] = [];

  for (let move = 1; move <= selectedInsurgent.moves; move++) {
    // for each step, for each neighbor,
    // "reflect" one of the hexes => 3 possible moves
    // add it to the list if it does not exist
    const newNeighbors = JSON.parse(JSON.stringify(neighbors));
    for (const neighbor of neighbors) {
      if (neighbor.hex1.col < neighbor.hex2.col) {
        const right = {
          id: uuidv4(),

          hex1: {
            id: uuidv4(),
            col: neighbor.hex1.col + 2,
            row: neighbor.hex1.row,
          },
          hex2: neighbor.hex2,
          hex3: neighbor.hex3,
          distance: neighbor.distance + 1,
        };
        sortHexesInsideInsurgent(right);
        if (
          isPointOnRails(right, board) &&
          selectedInsurgent.orientation !== "base" &&
          !listIncludesPoint(railPoints, right)
        ) {
          right.distance += 1;
          railPoints.push(right);
        }
        if (
          isPointValid(
            right,
            newNeighbors,
            neighbor,
            selectedInsurgent,
            move,
            insurgents,
            board
          )
        )
          newNeighbors.push(right);

        const leftUp = {
          id: uuidv4(),

          hex1: neighbor.hex1,
          hex2: neighbor.hex2,
          hex3: {
            id: uuidv4(),
            col: neighbor.hex3.col - 1,
            row:
              neighbor.hex3.col % 2 === 0
                ? neighbor.hex3.row - 2
                : neighbor.hex3.row - 1,
          },
          distance: neighbor.distance + 1,
        };
        sortHexesInsideInsurgent(leftUp);
        if (
          isPointOnRails(leftUp, board) &&
          selectedInsurgent.orientation !== "base" &&
          !listIncludesPoint(railPoints, leftUp)
        ) {
          leftUp.distance += 1;
          railPoints.push(leftUp);
        }
        if (
          isPointValid(
            leftUp,
            newNeighbors,
            neighbor,
            selectedInsurgent,
            move,
            insurgents,
            board
          )
        )
          newNeighbors.push(leftUp);

        const leftBottom = {
          id: uuidv4(),

          hex1: neighbor.hex1,
          hex2: {
            id: uuidv4(),
            col: neighbor.hex2.col - 1,
            row:
              neighbor.hex2.col % 2 === 0
                ? neighbor.hex2.row + 1
                : neighbor.hex2.row + 2,
          },
          hex3: neighbor.hex3,
          distance: neighbor.distance + 1,
        };
        sortHexesInsideInsurgent(leftBottom);
        if (
          isPointOnRails(leftBottom, board) &&
          selectedInsurgent.orientation !== "base" &&
          !listIncludesPoint(railPoints, leftBottom)
        ) {
          leftBottom.distance += 1;
          railPoints.push(leftBottom);
        }
        if (
          isPointValid(
            leftBottom,
            newNeighbors,
            neighbor,
            selectedInsurgent,
            move,
            insurgents,
            board
          )
        )
          newNeighbors.push(leftBottom);
      } else if (neighbor.hex3.col > neighbor.hex2.col) {
        const left = {
          id: uuidv4(),

          hex1: neighbor.hex1,
          hex2: neighbor.hex2,
          hex3: {
            id: uuidv4(),
            col: neighbor.hex3.col - 2,
            row: neighbor.hex3.row,
          },
          distance: neighbor.distance + 1,
        };
        sortHexesInsideInsurgent(left);
        if (
          isPointOnRails(left, board) &&
          selectedInsurgent.orientation !== "base" &&
          !listIncludesPoint(railPoints, left)
        ) {
          left.distance += 1;
          railPoints.push(left);
        }
        if (
          isPointValid(
            left,
            newNeighbors,
            neighbor,
            selectedInsurgent,
            move,
            insurgents,
            board
          )
        )
          newNeighbors.push(left);

        const rightUp = {
          id: uuidv4(),

          hex1: neighbor.hex1,
          hex2: {
            id: uuidv4(),
            col: neighbor.hex2.col + 1,
            row:
              neighbor.hex2.col % 2 === 0
                ? neighbor.hex2.row - 2
                : neighbor.hex2.row - 1,
          },
          hex3: neighbor.hex3,
          distance: neighbor.distance + 1,
        };
        sortHexesInsideInsurgent(rightUp);
        if (
          isPointOnRails(rightUp, board) &&
          selectedInsurgent.orientation !== "base" &&
          !listIncludesPoint(railPoints, rightUp)
        ) {
          rightUp.distance += 1;
          railPoints.push(rightUp);
        }
        if (
          isPointValid(
            rightUp,
            newNeighbors,
            neighbor,
            selectedInsurgent,
            move,
            insurgents,
            board
          )
        )
          newNeighbors.push(rightUp);

        const rightDown = {
          id: uuidv4(),

          hex1: {
            id: uuidv4(),
            col: neighbor.hex1.col + 1,
            row:
              neighbor.hex1.col % 2 === 0
                ? neighbor.hex1.row + 1
                : neighbor.hex1.row + 2,
          },
          hex2: neighbor.hex2,
          hex3: neighbor.hex3,
          distance: neighbor.distance + 1,
        };
        sortHexesInsideInsurgent(rightDown);
        if (
          isPointOnRails(rightDown, board) &&
          selectedInsurgent.orientation !== "base" &&
          !listIncludesPoint(railPoints, rightDown)
        ) {
          rightDown.distance += 1;
          railPoints.push(rightDown);
        }

        if (
          isPointValid(
            rightDown,
            newNeighbors,
            neighbor,
            selectedInsurgent,
            move,
            insurgents,
            board
          )
        )
          newNeighbors.push(rightDown);
      }
    }
    neighbors = JSON.parse(JSON.stringify(newNeighbors));
  }

  neighbors.splice(0, 1);
  return neighbors;
};

export const getAllInsurgentsNeighbors = (
  insurgents: Insurgent[],
  board: number[][]
): Point[] => {
  let points: Point[] = [];

  if (insurgents.length === 0) {
    for (let x = -1; x < board[0].length; x++) {
      for (let y = -1; y < board.length / 2 + 1; y++) {
        const point1: Point = {
          id: uuidv4(),
          hex1: { id: uuidv4(), col: x, row: y },
          hex2: { id: uuidv4(), col: x + 1, row: y },
          hex3: { id: uuidv4(), col: x, row: x % 2 === 0 ? y + 1 : y - 1 },
          distance: 0,
        };
        if (!isPointOnWater(point1, board)) {
          sortHexesInsideInsurgent(point1);
          points.push(point1);
        }

        const point2: Point = {
          id: uuidv4(),
          hex1: { id: uuidv4(), col: x, row: y },
          hex2: { id: uuidv4(), col: x - 1, row: y },
          hex3: { id: uuidv4(), col: x, row: x % 2 === 0 ? y + 1 : y - 1 },
          distance: 0,
        };
        if (!isPointOnWater(point2, board)) {
          sortHexesInsideInsurgent(point2);
          points.push(point2);
        }
      }
    }
    return points;
    // should return all the possible points on the board
  }

  for (const insurgent of insurgents) {
    const neighbors = getInsurgentNeighbors(insurgent, insurgents, board);
    for (const neighbor of neighbors) {
      let isInList = false;
      for (const point of points) {
        if (arePointsEqual(point, neighbor)) {
          isInList = true;
          break;
        }
      }

      if (!isInList) {
        points.push(neighbor);
      }
    }
  }

  return points;
};
