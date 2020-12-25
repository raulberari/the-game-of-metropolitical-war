import { Dispatch, SetStateAction } from "react";
import { Point, Game, Insurgent, Config, Hegemon } from "./types";
import { PreviewPoint } from "./PreviewPoint";

export const PreviewInsurgentPlacement = (props: {
  points: Point[];
  insurgents: Insurgent[];
  setInsurgents: Dispatch<SetStateAction<Insurgent[]>>;
  hegemons: Hegemon[];
  setHegemons: Dispatch<SetStateAction<Hegemon[]>>;
  game: Game;
  setGame: Dispatch<SetStateAction<Game>>;
  setSelectedInsurgent: Dispatch<SetStateAction<Insurgent>>;
  config: Config;

  stepLand: HTMLAudioElement;
  roundEnd: HTMLAudioElement;
  stepTransport: HTMLAudioElement;
  hegemonDeath: HTMLAudioElement;
}) => {
  const {
    points,
    insurgents,
    setInsurgents,
    hegemons,
    setHegemons,
    game,
    setGame,
    setSelectedInsurgent,
    config,
    stepLand,
    roundEnd,
    stepTransport,
    hegemonDeath,
  } = props;

  const pointPreviews = points.map((point) => {
    return (
      <PreviewPoint
        point={point}
        // @ts-ignore
        insurgent={null}
        hegemons={hegemons}
        setHegemons={setHegemons}
        insurgents={insurgents}
        setInsurgents={setInsurgents}
        game={game}
        setGame={setGame}
        setSelectedInsurgent={setSelectedInsurgent}
        config={config}
        key={point.id}
        stepLand={stepLand}
        roundEnd={roundEnd}
        stepTransport={stepTransport}
        hegemonDeath={hegemonDeath}
      />
    );
  });

  return <div>{pointPreviews}</div>;
};
