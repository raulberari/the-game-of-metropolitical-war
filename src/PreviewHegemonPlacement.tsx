import React, { Dispatch, SetStateAction } from "react";
import { PreviewHex } from "./PreviewHex";
import { Config, Game, Hegemon, Hexagon, Insurgent } from "./types";

export const PreviewHegemonPlacement = (props: {
  hexes: Hexagon[];
  hegemons: Hegemon[];
  setHegemons: Dispatch<SetStateAction<Hegemon[]>>;
  insurgents: Insurgent[];
  setInsurgents: Dispatch<SetStateAction<Insurgent[]>>;
  game: Game;
  setGame: Dispatch<SetStateAction<Game>>;
  config: Config;
  color: string;
  explosion: HTMLAudioElement;
  hegemonMove: HTMLAudioElement;
  hegemonMoveWater: HTMLAudioElement;
  roundEnd: HTMLAudioElement;
}) => {
  const {
    hexes,
    hegemons,
    setHegemons,
    insurgents,
    setInsurgents,
    game,
    setGame,
    config,
    color,
    explosion,
    hegemonMove,
    hegemonMoveWater,
    roundEnd,
  } = props;

  const emptyHegemon = {
    id: "",
    col: -2,
    row: -2,
  };
  const hexPreviews = hexes.map((hex) => (
    <PreviewHex
      hex={hex}
      // @ts-ignore
      hegemon={null}
      hegemons={hegemons}
      setHegemons={setHegemons}
      color={color}
      scale={1}
      selectedHegemonAttack={emptyHegemon}
      // @ts-ignore
      setSelectedHegemonMovement={null}
      // @ts-ignore
      setSelectedHegemonAttack={null}
      insurgents={insurgents}
      setInsurgents={setInsurgents}
      game={game}
      setGame={setGame}
      config={config}
      key={hex.id}
      explosion={explosion}
      hegemonMove={hegemonMove}
      hegemonMoveWater={hegemonMoveWater}
      roundEnd={roundEnd}
    />
  ));

  return (
    <div
      className={"previewHexes"}
      style={{
        opacity: "0.5",
      }}
    >
      {hexPreviews}
    </div>
  );
};
