import { Direction } from "./actions";
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
    && this.squares[x - 1][y] !== null) {
      legalDirections.push('up');
    }

    if (this.squares[x + 1] !== undefined
    && this.squares[x + 1][y] !== null) {
      legalDirections.push('down');
    }
 
    if (this.squares[x] !== undefined
    && this.squares[x][y - 1] !== null) {
      legalDirections.push('left');
    }

    if (this.squares[x] !== undefined
    && this.squares[x][y + 1] !== null) {
      legalDirections.push('right');
    }

    return legalDirections;
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

