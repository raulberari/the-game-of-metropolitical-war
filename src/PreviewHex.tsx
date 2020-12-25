import { Dispatch, SetStateAction } from "react";
import { areHexesEqual, getCellValue, getHexNeighbors } from "./Hegemon";
import { isInsurgentAdjacentToHex } from "./Insurgent";
import { Hexagon, Hegemon, Insurgent, Game, Config } from "./types";
import { v4 as uuidv4 } from "uuid";
import { playSound } from "./Board";

export const PreviewHex = (props: {
  hex: Hexagon;
  hegemon: Hexagon;
  hegemons: Hegemon[];
  setHegemons: Dispatch<SetStateAction<Hegemon[]>>;
  selectedHegemonAttack: Hexagon;
  setSelectedHegemonMovement: Dispatch<SetStateAction<Hexagon>>;
  setSelectedHegemonAttack: Dispatch<SetStateAction<Hexagon>>;
  insurgents: Insurgent[];
  setInsurgents: Dispatch<SetStateAction<Insurgent[]>>;
  game: Game;
  setGame: Dispatch<SetStateAction<Game>>;
  config: Config;
  scale: number;
  color: string;
  explosion: HTMLAudioElement;
  hegemonMove: HTMLAudioElement;
  hegemonMoveWater: HTMLAudioElement;
  roundEnd: HTMLAudioElement;
}) => {
  const {
    hex,
    hegemon,
    hegemons,
    setHegemons,
    selectedHegemonAttack,
    setSelectedHegemonMovement,
    setSelectedHegemonAttack,
    game,
    setGame,
    insurgents,
    setInsurgents,
    config,
    scale,
    color,
    explosion,
    hegemonMove,
    hegemonMoveWater,
    roundEnd,
  } = props;

  const moveHegemon = (hex: Hexagon, hegemon: Hexagon, hegemons: Hegemon[]) => {
    const newHegemons: Hegemon[] = JSON.parse(JSON.stringify(hegemons));
    const idx = newHegemons.findIndex((h) => areHexesEqual(h, hegemon));
    newHegemons[idx].col = hex.col;
    newHegemons[idx].row = hex.row;
    newHegemons[idx].moves = 0;

    if (getCellValue(hex, config.board) === 1) {
      playSound(hegemonMoveWater);
    } else {
      playSound(hegemonMove);
    }

    // If round end
    if (newHegemons.find((h) => h.moves > 0) === undefined) {
      playSound(roundEnd);
      for (const heg of newHegemons) {
        heg.moves = config.hegemonMoves;
      }
      setHegemons(newHegemons);

      const newGame: Game = JSON.parse(JSON.stringify(game));
      newGame.gameplayState = "insurgentMove";
      setGame(newGame);
    }

    setHegemons(newHegemons);

    setSelectedHegemonMovement({
      id: "",
      col: -1,
      row: -1,
    });
    setSelectedHegemonAttack({
      id: "",
      col: -2,
      row: -2,
    });
  };
  const attackWithHegemon = (
    hegemon: Hexagon,
    hegemons: Hegemon[],
    insurgents: Insurgent[]
  ) => {
    playSound(explosion);
    const newHegemons: Hegemon[] = JSON.parse(JSON.stringify(hegemons));
    const idx = newHegemons.findIndex((h) => areHexesEqual(h, hegemon));
    newHegemons[idx].moves = 0;

    // Attack the insurgents
    let newInsurgents: Insurgent[] = JSON.parse(JSON.stringify(insurgents));

    for (const insurgent of newInsurgents) {
      let isInRange = false;

      const neighbors: Array<Hegemon | Hexagon> = getHexNeighbors(
        hegemon,
        hegemons,
        config.board,
        false
      );
      neighbors.push(hegemon);
      for (const neighbor of neighbors) {
        if (isInsurgentAdjacentToHex(insurgent, neighbor)) {
          isInRange = true;
        }
      }

      if (isInRange) {
        insurgent.attacked += 1;
      }

      insurgent.willBeAttacked = false;
    }
    newInsurgents = newInsurgents.filter((ins) => {
      if (ins.orientation === "base" && ins.attacked >= 1) {
        return false;
      } else if (
        (ins.orientation === "down" || ins.orientation === "up") &&
        ins.attacked >= 2
      ) {
        return false;
      }
      return true;
    });
    const deadInsurgents = insurgents.length - newInsurgents.length;
    setInsurgents(newInsurgents);

    const newGame: Game = JSON.parse(JSON.stringify(game));
    newGame.deadInsurgents = game.deadInsurgents + deadInsurgents;
    if (newGame.deadInsurgents >= config.insurgentsToDie) {
      newGame.gameplayState = "hegemonWin";
    }
    setGame(newGame);

    // If round end
    if (newHegemons.find((h) => h.moves > 0) === undefined) {
      for (const heg of newHegemons) {
        heg.moves = 1;
      }

      if (newGame.deadInsurgents >= config.insurgentsToDie) {
        newGame.gameplayState = "hegemonWin";
      } else {
        newGame.gameplayState = "insurgentMove";
      }

      setGame(newGame);
    }

    setHegemons(newHegemons);
    setSelectedHegemonAttack({
      id: "",
      col: -2,
      row: -2,
    });
  };

  const placeHegemon = (hex: Hexagon, hegemons: Hegemon[]) => {
    const hegemon: Hegemon = {
      id: uuidv4(),
      col: hex.col,
      row: hex.row,
      moves: 1,
    };
    if (getCellValue(hex, config.board) === 1) {
      playSound(hegemonMoveWater);
    } else {
      playSound(hegemonMove);
    }

    const newHegemons: Hegemon[] = JSON.parse(JSON.stringify(hegemons));
    newHegemons.push(hegemon);

    setHegemons(newHegemons);

    const newGame: Game = JSON.parse(JSON.stringify(game));
    if (newHegemons.length === config.startHegemons) {
      playSound(roundEnd);
      newGame.gameplayState = "insurgentMove";
      setGame(newGame);
    }
  };
  return (
    <div
      onClick={() =>
        game.gameplayState === "hegemonMove"
          ? selectedHegemonAttack.col < 0
            ? moveHegemon(hex, hegemon, hegemons)
            : attackWithHegemon(hegemon, hegemons, insurgents)
          : placeHegemon(hex, hegemons)
      }
      onContextMenu={(e) => e.preventDefault()}
      className={
        selectedHegemonAttack.col < 0
          ? "hegemonMovementHex"
          : "hegemonAttackHex"
      }
      style={{
        position: "absolute",
        opacity: selectedHegemonAttack.col >= 0 ? "0.8" : "0.65",
        cursor: selectedHegemonAttack.col < 0 ? "pointer" : "crosshair",
        zIndex: 99,
        transform: "scale(" + scale + ")",
        left: 10.5 + hex.col * 60 + "px",
        top:
          hex.col % 2 === 0
            ? 48 + hex.row * 69.3 + "px"
            : 83 + hex.row * 69.3 + "px",
      }}
    >
      <div
        style={{
          float: "left",
          borderRight: "15px solid " + color,
          borderTop: "26px solid transparent",
          borderBottom: "26px solid transparent",
        }}
      />
      <div
        style={{
          float: "left",
          width: "30px",
          height: "52px",
          backgroundColor: color,
        }}
      />
      <div
        style={{
          float: "left",
          borderLeft: "15px solid " + color,
          borderTop: "26px solid transparent",
          borderBottom: "26px solid transparent",
        }}
      />
    </div>
  );
};
