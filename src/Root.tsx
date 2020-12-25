import React, { useState } from "react";
import { renderBoard } from ".";
import { Board } from "./Board";
import { Config, Game, Hegemon, Insurgent } from "./types";
import configFile from "./config/new-york.json";
//@ts-ignore
import backgroundMusicAudio from "./sounds/tears-in-rain.mp3";

const backgroundMusic = new Audio(backgroundMusicAudio);
backgroundMusic.volume = 0.2;
backgroundMusic.preload = "auto";
backgroundMusic.loop = true;
backgroundMusic.autoplay = true;

export const Root = () => {
  const [config, setConfig] = useState<Config>(configFile);
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

  const board = renderBoard(config, backgroundMusic);

  return (
    <div>
      {board}
      {element}
    </div>
  );
};
