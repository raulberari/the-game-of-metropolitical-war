import { Dispatch, SetStateAction } from "react";
import { playSound } from "./Board";
import { arePointsEqual, isPointOnRails } from "./Insurgent";
import { Config, Game, Hegemon, Insurgent } from "./types";

export const PreviewHeightMove = (props: {
  insurgent: Insurgent;
  hegemons: Hegemon[];
  setHegemons: Dispatch<SetStateAction<Hegemon[]>>;
  game: Game;
  setGame: Dispatch<SetStateAction<Game>>;
  insurgents: Insurgent[];
  setInsurgents: Dispatch<SetStateAction<Insurgent[]>>;
  setSelectedInsurgent: Dispatch<SetStateAction<Insurgent>>;
  config: Config;
  stepLand: HTMLAudioElement;
}) => {
  const {
    insurgent,
    game,
    setGame,
    insurgents,
    setInsurgents,
    setSelectedInsurgent,
    config,
    stepLand,
  } = props;

  // Difference between insurgent orientation and choice
  // 1 = up, 0 = base, -1 = down
  const orientationToNumber = {
    up: 1,
    base: 0,
    down: -1,
  };

  const numberToOrientation: Record<string, "up" | "base" | "down"> = {
    "1": "up",
    "0": "base",
    "-1": "down",
  };

  const moveInsurgentHeight = (
    insurgent: Insurgent,
    insurgents: Insurgent[],
    choice: number
  ) => {
    playSound(stepLand);
    const newInsurgents: Insurgent[] = JSON.parse(JSON.stringify(insurgents));
    const idx = newInsurgents.findIndex((p) => arePointsEqual(p, insurgent));

    const delta = Math.abs(orientationToNumber[insurgent.orientation] - choice);
    newInsurgents[idx].moves -= delta;
    newInsurgents[idx].orientation = numberToOrientation[choice.toString()];

    // If round end
    if (newInsurgents.find((p) => p.moves > 0) === undefined) {
      for (const ins of newInsurgents) {
        ins.attacked = 0;
      }
      for (const ins of newInsurgents) {
        ins.moves = props.config.insurgentMoves;
      }

      setSelectedInsurgent({
        id: "",
        hex1: { id: "", col: -1, row: -1 },
        hex2: { id: "", col: -1, row: -1 },
        hex3: { id: "", col: -1, row: -1 },
        orientation: "base",
        willBeAttacked: false,
        attacked: 0,
        moves: 0,
      });

      const newGame: Game = JSON.parse(JSON.stringify(game));
      newGame.gameplayState = "insurgentPlace";
      setGame(newGame);
    }

    setInsurgents(newInsurgents);

    // Remove preview if no moves left
    if (newInsurgents[idx].moves < 1) {
      setSelectedInsurgent({
        id: "",
        hex1: { id: "", col: -1, row: -1 },
        hex2: { id: "", col: -1, row: -1 },
        hex3: { id: "", col: -1, row: -1 },
        orientation: "base",
        willBeAttacked: false,
        attacked: 0,
        moves: 0,
      });
    } else {
      setSelectedInsurgent(newInsurgents[idx]);
    }
  };

  const canMakeMove = (
    insurgent: Insurgent,
    choice: number,
    board: number[][]
  ) => {
    const delta = Math.abs(orientationToNumber[insurgent.orientation] - choice);

    if (delta > 0 && delta <= insurgent.moves) {
      return true;
    }
    return false;
  };

  let top = 0;
  top +=
    (insurgent.hex1.col % 2 === 0 ? 50 : 84.65) + insurgent.hex1.row * 69.3;
  top +=
    (insurgent.hex2.col % 2 === 0 ? 50 : 84.65) + insurgent.hex2.row * 69.3;
  top +=
    (insurgent.hex3.col % 2 === 0 ? 50 : 84.65) + insurgent.hex3.row * 69.3;
  top /= 3;

  let left = 0;
  left += 14 + insurgent.hex1.col * 60.1;
  left += 14 + insurgent.hex2.col * 60.1;
  left += 14 + insurgent.hex3.col * 60.1;
  left /= 3;

  const canGoUp = canMakeMove(insurgent, 1, config.board);
  const canGoBase = canMakeMove(insurgent, 0, config.board);
  const canGoDown = canMakeMove(insurgent, -1, config.board);

  return insurgent.id !== "" &&
    insurgent.moves > 0 &&
    !isPointOnRails(insurgent, config.board) ? (
    <div
      style={{
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "rgba(200, 0, 0, 0.8)",
        left: 39 + left + "px",
        top: 7 + top + "px",
        padding: "2px",
        zIndex: 109,
        transform: "!important",
      }}
    >
      <div
        style={{
          float: "left",
          width: 0,
          height: 0,
          borderLeft: "5px solid transparent",
          borderRight: "5px solid transparent",
          borderBottom: "8px solid white",

          cursor: canGoUp ? "pointer" : "default",
          opacity: canGoUp ? "0.8" : 0,
          zIndex: 99,
        }}
        onClick={() =>
          canGoUp ? moveInsurgentHeight(insurgent, insurgents, 1) : null
        }
      />
      <div
        style={{
          float: "left",
          width: "8px",
          height: "8px",
          borderRadius: "10px",
          backgroundColor: "white",
          margin: "4px 0 4px 0",

          cursor: canGoBase ? "pointer" : "default",
          opacity: canGoBase ? "0.8" : 0,
          zIndex: 99,
        }}
        onClick={() =>
          canGoBase ? moveInsurgentHeight(insurgent, insurgents, 0) : null
        }
      />
      <div
        style={{
          float: "left",
          width: 0,
          height: 0,
          borderLeft: "5px solid transparent",
          borderRight: "5px solid transparent",
          borderTop: "8px solid white",

          cursor: canGoDown ? "pointer" : "default",
          opacity: canGoDown ? "0.8" : 0,
          zIndex: 99,
        }}
        onClick={() =>
          canGoDown ? moveInsurgentHeight(insurgent, insurgents, -1) : null
        }
      />
    </div>
  ) : null;
};
