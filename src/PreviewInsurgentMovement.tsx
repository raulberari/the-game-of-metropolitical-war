import React, { Dispatch, SetStateAction } from "react";
import { PreviewHeightMove } from "./PreviewHeightMove";
import { PreviewPoint } from "./PreviewPoint";
import { Point, Insurgent, Hegemon, Game, Config } from "./types";

export const PreviewInsurgentMovement = (props: {
  points: Point[];
  insurgent: Insurgent;
  hegemons: Hegemon[];
  setHegemons: Dispatch<SetStateAction<Hegemon[]>>;
  game: Game;
  setGame: Dispatch<SetStateAction<Game>>;
  insurgents: Insurgent[];
  setInsurgents: Dispatch<SetStateAction<Insurgent[]>>;
  setSelectedInsurgent: Dispatch<SetStateAction<Insurgent>>;
  config: Config;
}) => {
  const {
    points,
    insurgent,
    hegemons,
    setHegemons,
    game,
    setGame,
    insurgents,
    setInsurgents,
    setSelectedInsurgent,
    config,
  } = props;
  const pointPreviews = points.map((point) => (
    <PreviewPoint
      point={point}
      insurgent={insurgent}
      hegemons={hegemons}
      setHegemons={setHegemons}
      insurgents={insurgents}
      setInsurgents={setInsurgents}
      game={game}
      setGame={setGame}
      setSelectedInsurgent={setSelectedInsurgent}
      config={config}
      key={point.id}
    />
  ));

  return (
    <div>
      <PreviewHeightMove
        insurgent={insurgent}
        hegemons={hegemons}
        setHegemons={setHegemons}
        insurgents={insurgents}
        setInsurgents={setInsurgents}
        game={game}
        setGame={setGame}
        setSelectedInsurgent={setSelectedInsurgent}
        config={config}
      />
      {pointPreviews}
    </div>
  );
};
