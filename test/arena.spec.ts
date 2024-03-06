import { describe, expect, test } from "bun:test";
import { Arena, ArenaSquares, directionFromSquares, squareFromDirection } from "../src/arena";

describe('Arena', () => {
  test('can update squares within its bounds', () => {
    const arena: ArenaSquares = [
      [null, null, 'foo'],
      [null, 'bar', null]
    ];

    Arena.set('baz', [0, 1], arena);
    expect(arena[0][1]).toStrictEqual('baz');

    Arena.set(null, [0, 2], arena);
    expect(arena[0][2]).toStrictEqual(null);
  });

  test('exports a function which finds entity in arena', () => {
    const arena: ArenaSquares = [
      ['cloud', null, 'barret'],
      [null, 'tifa', null]
    ];

    expect(Arena.find('cloud', arena)).toEqual([0, 0]);
    expect(Arena.find('tifa', arena)).toEqual([1, 1]);
    expect(Arena.find('barret', arena)).toEqual([0, 2]);

    // After disc 2
    expect(Arena.find('aerith', arena)).toBeUndefined();
  });

  test('can determine the legal moves from any given position', () => {
    const arena: ArenaSquares = [
      [null, null, null, null],
      [null, 'cloud', null, 'barret'],
      ['yuffie', null, 'tifa', null],
      ['red-xiii', null, null, null]
    ];

    // Tifa's position
    const tifaPosition = [2, 2];
    let result = Arena.legalMovementsFrom(tifaPosition as [number, number], arena);

    // Target position was on the board, so result should exist
    expect(result).toBeDefined();
    // All squares around Tifa are open, so length should be 4
    expect(result.length).toEqual(4);
    expect(result).toStrictEqual(["up", "down", "left",  "right"]);

    const barretPosition = [1, 3];
    result = Arena.legalMovementsFrom(barretPosition as [number, number], arena);

    // Target position was on the board, so result should exist
    expect(result).toBeDefined();
    // Barret is on the boundary, so right would be OOB
    expect(result.length).toEqual(3);
    expect(result).toStrictEqual(["up", "down", "left"]);

    const redPosition = [3, 0];
    result = Arena.legalMovementsFrom(redPosition as [number, number], arena);
    expect(result).toBeDefined();
    expect(result.length).toEqual(1);
    expect(result).toStrictEqual(["right"]);

    // Target position is not on the board, so result should be empty 
    const wayOff: [number, number] = [27, 32.001];
    result = Arena.legalMovementsFrom(wayOff, arena);
    expect(result).toBeDefined();
    expect(result.length).toEqual(0);
  });

  test('can move a given entity to the provided direction', () => {
    const arena: ArenaSquares = [
      [null,   null,   null,  null],
      [null, 'cloud',  null, 'barret'],
      [null,   null,  'tifa', null],
      [null,   null,   null,  null],
      [null,   null,   null,  null]
    ];

    // Move Tifa up a (visual) row
    let result = Arena.moveInDirection('tifa', 'up', arena);
    expect(result).toBeDefined();
    expect(result).toStrictEqual([1, 2]);
    expect(Arena.find('tifa', arena)).toStrictEqual([1, 2]);
    expect(Arena.find('cloud', arena)).toStrictEqual([1, 1]);
    expect(Arena.find('barret', arena)).toStrictEqual([1, 3]);
    expect(arena[1][2]).toStrictEqual('tifa');
    expect(arena[2][2]).toStrictEqual(null);

    // Now let's try to move into an already-occupied square
    // since Cloud & Barret are now to the left & right
    result = Arena.moveInDirection('tifa', 'right', arena);
    // Illegal move, so result should be undefined
    expect(result).toBeUndefined();
    // Verify the arena is unchanged
    expect(Arena.find('tifa', arena)).toStrictEqual([1, 2]);

    // Now let's try to move Barret off the board
    result = Arena.moveInDirection('barret', 'right', arena);
    expect(result).toBeUndefined();
    // Verify the arena is unchanged
    expect(Arena.find('barret', arena)).toStrictEqual([1, 3]);
  });

  test('has convenience method for determining whether a square is empty', () => {
    const arena: ArenaSquares = [
      [null, 'bach', null],
      ['beethoven', 'chopin', 'liszt']
    ];

    expect(Arena.isSquareEmpty([-1000000000, -43234], arena)).toBeFalse();
    expect(Arena.isSquareEmpty([0, 0], arena)).toBeTrue();
    expect(Arena.isSquareEmpty([0, 1], arena)).toBeFalse();
    expect(Arena.isSquareEmpty([0, 2], arena)).toBeTrue();
    expect(Arena.isSquareEmpty([1, 0], arena)).toBeFalse();
    expect(Arena.isSquareEmpty([1, 1], arena)).toBeFalse();
    expect(Arena.isSquareEmpty([1, 2], arena)).toBeFalse();
    expect(Arena.isSquareEmpty([43.0219329, 3.141592], arena)).toBeFalse();
  });

  test('has convenience method for determining whether a square exists', () => {
    const arena: ArenaSquares = [
      [null, 'bach'],
      ['beethoven', null],
      [null, null],
      [null, null],
      [null, 'liszt']
    ];

    expect(Arena.has([-1, -1], arena)).toBeFalse();
    expect(Arena.has([0, 0], arena)).toBeTrue();
    expect(Arena.has([2, 2], arena)).toBeFalse();
    expect(Arena.has([1.0000001, 1.00000001], arena)).toBeFalse();
    expect(Arena.has([0, 1], arena)).toBeTrue();
    expect(Arena.has([1, 0], arena)).toBeTrue();
    expect(Arena.has([1, 1], arena)).toBeTrue();
    expect(Arena.has([4, 1], arena)).toBeTrue();
  });
});

describe('Helper functions', () => {
  test('can determine the direction from two coordinates', () => {
    expect( directionFromSquares([1, 3], [0, 3]) ).toEqual('left');
    expect( directionFromSquares([1, 3], [2, 3]) ).toEqual('right');
    expect( directionFromSquares([1, 3], [1, 4]) ).toEqual('up');
    expect( directionFromSquares([1, 3], [1, 2]) ).toEqual('down');
  });

  test('can determine the coordinates from a direction', () => {
    expect( squareFromDirection([1, 3], 'left') ).toEqual([1, 2]);
    expect( squareFromDirection([1, 3], 'right') ).toEqual([1, 4]);
    expect( squareFromDirection([1, 3], 'up') ).toEqual([0, 3]);
    expect( squareFromDirection([1, 3], 'down') ).toEqual([2, 3]);
  });
});

