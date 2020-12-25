import { Dispatch, SetStateAction } from "react";
import {
  arePointsEqual,
  isPointBetweenThreeHegemons,
  isPointOnRails,
} from "./Insurgent";
import { Point, Insurgent, Hegemon, Game, Config } from "./types";
import { v4 as uuidv4 } from "uuid";
import { areHexesEqual, getHegemonGroup, getHexPoints } from "./Hegemon";

import { playSound } from "./Board";

export const PreviewPoint = (props: {
  point: Point;
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
  stepTransport: HTMLAudioElement;
  hegemonDeath: HTMLAudioElement;
  roundEnd: HTMLAudioElement;
}) => {
  const {
    point,
    insurgent,
    hegemons,
    setHegemons,
    game,
    setGame,
    insurgents,
    setInsurgents,
    setSelectedInsurgent,
    config,
    stepLand,
    stepTransport,
    hegemonDeath,
    roundEnd,
  } = props;

  const moveInsurgent = (
    point: Point,
    insurgent: Insurgent,
    insurgents: Insurgent[]
  ) => {
    const newInsurgents: Insurgent[] = JSON.parse(JSON.stringify(insurgents));
    const idx = newInsurgents.findIndex((p) => arePointsEqual(p, insurgent));
    newInsurgents[idx].hex1 = point.hex1;
    newInsurgents[idx].hex2 = point.hex2;
    newInsurgents[idx].hex3 = point.hex3;

    // Change orientation if on rails
    if (isPointOnRails(point, config.board)) {
      newInsurgents[idx].orientation = "base";
      playSound(stepTransport);
    } else {
      playSound(stepLand);
    }

    newInsurgents[idx].moves -= point.distance;

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

  const placeInsurgent = (
    point: Point,
    insurgents: Insurgent[],
    hegemons: Hegemon[]
  ) => {
    const insurgent: Insurgent = {
      id: uuidv4(),
      hex1: JSON.parse(JSON.stringify(point.hex1)),
      hex2: JSON.parse(JSON.stringify(point.hex2)),
      hex3: JSON.parse(JSON.stringify(point.hex3)),
      orientation: "base",
      willBeAttacked: false,
      attacked: 0,
      moves: config.insurgentMoves,
    };
    // Change orientation if on rails
    if (isPointOnRails(point, config.board)) {
      playSound(stepTransport);
    } else {
      playSound(stepLand);
    }

    const newInsurgents: Insurgent[] = JSON.parse(JSON.stringify(insurgents));
    newInsurgents.push(insurgent);
    setInsurgents(newInsurgents);

    const newGame: Game = JSON.parse(JSON.stringify(game));
    if (game.gameplayState === "insurgentStart") {
      if (newInsurgents.length >= config.startInsurgents) {
        playSound(roundEnd);
        newGame.gameplayState = "hegemonStart";
        setGame(newGame);
      }
    } else if (game.gameplayState === "insurgentPlace") {
      // Check if a hegemon died
      // SIMPLE implementation, checking each of them individually
      const toDelete: Hegemon[] = [];

      // Correct implementation would be
      // for each hegemon, compute its adjacent hegemon group
      // for the respective group, compute its adjacent points
      // by computing the set of adjacent points of each hex, minus
      // the ones which are determined by 3 hegemon hexes
      // the resulting adjacent points are the contour
      for (const heg of hegemons) {
        const group: Hegemon[] = getHegemonGroup(
          heg,
          hegemons,
          [],
          config.board
        );

        const points: Point[] = [];
        for (const h of group) {
          const hPoints: Point[] = getHexPoints(h);

          for (const hPoint of hPoints) {
            let exists = false;
            for (const point of points) {
              if (arePointsEqual(hPoint, point)) {
                exists = true;
                break;
              }
            }
            if (!exists) {
              if (!isPointBetweenThreeHegemons(hPoint, hegemons)) {
                points.push(hPoint);
              }
            }
          }
        }
        let markGroupForDeletion = true;
        for (const point of points) {
          let exists = false;
          for (const ins of newInsurgents) {
            if (arePointsEqual(ins, point)) {
              exists = true;
              break;
            }
          }
          if (!exists) {
            markGroupForDeletion = false;
          }
        }
        if (markGroupForDeletion) {
          for (const heg of group) {
            let exists = false;
            for (const h of toDelete) {
              if (areHexesEqual(h, heg)) {
                exists = true;
                break;
              }
            }
            if (!exists) {
              toDelete.push(heg);
            }
          }
        }
      }

      hegemons = hegemons.filter((heg) => !toDelete.includes(heg));
      let newHegemons: Hegemon[] = JSON.parse(JSON.stringify(hegemons));
      setHegemons(newHegemons);

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

      // Play the sounds
      if (toDelete.length > 0) {
        playSound(hegemonDeath);
      }
      playSound(roundEnd);

      // Set the game state
      newGame.deadHegemons = game.deadHegemons + toDelete.length;

      if (newGame.deadHegemons >= config.hegemonsToDie) {
        newGame.gameplayState = "insurgentWin";
      } else {
        newGame.gameplayState = "hegemonMove";
      }
      setGame(newGame);
    }
  };

  let top = 0;
  top += (point.hex1.col % 2 === 0 ? 50 : 84.65) + point.hex1.row * 69.3;
  top += (point.hex2.col % 2 === 0 ? 50 : 84.65) + point.hex2.row * 69.3;
  top += (point.hex3.col % 2 === 0 ? 50 : 84.65) + point.hex3.row * 69.3;
  top /= 3;

  let left = 0;
  left += 14 + point.hex1.col * 60.1;
  left += 14 + point.hex2.col * 60.1;
  left += 14 + point.hex3.col * 60.1;
  left /= 3;
  const avgRow = Math.round(
    (point.hex1.row + point.hex2.row + point.hex3.row) / 3
  );
  return (
    <div
      className="previewPoint"
      style={{
        width: "10px",
        height: "10px",
        position: "absolute",
        borderRadius: "10px",
        borderStyle: "solid",
        borderColor: "#e64e4e",
        backgroundColor: "#e64e4e",
        opacity: "0.6",
        cursor: "pointer",
        zIndex: 100,
        left: avgRow % 2 === 0 ? 19 + left + "px" : 19 + left + "px",
        top: 17 + top + "px",
      }}
      onClick={() =>
        game.gameplayState === "insurgentMove"
          ? moveInsurgent(point, insurgent, insurgents)
          : placeInsurgent(point, insurgents, hegemons)
      }
    />
  );
};
