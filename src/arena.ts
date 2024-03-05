import { Direction, coordsFromDirection } from "./actions";
import { toSprite } from "./sprites";

// Arena is a 2D array of tiles, where a tile
// is either null (for unoccupied) or a string
// identifier for the entity that occupies it.
export type ArenaSquares = (string | null)[][];

export class Arena {
  private width: number;
  private height: number;
  private squares: ArenaSquares;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.squares = Array.from({ length: this.height }, () => Array(width).fill(null));
  }

  /**
   * Create a new arena from the given squares.
   * Irregular-sized row / column arenas are NOT SUPPORTED,
   * function will not error but behavior will be irregular.
   */
  public static fromSquares(squares: ArenaSquares): Arena {
    let result = new Arena(squares.length, squares[0].length);
    result.squares = squares;

    return result;
  }

  /**
   * Return the coordinates on `squares` where the given
   * entity resides, or `undefined` if the entity is not found.
   */
  find(entity: string): [number, number] | undefined {
    for (let i = 0; i < this.squares.length; i++) {
      const row = this.squares[i];

      for (let j = 0; j < row.length; j++) {
        const col = row[j];

        if (col === entity) {
          return [i, j];
        }
      }
    };

    return undefined;
  }

  /**
   * Move the given entity to the specified position.
   * If the position or entity do not exist, return `undefined`.
   * If successful, return the new position (same as the argument provided)
   */
  moveTo(entity: string, to: [x: number, y: number]): [x: number, y: number] | undefined {
    const currentPos = this.find(entity);

    if (currentPos === undefined) {
      console.warn(`Called move for entity ${entity} but it wasn't found in the arena.`);
      return;
    }

    // Update the old position to be empty.
    // We don't need to check for errors here because our call to `find` earlier
    // means that we know the position & entity exist.
    this.set(null, currentPos);
    // Update the new position to contain the entity
    const updated: void | { error: any } = this.set(entity, to);

    // Check for errors
    if (typeof updated === "object" && "error" in updated) {
      console.warn(updated.error);
      return
    }

    return to;
  }

  moveInDirection(entity: string, direction: Direction): [x: number, y: number] | undefined {
    const currentPos = this.find(entity);

    if (currentPos === undefined) { 
      console.warn(`Called move for entity ${entity} but it wasn't found in the arena.`);
      return undefined;
    }

    const nextPosition = coordsFromDirection(currentPos, direction);

    if (!this.isSquareEmpty(nextPosition)) {
      console.warn(`Called move for entity ${entity} but the desired position is illegal. Desired position is ${nextPosition}`);
    }

    this.set(null, currentPos);

    const updated: void | { error: any } = this.set(entity, nextPosition);

    if (typeof updated === "object" && "error" in updated) {
      console.warn(updated.error);
      return
    }

    return nextPosition;
  }

  set(entity: string | null, position: [x: number, y: number]): void | { error: any } {
    const [x, y] = position;

    if (x >= this.width 
    || x < 0) {
      return {
        error: `Couldn't set ${entity} at non-existant X position ${position[0]}`,
      };
    }

    if (y >= this.height
    || y < 0) {
      return {
        error: `Couldn't set ${entity} at non-existant Y position ${position[0]}`,
      };
    }

    this.squares[x][y] = entity;
  }

  legalMovementsFrom(position: [x: number, y: number]): Direction[] {
    const [x, y] = position;
    const legalDirections: Direction[] = [];

    if (this.squares[x - 1] !== undefined
    && this.squares[x - 1][y] === null) {
      legalDirections.push('up');
    }

    if (this.squares[x + 1] !== undefined
    && this.squares[x + 1][y] === null) {
      legalDirections.push('down');
    }
 
    if (this.squares[x] !== undefined
    && this.squares[x][y - 1] === null) {
      legalDirections.push('left');
    }

    if (this.squares[x] !== undefined
    && this.squares[x][y + 1] === null) {
      legalDirections.push('right');
    }

    return legalDirections;
  }

  has(position: [x: number, y: number]): boolean {
    return this.squares[position[0]] !== undefined 
      && this.squares[position[0]][position[1]] !== undefined;
  }

  isSquareEmpty(position: [number, number]): boolean {
    return this.squares[position[0]] !== undefined 
      && this.squares[position[0]][position[1]] === null;
  }

  value(): ArenaSquares {
    return this.squares;
  }

  display(): string {
    // Convert empty (null) squares to whitespace ' ',
    // convert entities into 'sprites' (single characters)
    const format = (squares: ArenaSquares): string => {
      const displaySquare = (entity: string | null): string => 
        ` ${entity === null ? ' ' : toSprite(entity)} `;

      // Columns are separated by pipes, rows by newlines
      return squares.map(row =>
          row.map(col => displaySquare(col)).join('|')
        ).join('\n');
    }

    const formatted = format(this.squares);
    console.log(formatted);
    return formatted;
  }
}

