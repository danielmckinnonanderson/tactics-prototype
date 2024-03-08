import { Square } from "./arena";
import { GameState } from "./game";

export type Direction =
  | "left"
  | "right"
  | "up"
  | "down";

export type GameAction = {
  name: string;
  inputMovement: Direction[];
  outputEffectedTiles: Square[];

  // Function which updates the gamestate
  outputEffect: (state: GameState) => void
};

export const ExcelsiorAction: GameAction = {
  name: "Excelsior",
  inputMovement: ["left", "right", "right"],
  outputEffectedTiles: [[-1, 1]],
  outputEffect: (_state: GameState) => {
    console.log('Excelsior!');
  }
};

export const KowabungaAction: GameAction = {
  name: "Kowabunga",
  inputMovement: ["down", "right", "up"],
  outputEffectedTiles: [[1, 0]],
  outputEffect: (_state: GameState) => {
    console.log('Kowabunga!');
  }
};

