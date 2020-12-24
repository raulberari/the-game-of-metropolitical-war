import { Dispatch, SetStateAction } from "react";
import { PreviewHex } from "./PreviewHex";
import { Hexagon, Hegemon, Insurgent, Game, Config } from "./types";

export const PreviewHexes = (props: {
  hexes: Hexagon[];
  hegemon: Hexagon;
  hegemons: Hegemon[];
  setHegemons: Dispatch<SetStateAction<Hegemon[]>>;
  selectedHegemonAttack: Hexagon;
  setSelectedHegemonMovement: Dispatch<SetStateAction<Hexagon>>;
  setSelectedHegemonAttack: Dispatch<SetStateAction<Hexagon>>;
  game: Game;
  setGame: Dispatch<SetStateAction<Game>>;
  insurgents: Insurgent[];
  setInsurgents: Dispatch<SetStateAction<Insurgent[]>>;
  config: Config;
  color: string;
}) => {
  const {
    hexes,
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
    color,
  } = props;
  const hexPreviews = hexes.map((hex) => (
    <PreviewHex
      hex={hex}
      hegemon={hegemon}
      hegemons={hegemons}
      setHegemons={setHegemons}
      color={color}
      scale={1}
      selectedHegemonAttack={selectedHegemonAttack}
      setSelectedHegemonMovement={setSelectedHegemonMovement}
      setSelectedHegemonAttack={setSelectedHegemonAttack}
      insurgents={insurgents}
      setInsurgents={setInsurgents}
      game={game}
      setGame={setGame}
      config={config}
      key={hex.id}
    />
  ));

  return (
    <div
      className={
        selectedHegemonAttack.col >= 0 ? "attackHexes" : "previewHexes"
      }
      style={{
        opacity: "0.7",
      }}
    >
      {hexPreviews}
    </div>
  );
};
