export type Hegemon = {
  id: string;
  col: number;
  row: number;
  moves: number;
};

export type Hexagon = {
  id: string;
  col: number;
  row: number;
};

export type Insurgent = {
  id: string;
  hex1: Hexagon;
  hex2: Hexagon;
  hex3: Hexagon;
  orientation: "base" | "up" | "down";
  willBeAttacked: boolean;
  attacked: number;
  moves: number;
};

export type Point = {
  id: string;
  hex1: Hexagon;
  hex2: Hexagon;
  hex3: Hexagon;
  distance: number;
};

export type Game = {
  gameplayState:
    | "preStart"
    | "insurgentStart"
    | "hegemonStart"
    | "insurgentMove"
    | "insurgentPlace"
    | "hegemonMove"
    | "insurgentWin"
    | "hegemonWin";

  deadInsurgents: number;
  deadHegemons: number;
};

export type Config = {
  title: string;
  year: string;
  height: number;
  width: number;
  insurgentMoves: number;
  hegemonMoves: number;
  startInsurgents: number;
  startHegemons: number;
  insurgentsToDie: number;
  hegemonsToDie: number;
  infoContent: string;
  locations: Location[];
  board: number[][];
};

export type Location = {
  name: string;
  fontSize: string;
  color: string;
  rotate: string;
  top: string;
  left: string;
};
