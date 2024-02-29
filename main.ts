
type Direction =
  | "left"
  | "right"
  | "up"
  | "down";

// 0, 0 is always current tile,
// x & y are relative to current
type Tile = [number, number];

type Option<T> = | T | null;

type Action = {
  name: string;
  inputMovement: Direction[];
  outputEffectedTiles: Tile[];
  // Function which operates on any entities which reside
  //  in the outputEffectedTiles, relative to the ending position of
  //  the entity inducing this action.
  outputEffect: (entities: Option<Entity>[]) => void
};

type Entity = {
  id: number;
  currentHealth: number;
}

const excelsior: Action = {
  name: "Excelsior",
  inputMovement: ["left", "right", "right"],
  outputEffectedTiles: [[-1, 1]],
  outputEffect: (entities: Option<Entity>[]) => {
    for (let entityOpt of entities) {
      if (entityOpt === null) continue;

      // If there is an entity in the effected tile,
      // subtract 1 from its health.
      entityOpt.currentHealth -= 1;
    }
  }
};

