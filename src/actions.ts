export type Direction =
  | "left"
  | "right"
  | "up"
  | "down";

export function coordsFromDirection(
  origin: [number, number],
  direction: Direction
): [number, number] {
  switch (direction) {
    case "left":  return [origin[0] - 1, origin[1]];
    case "right": return [origin[0] + 1, origin[1]];
    case "up":    return [origin[0],     origin[1] + 1];
    case "down":  return [origin[0],     origin[1] - 1];
  }
}

export function directionFromCoords(
  start: [number, number],
  end: [number, number]
): Direction | undefined {
  const [startX, startY] = start;
  const [endX, endY] = end;

  let possible: Direction[] = ["left", "right", "up", "down"];

  if (endX > startX) {
    possible = possible.filter(d => d !== "left");
  } else if (endX < startX) {
    possible = possible.filter(d => d !== "right");
  } else {
    // If it's equal then there is no horizontal movement, only vertical
    possible = possible.filter(d => d !== "right" && d !== "left");
  }

  if (endY > startY) {
    possible = possible.filter(d => d !== "down");
  } else if (endY < startY) {
    possible = possible.filter(d => d !== "up");
  } else {
    possible = possible.filter(d => d !== "up" && d !== "down");
  }

  // Since we've filtered out all the illegal directions,
  // the first index will either be the only remaining legal direction
  // or `undefined` if there are no legal moves left.
  return possible[0];
}

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

