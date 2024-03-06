import { Direction } from "./actions";

// Arena is a 2D array of tiles, where a tile
// is either null (for unoccupied) or a string
// identifier for the entity that occupies it.
export type ArenaSquares = (string | null)[][];

export type Square = [number, number];

export namespace Arena {
  /**
   * Create a new arena with the given width and height.
   * Initialize all squares to `null`.
   */
  export function create(width: number, height: number): ArenaSquares {
    return Array.from({ length: height }, () => Array(width).fill(null));
  }

  /**
   * Find the position of the given entity within the arena provided.
   * If the entity does not exist on the board, returns `undefined`.
   */
  export function find(entity: string, within: ArenaSquares): Square | undefined {
    for (let i = 0; i < within.length; i++) {
      const column = within[i];

      for (let j = 0; j < column.length; j++) {
        const cell = column[j];

        if (cell === entity) {
          return [i, j];
        }
      }
    };

    return undefined;
  }

  /** 
   * Move the given entity to the specified position within the arena provided.
   * Updates the arena in place, putting the entity in the specified position and
   *  setting its previous position to `null` (empty).
   * If the entity does not exist on the baord, or desired position is illegal, returns `undefined`.
   */
  export function moveInDirection(
    entity: string,
    direction: Direction,
    within: ArenaSquares
  ): Square | undefined {
    const currentPos = find(entity, within);

    if (currentPos === undefined) { 
      console.warn(`Called move for entity ${entity} but it wasn't found in the arena.`);
      return undefined;
    }

    const nextPosition = squareFromDirection(currentPos, direction);

    if (!isSquareEmpty(nextPosition, within)) {
      console.warn(`Called move for entity ${entity} but the desired position is illegal. Desired position is ${nextPosition}`);
      return undefined;
    }

    set(null, currentPos, within);
    const updated: void | { error: any } = set(entity, nextPosition, within);

    if (typeof updated === "object" && "error" in updated) {
      console.warn(updated.error);
      return;
    }

    return nextPosition;
  }

  /**
   * Predicate indicating whether given position is empty within the arena provided.
   */
  export function isSquareEmpty(position: Square, within: ArenaSquares): boolean {
    const [x, y] = position;
    return within[x] !== undefined 
      && within[x][y] === null;
  }

  /**
   * Given a position within an arena, return a list of directions that could legally
   * be moved to from that position.
   */
  export function legalMovementsFrom(position: Square, within: ArenaSquares): Direction[] {
    const [x, y] = position;
    const legalDirections: Direction[] = [];

    if (within[x - 1] !== undefined
    && within[x - 1][y] === null) {
      legalDirections.push('up');
    }

    if (within[x + 1] !== undefined
    && within[x + 1][y] === null) {
      legalDirections.push('down');
    }
 
    if (within[x] !== undefined
    && within[x][y - 1] === null) {
      legalDirections.push('left');
    }

    if (within[x] !== undefined
    && within[x][y + 1] === null) {
      legalDirections.push('right');
    }

    return legalDirections;
  }

  /**
   * Set the given entity (or empty) to the specified position within the arena provided.
   * If the square does not exist, returns an error message in an object.
   * Otherwise updates the arena in place and returns nothing.
   */
  export function set(
    entity: string | null,
    position: Square,
    within: ArenaSquares
  ): void | { error: any } {
    const [x, y] = position;

    if (x >= within.length 
    || x < 0) {
      return {
        error: `Couldn't set ${entity} at non-existant X position ${position[0]}`,
      };
    }

    if (y >= within[0].length
    || y < 0) {
      return {
        error: `Couldn't set ${entity} at non-existant Y position ${position[0]}`,
      };
    }

    within[x][y] = entity;
  }

  /**
   * Predicate indicating whether given position is within the bounds of the arena provided.
   */
  export function has(
    position: Square,
    within: ArenaSquares
  ): boolean {
    return within[position[0]] !== undefined 
      && within[position[0]][position[1]] !== undefined;
  }
}

/**
 * Given a square and a direction, return the square that is in that direction.
 */
export function squareFromDirection(
  origin: Square,
  direction: Direction
): [number, number] {
  switch (direction) {
    case "up":    return [origin[0] - 1, origin[1]];
    case "down":  return [origin[0] + 1, origin[1]];
    case "left":  return [origin[0],     origin[1] - 1];
    case "right": return [origin[0],     origin[1] + 1];
  }
}

/**
 * Given two squares, return their relationship as a direction, or
 * `undefined` if the squares are not adjacent.
 * FIXME - This should probably be updated to check strict adjacency,
 *          ie no more than 1 unit away.
 */
export function directionFromSquares(
  start: Square,
  end: Square 
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

