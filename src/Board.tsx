/* eslint-disable jsx-a11y/alt-text */
import React, { MouseEvent, useState } from "react";
import { areHexesEqual, getAllHegemonPlaces, getHexNeighbors } from "./Hegemon";
import {
  arePointsEqual,
  getAllInsurgentsNeighbors,
  getInsurgentNeighbors,
  isInsurgentAdjacentToHex,
} from "./Insurgent";
import { PreviewHegemonPlacement } from "./PreviewHegemonPlacement";
import { PreviewHexes } from "./PreviewHexes";
import { PreviewInsurgentMovement } from "./PreviewInsurgentMovement";
import { PreviewInsurgentPlacement } from "./PreviewInsurgentPlacement";
import { Hegemon, Insurgent, Hexagon, Game, Config } from "./types";

import { InfoGameplay } from "./info-content/InfoGameplay";

import ReactDOM from "react-dom";

import { InfoIntelligence } from "./info-content/InfoIntelligence";
import { InfoWinning } from "./info-content/InfoWinning";
import { InfoHegemon } from "./info-content/InfoHegemon";
import { InfoInsurgents } from "./info-content/InfoInsurgents";
import { Settings } from "./Settings";

//@ts-ignore
import interfaceOpenAudio from "./sounds/interface-chirp-open.wav";
//@ts-ignore
import interfaceCloseAudio from "./sounds/interface-chirp-close.wav";
//@ts-ignore
import clickInfoMenuAudio from "./sounds/click-1.wav";
//@ts-ignore
import clickButtonAudio from "./sounds/click-2.wav";
//@ts-ignore
import roundEndAudio from "./sounds/beep-1.ogg";
//@ts-ignore
import streetAmbienceAudio from "./sounds/street.mp3";
//@ts-ignore
import clickInsurgentAudio from "./sounds/click-3.wav";
//@ts-ignore
import clickHegemonMoveAudio from "./sounds/click-4.wav";
//@ts-ignore
import clickHegemonAttackAudio from "./sounds/click-5.wav";
//@ts-ignore
import stepLandAudio from "./sounds/step-1.wav";
// @ts-ignore
import explosionAudio from "./sounds/explosion.wav";
// @ts-ignore
import hegemonMoveAudio from "./sounds/click-6.wav";
// @ts-ignore
import hegemonMoveWaterAudio from "./sounds/water.wav";
//@ts-ignore
import stepTransportAudio from "./sounds/step-2.wav";
//@ts-ignore
import hegemonDeathAudio from "./sounds/explosion-truck.wav";

const interfaceOpen = new Audio(interfaceOpenAudio);
const interfaceClose = new Audio(interfaceCloseAudio);
const clickInfoMenu = new Audio(clickInfoMenuAudio);
const clickButton = new Audio(clickButtonAudio);
const roundEnd = new Audio(roundEndAudio);
const clickHegemonAttack = new Audio(clickHegemonAttackAudio);
const stepLand = new Audio(stepLandAudio);

const streetAmbience = new Audio(streetAmbienceAudio);
streetAmbience.volume = 0.25;
streetAmbience.preload = "auto";
streetAmbience.loop = true;

const soundEffects: HTMLAudioElement[] = [];
const volumes: number[] = [];
soundEffects.push(interfaceOpen);
soundEffects.push(interfaceClose);
soundEffects.push(clickInfoMenu);
soundEffects.push(clickButton);
soundEffects.push(roundEnd);
soundEffects.push(clickHegemonAttack);
soundEffects.push(stepLand);

for (const effect of soundEffects) {
  effect.volume = 0.15;
  effect.preload = "auto";
}

