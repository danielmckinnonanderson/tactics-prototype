export type Direction =
  | "left"
  | "right"
  | "up"
  | "down";


// 0, 0 is always current tile,
// x & y are relative to current
export type Tile = [number, number];

export type Option<T> = | T | null;

export type Action = {
  name: string;
  inputMovement: Direction[];
  outputEffectedTiles: Tile[];
  // Function which operates on any entities which reside
  //  in the outputEffectedTiles, relative to the ending position of
  //  the entity inducing this action.
  outputEffect: (entities: Option<any>[]) => void
};

const excelsior: Action = {
  name: "Excelsior",
  inputMovement: ["left", "right", "right"],
  outputEffectedTiles: [[-1, 1]],
  outputEffect: (entities: Option<any>[]) => {
    for (let entityOpt of entities) {
      if (entityOpt === null) continue;

      // If there is an entity in the effected tile,
      // subtract 1 from its health.
      entityOpt.currentHealth -= 1;
    }
  }
};

const multiStrike: Action = {
  name: "Multi Strike",
  inputMovement: ["left", "right", "down", "left"],
  outputEffectedTiles: [
    [-1, 1],
    [-1, 0]
  ],
  outputEffect: (entities: Option<any>[]) => {
    for (let entityOpt of entities) {
      if (entityOpt === null) continue;

      // If there is an entity in the effected tile,
      // subtract 1 from its health.
      entityOpt.currentHealth -= 1;
    }
  }
};