const clickInsurgent = new Audio(clickInsurgentAudio);
clickInsurgent.volume = 0.5;
clickInsurgent.preload = "auto";
const clickHegemonMove = new Audio(clickHegemonMoveAudio);
clickHegemonMove.volume = 0.07;
clickHegemonMove.preload = "auto";
const explosion = new Audio(explosionAudio);
explosion.volume = 0.05;
explosion.preload = "auto";
const hegemonMove = new Audio(hegemonMoveAudio);
hegemonMove.volume = 0.15;
hegemonMove.preload = "auto";
const hegemonMoveWater = new Audio(hegemonMoveWaterAudio);
hegemonMoveWater.volume = 0.4;
hegemonMoveWater.preload = "auto";
const stepTransport = new Audio(stepTransportAudio);
stepTransport.volume = 1;
stepTransport.preload = "auto";
const hegemonDeath = new Audio(hegemonDeathAudio);
hegemonDeath.volume = 0.08;
hegemonDeath.preload = "auto";

soundEffects.push(clickInsurgent);
soundEffects.push(clickHegemonMove);
soundEffects.push(explosion);
soundEffects.push(hegemonMove);
soundEffects.push(hegemonMoveWater);
soundEffects.push(stepTransport);
soundEffects.push(hegemonDeath);

for (const effect of soundEffects) {
  volumes.push(effect.volume);
}

export const playSound = (sound: HTMLAudioElement) => {
  sound.currentTime = 0;
  sound.play();
};

export const Board = (props: {
  hegemons: Hegemon[];
  insurgents: Insurgent[];
  game: Game;
  config: Config;
  backgroundMusic: HTMLAudioElement;
}) => {
  const emptyInsurgent: Insurgent = {
    id: "",
    hex1: { id: "", col: -1, row: -1 },
    hex2: { id: "", col: -1, row: -1 },
    hex3: { id: "", col: -1, row: -1 },
    orientation: "base",
    willBeAttacked: false,
    attacked: 0,
    moves: 0,
  };

  const [hegemons, setHegemons] = useState(props.hegemons);
  const [insurgents, setInsurgents] = useState(props.insurgents);
  const [game, setGame] = useState<Game>(props.game);
  const [infoMenu, setInfoMenu] = useState<
    "intelligence" | "gameplay" | "hegemon" | "insurgents" | "winning"
  >("intelligence");
  const [config, setConfig] = useState<Config>(props.config);
  const [
    selectedHegemonMovement,
    setSelectedHegemonMovement,
  ] = useState<Hexagon>({
    id: "",
    col: -1,
    row: -1,
  });
  const [selectedHegemonAttack, setSelectedHegemonAttack] = useState<Hexagon>({
    id: "",
    col: -2,
    row: -2,
  });
  const [selectedInsurgent, setSelectedInsurgent] = useState<Insurgent>(
    emptyInsurgent
  );

  const infoMenuToComponent = {
    intelligence: <InfoIntelligence city={config.title} />,
    gameplay: <InfoGameplay />,
    hegemon: <InfoHegemon />,
    insurgents: <InfoInsurgents />,
    winning: <InfoWinning />,
  };

  const showHegemonMovement = (e: MouseEvent, hegemon: Hegemon) => {
    e.preventDefault();
    if (game.gameplayState === "hegemonMove" && hegemon.moves > 0) {
      playSound(clickHegemonMove);
      if (areHexesEqual(hegemon, selectedHegemonMovement)) {
        setSelectedHegemonMovement({
          id: "",
          col: -1,
          row: -1,
        });
      } else {
        setSelectedHegemonMovement(hegemon);
        setSelectedHegemonAttack({
          id: "",
          col: -2,
          row: -2,
        });
        const newInsurgents: Insurgent[] = JSON.parse(
          JSON.stringify(insurgents)
        );
        for (let idx = 0; idx < newInsurgents.length; idx++) {
          newInsurgents[idx].willBeAttacked = false;
        }
        setInsurgents(newInsurgents);
      }
    }
  };

  const showHegemonAttack = (e: MouseEvent, hegemon: Hegemon) => {
    e.preventDefault();
    if (game.gameplayState === "hegemonMove" && hegemon.moves > 0) {
      playSound(clickHegemonAttack);
      if (areHexesEqual(hegemon, selectedHegemonAttack)) {
        setSelectedHegemonAttack({
          id: "",
          col: -2,
          row: -2,
        });

        const newInsurgents: Insurgent[] = JSON.parse(
          JSON.stringify(insurgents)
        );
        for (let idx = 0; idx < newInsurgents.length; idx++) {
          newInsurgents[idx].willBeAttacked = false;
        }
        setInsurgents(newInsurgents);
      } else {
        setSelectedHegemonAttack(hegemon);
        setSelectedHegemonMovement({
          id: "",
          col: -1,
          row: -1,
        });
        const newInsurgents: Insurgent[] = JSON.parse(
          JSON.stringify(insurgents)
        );
        for (const insurgent of insurgents) {
          let isInRange = false;

          const neighbors: Hegemon[] = getHexNeighbors(
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
            const idx = insurgents.indexOf(insurgent);
            newInsurgents[idx].willBeAttacked = true;
          }
        }

        setInsurgents(newInsurgents);
      }
    }
  };

  const showInsurgentMovement = (insurgent: Insurgent) => {
    if (game.gameplayState === "insurgentMove" && insurgent.moves > 0) {
      playSound(clickInsurgent);
      if (arePointsEqual(insurgent, selectedInsurgent)) {
        setSelectedInsurgent(emptyInsurgent);
      } else {
        setSelectedInsurgent(insurgent);
      }
    }
  };

  const startGame = () => {
    playSound(clickButton);
    playSound(streetAmbience);

    closeInfo();
    closeSettings();

    const newGame: Game = JSON.parse(JSON.stringify(game));
    newGame.gameplayState = "insurgentStart";
    setGame(newGame);
  };

  const restartGame = () => {
    playSound(roundEnd);
    const newGame: Game = JSON.parse(JSON.stringify(game));
    newGame.gameplayState = "preStart";
    newGame.deadInsurgents = 0;
    newGame.deadHegemons = 0;
    setGame(newGame);
    setInsurgents([]);
    setHegemons([]);
  };

  const closeInfo = () => {
    const info = document.getElementById("info")!;
    const settings = document.getElementById("settings")!;
    const body = document.getElementsByTagName("body")![0];

    if (info.style.display !== "none") {
      if (settings.style.display === "none") {
        playSound(interfaceClose);
        body.style.overflow = "auto";
      }

      setInfoMenu("intelligence");

      document.getElementById("intelligenceButton")!.style.borderBottom =
        "2px solid white";
      document.getElementById("gameplayButton")!.style.borderBottom =
        "transparent";
      document.getElementById("hegemonButton")!.style.borderBottom =
        "transparent";
      document.getElementById("insurgentsButton")!.style.borderBottom =
        "transparent";
      document.getElementById("winningButton")!.style.borderBottom =
        "transparent";
    }
    info.style.display = "none";
  };

  const openInfo = () => {
    const info = document.getElementById("info")!;
    const settings = document.getElementById("settings")!;
    const body = document.getElementsByTagName("body")![0];

    if (info.style.display === "flex") {
      playSound(interfaceClose);
      closeInfo();
    } else {
      playSound(interfaceOpen);
      info.style.display = "flex";
      body.style.overflow = "hidden";
      info.focus();
      info.scrollTop = 0;
    }

    if (settings.style.display === "flex") {
      closeSettings();
    }
  };

  const changeInfoMenu = (
    menu: "intelligence" | "gameplay" | "hegemon" | "insurgents" | "winning"
  ) => {
    setInfoMenu(menu);
    clickInfoMenu.currentTime = 0;
    playSound(clickInfoMenu);

    const info = document.getElementById("info")!;
    const oldScrollValue = info.scrollTop;
    document.getElementById("infoContentContainer")!.scrollIntoView();
    info.scrollTop -= 30;

    if (info.scrollTop > oldScrollValue) {
      info.scrollTop = oldScrollValue;
    }

    document.getElementById("intelligenceButton")!.style.borderBottom =
      "transparent";
    document.getElementById("gameplayButton")!.style.borderBottom =
      "transparent";
    document.getElementById("hegemonButton")!.style.borderBottom =
      "transparent";
    document.getElementById("insurgentsButton")!.style.borderBottom =
      "transparent";
    document.getElementById("winningButton")!.style.borderBottom =
      "transparent";
    document.getElementById(menu + "Button")!.style.borderBottom =
      "2px solid white";
  };

  const closeSettings = () => {
    const settings = document.getElementById("settings")!;
    const info = document.getElementById("info")!;
    const body = document.getElementsByTagName("body")![0];

    if (settings.style.display !== "none") {
      if (info.style.display === "none") {
        playSound(interfaceClose);
        body.style.overflow = "auto";
      }
    }

    settings.style.display = "none";
  };

  const openSettings = () => {
    const settings = document.getElementById("settings")!;
    const info = document.getElementById("info")!;
    const body = document.getElementsByTagName("body")![0];

    if (settings.style.display === "flex") {
      playSound(interfaceClose);
      closeSettings();
    } else {
      playSound(interfaceOpen);
      settings.style.display = "flex";
      body.style.overflow = "hidden";
      settings.focus();
    }
    if (info.style.display === "flex") {
      closeInfo();
    }
  };

  const changeWhoMoves = () => {
    if (game.gameplayState === "insurgentMove") {
      playSound(clickButton);
      endInsurgentsRound();
      const newGame: Game = JSON.parse(JSON.stringify(game));
      newGame.gameplayState = "insurgentPlace";
      setGame(newGame);
    } else if (game.gameplayState === "hegemonMove") {
      playSound(roundEnd);
      endHegemonRound();
      const newGame: Game = JSON.parse(JSON.stringify(game));
      newGame.gameplayState = "insurgentMove";
      setGame(newGame);
    }
  };

  const endInsurgentsRound = () => {
    const newInsurgents: Insurgent[] = JSON.parse(JSON.stringify(insurgents));
    for (const ins of newInsurgents) {
      ins.attacked = 0;
    }
    for (const ins of newInsurgents) {
      ins.moves = config.insurgentMoves;
    }
    setInsurgents(newInsurgents);

    setSelectedInsurgent(emptyInsurgent);
  };

  const endHegemonRound = () => {
    const newHegemons: Hegemon[] = JSON.parse(JSON.stringify(hegemons));
    for (const heg of newHegemons) {
      heg.moves = config.hegemonMoves;
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

  // useEffect(() => {}, [hegemons]);

  const hegemonPieces = hegemons.map((hegemon, index) => {
    const topExtra = 65;
    return (
      <img
        src={process.env.PUBLIC_URL + "/images/hegemon-3d-blue.png"}
        key={hegemon.id}
        className={
          hegemon.moves > 0 && game.gameplayState === "hegemonMove"
            ? "hegemonPiece"
            : "hegemonPieceUnmovable"
        }
        style={{
          position: "absolute",
          left:
            areHexesEqual(hegemon, selectedHegemonMovement) ||
            areHexesEqual(hegemon, selectedHegemonAttack)
              ? 17 + hegemon.col * 60.1 + "px"
              : 15 + hegemon.col * 60.1 + "px",
          top:
            hegemon.col % 2 === 0
              ? areHexesEqual(hegemon, selectedHegemonMovement) ||
                areHexesEqual(hegemon, selectedHegemonAttack)
                ? topExtra - 27 + hegemon.row * 69.3 + "px"
                : topExtra - 32 + hegemon.row * 69.3 + "px"
              : areHexesEqual(hegemon, selectedHegemonMovement) ||
                areHexesEqual(hegemon, selectedHegemonAttack)
              ? topExtra + 5 + hegemon.row * 69.3 + "px"
              : topExtra + hegemon.row * 69.3 + "px",
          width:
            areHexesEqual(hegemon, selectedHegemonMovement) ||
            areHexesEqual(hegemon, selectedHegemonAttack)
              ? "45px"
              : "50px",
          zIndex:
            game.gameplayState === "hegemonMove" ||
            game.gameplayState === "hegemonStart"
              ? 100
              : 99,
          cursor:
            game.gameplayState !== "hegemonMove"
              ? "default"
              : hegemon.moves > 0
              ? "pointer"
              : 'url("' +
                process.env.PUBLIC_URL +
                '/images/x-cursor.png"), auto',
          opacity:
            areHexesEqual(hegemon, selectedHegemonMovement) ||
            areHexesEqual(hegemon, selectedHegemonAttack)
              ? 0.8
              : 1,
        }}
        onClick={(e) => showHegemonMovement(e, hegemon)}
        onContextMenu={(e) => showHegemonAttack(e, hegemon)}
      />
    );
  });

  const insurgentPieces = insurgents.map((insurgent, index) => {
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

    // const avgCol = Math.round(
    //   (insurgent.hex1.col + insurgent.hex2.col + insurgent.hex3.col) / 3
    // );
    const avgRow = Math.round(
      (insurgent.hex1.row + insurgent.hex2.row + insurgent.hex3.row) / 3
    );

    switch (insurgent.orientation) {
      case "base":
        return (
          <div>
            <img
              src={process.env.PUBLIC_URL + "/images/insurgent-1-3d.png"}
              key={insurgent.id}
              style={{
                position: "absolute",
                left: avgRow % 2 === 0 ? 15 + left + "px" : 19 + left + "px",
                top: arePointsEqual(insurgent, selectedInsurgent)
                  ? 16 + top + "px"
                  : 15 + top + "px",
                width: arePointsEqual(insurgent, selectedInsurgent)
                  ? "17px"
                  : "20px",
                zIndex: 99,
                opacity: insurgent.willBeAttacked
                  ? 0.7
                  : arePointsEqual(insurgent, selectedInsurgent)
                  ? 0.8
                  : 1,

                cursor:
                  game.gameplayState !== "insurgentMove"
                    ? "default"
                    : insurgent.moves > 0
                    ? "pointer"
                    : "default",
              }}
              onClick={() => showInsurgentMovement(insurgent)}
            />
            {game.gameplayState === "insurgentMove" && insurgent.moves > 0 ? (
              <img
                src={
                  insurgent.moves > 3
                    ? process.env.PUBLIC_URL + "/images/moves-3.png"
                    : process.env.PUBLIC_URL +
                      "/images/moves-" +
                      insurgent.moves +
                      ".png"
                }
                style={{
                  position: "absolute",
                  left: avgRow % 2 === 0 ? 15 + left + "px" : 19 + left + "px",
                  top: 37 + top + "px",
                  width: "20px",
                  zIndex: 99,
                  opacity:
                    insurgent.willBeAttacked && insurgent.attacked === 1
                      ? 0.7
                      : 1,
                }}
              />
            ) : null}
          </div>
        );
      case "up":
        return (
          <div>
            <img
              src={process.env.PUBLIC_URL + "/images/insurgent-2-3d.png"}
              key={insurgent.id}
              style={{
                position: "absolute",
                left: arePointsEqual(insurgent, selectedInsurgent)
                  ? 17 + left + "px"
                  : 16 + left + "px",
                top: arePointsEqual(insurgent, selectedInsurgent)
                  ? 13 + top + "px"
                  : 12 + top + "px",
                width: arePointsEqual(insurgent, selectedInsurgent)
                  ? "19px"
                  : "22px",
                zIndex: 99,
                opacity:
                  insurgent.willBeAttacked && insurgent.attacked === 1
                    ? 0.7
                    : arePointsEqual(insurgent, selectedInsurgent)
                    ? 0.8
                    : 1,
                cursor:
                  game.gameplayState !== "insurgentMove"
                    ? "default"
                    : insurgent.moves > 0
                    ? "pointer"
                    : "default",
              }}
              onClick={() => showInsurgentMovement(insurgent)}
            />
            {game.gameplayState === "insurgentMove" && insurgent.moves > 0 ? (
              <img
                src={
                  insurgent.moves > 3
                    ? process.env.PUBLIC_URL + "/images/moves-3.png"
                    : process.env.PUBLIC_URL +
                      "/images/moves-" +
                      insurgent.moves +
                      ".png"
                }
                style={{
                  position: "absolute",
                  left: avgRow % 2 === 0 ? 17 + left + "px" : 17 + left + "px",
                  top: 34 + top + "px",
                  width: "20px",
                  zIndex: 99,
                  opacity:
                    insurgent.willBeAttacked && insurgent.attacked === 1
                      ? 0.7
                      : 1,
                }}
              />
            ) : null}
          </div>
        );
      case "down":
        return (
          <div>
            <img
              src={process.env.PUBLIC_URL + "/images/insurgent-3-3d.png"}
              key={insurgent.id}
              style={{
                position: "absolute",
                left: arePointsEqual(insurgent, selectedInsurgent)
                  ? 17 + left + "px"
                  : avgRow % 2 === 0
                  ? 16 + left + "px"
                  : 16 + left + "px",
                top: 15 + top + "px",
                width: arePointsEqual(insurgent, selectedInsurgent)
                  ? "17px"
                  : "20px",
                zIndex: 99,
                opacity:
                  insurgent.willBeAttacked && insurgent.attacked === 1
                    ? 0.7
                    : arePointsEqual(insurgent, selectedInsurgent)
                    ? 0.8
                    : 1,
                cursor:
                  game.gameplayState !== "insurgentMove"
                    ? "default"
                    : insurgent.moves > 0
                    ? "pointer"
                    : "default",
              }}
              onClick={() => showInsurgentMovement(insurgent)}
            />
            {game.gameplayState === "insurgentMove" && insurgent.moves > 0 ? (
              <img
                src={
                  insurgent.moves > 3
                    ? process.env.PUBLIC_URL + "/images/moves-3.png"
                    : process.env.PUBLIC_URL +
                      "/images/moves-" +
                      insurgent.moves +
                      ".png"
                }
                style={{
                  position: "absolute",
                  left: avgRow % 2 === 0 ? 17 + left + "px" : 17 + left + "px",
                  top: 37 + top + "px",
                  width: "20px",
                  zIndex: 99,
                  opacity:
                    insurgent.willBeAttacked && insurgent.attacked === 1
                      ? 0.7
                      : 1,
                }}
              />
            ) : null}
          </div>
        );
      default:
        return <img></img>;
    }
  });

  const stateDictionary = {
    preStart: "Start Game",
    insurgentStart: "Place Insurgents",
    hegemonStart: "Place Hegemon",
    insurgentMove: "Insurgent",
    insurgentPlace: "Place Insurgent",
    hegemonMove: "Hegemon",
    insurgentWin: "Insurgents Win",
    hegemonWin: "The Hegemon Wins",
  };

  ReactDOM.render(
    <Settings
      closeSettings={closeSettings}
      config={config}
      setConfig={setConfig}
      sfx={soundEffects}
      sfxVolumes={volumes}
      ambientSound={streetAmbience}
      backgroundMusic={props.backgroundMusic}
    />,
    document.getElementById("settings")
  );

  document.getElementById("closeInfo")!.onclick = closeInfo;
  document.getElementById("infoButton")!.onclick = openInfo;
  document.getElementById("restartGameButton")!.onclick = restartGame;

  document.getElementById("settingsButton")!.onclick = openSettings;

  document.getElementById("boardContainer")!.onclick = () => {
    closeInfo();
    closeSettings();
  };
  document.getElementsByTagName("body")![0].onkeydown = (ev) => {
    if (ev.key === "Escape") {
      if (document.getElementById("info")!.style.display === "flex") {
        closeInfo();
      } else if (
        document.getElementById("settings")!.style.display === "flex"
      ) {
        closeSettings();
      } else if (
        game.gameplayState === "hegemonMove" ||
        game.gameplayState === "insurgentMove"
      ) {
        changeWhoMoves();
      }
    }
    if (ev.key === "i") {
      openInfo();
    }
    if (ev.key === "p") {
      openSettings();
    }
  };

  // info menu
  document.getElementById("intelligenceButton")!.style.borderBottom =
    "2px solid white";
  document.getElementById("intelligenceButton")!.onclick = () =>
    changeInfoMenu("intelligence");
  document.getElementById("gameplayButton")!.onclick = () =>
    changeInfoMenu("gameplay");
  document.getElementById("hegemonButton")!.onclick = () =>
    changeInfoMenu("hegemon");
  document.getElementById("insurgentsButton")!.onclick = () =>
    changeInfoMenu("insurgents");
  document.getElementById("winningButton")!.onclick = () =>
    changeInfoMenu("winning");

  if (infoMenu !== "intelligence") {
    document.getElementById(
      "infoMenuTitle"
    )!.innerHTML = infoMenu.toUpperCase();
  } else {
    document.getElementById("infoMenuTitle")!.innerHTML =
      config.title + " " + config.year;
  }
  ReactDOM.render(
    infoMenuToComponent[infoMenu],
    document.getElementById("infoContent")
  );

  document.getElementById("startGame")!.onclick = startGame;
  document.getElementById("startGame")!.style.display =
    game.gameplayState !== "preStart" ? "none" : "block";

  document.getElementById("whoMoves")!.innerHTML =
    stateDictionary[game.gameplayState];
  document.getElementById("whoMoves")!.style.display =
    game.gameplayState === "preStart" ? "none" : "block";

  document.getElementById("endRound")!.style.display =
    game.gameplayState === "insurgentMove" ||
    game.gameplayState === "hegemonMove"
      ? "block"
      : "none";
  document.getElementById("endRound")!.onclick = changeWhoMoves;

  document.getElementById("gameStatsAlive")!.style.display =
    game.gameplayState === "hegemonStart" ||
    game.gameplayState === "insurgentStart" ||
    game.gameplayState === "preStart"
      ? "none"
      : "flex";
  document.getElementById("gameStatsDead")!.style.display =
    game.gameplayState === "hegemonStart" ||
    game.gameplayState === "insurgentStart" ||
    game.gameplayState === "preStart"
      ? "none"
      : "flex";
  document.getElementById("aliveInsurgents")!.innerHTML =
    "Alive Insurgents: " + insurgents.length;
  document.getElementById("aliveHegemons")!.innerHTML =
    "Alive Hegemons: " + hegemons.length;
  document.getElementById("deadInsurgents")!.innerHTML =
    "Dead Insurgents: " + game.deadInsurgents;
  document.getElementById("deadHegemons")!.innerHTML =
    "Dead Hegemons: " + game.deadHegemons;

  if (
    game.gameplayState === "hegemonMove" ||
    game.gameplayState === "hegemonStart" ||
    game.gameplayState === "hegemonWin"
  ) {
    document.getElementById("statusbar")!.style.backgroundColor =
      "rgb(58, 76, 105)";
    document.getElementById("statusbar")!.style.color = "white";
    document.getElementById("endRound")!.style.backgroundColor =
      "rgb(36, 46, 64)";
    document.getElementById("infoButton")!.style.color = "white";
    document.getElementById("settingsButton")!.style.color = "white";
    document.getElementById("restartGameButton")!.style.color = "white";
  } else {
    document.getElementById("statusbar")!.style.backgroundColor =
      "rgb(217, 196, 196)";
    document.getElementById("statusbar")!.style.color = "black";
    document.getElementById("endRound")!.style.backgroundColor =
      "rgb(238, 77, 47)";
    document.getElementById("infoButton")!.style.color = "black";
    document.getElementById("settingsButton")!.style.color = "black";
    document.getElementById("restartGameButton")!.style.color = "black";
  }

  return (
    <div>
      {/* Hegemon movement preview */}
      <PreviewHexes
        hexes={getHexNeighbors(
          selectedHegemonMovement,
          hegemons,
          config.board,
          true
        )}
        hegemon={selectedHegemonMovement}
        hegemons={hegemons}
        setHegemons={setHegemons}
        selectedHegemonAttack={selectedHegemonAttack}
        setSelectedHegemonMovement={setSelectedHegemonMovement}
        setSelectedHegemonAttack={setSelectedHegemonAttack}
        insurgents={insurgents}
        setInsurgents={setInsurgents}
        game={game}
        setGame={setGame}
        config={config}
        color="#438ef4"
        explosion={explosion}
        hegemonMove={hegemonMove}
        hegemonMoveWater={hegemonMoveWater}
        roundEnd={roundEnd}
      />
      {/* Hegemon attack preview*/}
      <PreviewHexes
        hexes={getHexNeighbors(
          selectedHegemonAttack,
          hegemons,
          config.board,
          false
        )}
        hegemon={selectedHegemonAttack}
        hegemons={hegemons}
        setHegemons={setHegemons}
        selectedHegemonAttack={selectedHegemonAttack}
        setSelectedHegemonMovement={setSelectedHegemonMovement}
        setSelectedHegemonAttack={setSelectedHegemonAttack}
        insurgents={insurgents}
        setInsurgents={setInsurgents}
        game={game}
        setGame={setGame}
        config={config}
        color="red"
        explosion={explosion}
        hegemonMove={hegemonMove}
        hegemonMoveWater={hegemonMoveWater}
        roundEnd={roundEnd}
      />
      {/* Insurgent movement preview */}
      {game.gameplayState === "insurgentMove" ? (
        <PreviewInsurgentMovement
          points={getInsurgentNeighbors(
            selectedInsurgent,
            insurgents,
            config.board
          )}
          insurgent={selectedInsurgent}
          hegemons={hegemons}
          setHegemons={setHegemons}
          insurgents={insurgents}
          setInsurgents={setInsurgents}
          game={game}
          setGame={setGame}
          setSelectedInsurgent={setSelectedInsurgent}
          config={config}
          stepLand={stepLand}
          roundEnd={roundEnd}
          stepTransport={stepTransport}
          hegemonDeath={hegemonDeath}
        />
      ) : null}

      {/* Insurgent placement preview */}
      {game.gameplayState === "insurgentStart" ||
      game.gameplayState === "insurgentPlace" ? (
        <PreviewInsurgentPlacement
          points={getAllInsurgentsNeighbors(insurgents, props.config.board)}
          insurgents={insurgents}
          setInsurgents={setInsurgents}
          hegemons={hegemons}
          setHegemons={setHegemons}
          game={game}
          setGame={setGame}
          setSelectedInsurgent={setSelectedInsurgent}
          config={config}
          stepLand={stepLand}
          roundEnd={roundEnd}
          stepTransport={stepTransport}
          hegemonDeath={hegemonDeath}
        />
      ) : null}

      {/* Hegemon placement preview */}
      {game.gameplayState === "hegemonStart" ? (
        <PreviewHegemonPlacement
          hexes={getAllHegemonPlaces(hegemons, insurgents, props.config.board)}
          hegemons={hegemons}
          setHegemons={setHegemons}
          insurgents={insurgents}
          setInsurgents={setInsurgents}
          game={game}
          setGame={setGame}
          config={config}
          color="#438ef4"
          explosion={explosion}
          hegemonMove={hegemonMove}
          hegemonMoveWater={hegemonMoveWater}
          roundEnd={roundEnd}
        />
      ) : null}

      {hegemonPieces}
      {insurgentPieces}
    </div>
  );
};
