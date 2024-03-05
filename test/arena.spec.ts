import { describe, expect, test } from "bun:test";
import { Arena } from "../src/arena";

describe('Arena', () => {
  test('exports a constructor which creates arena from dimensions', () => {
    const arena = new Arena(3, 3);
    expect(arena.value()).toEqual([
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ]);
  });

  test('can create Arena from existing grid of squares', () => {
    const sq = [
      [null, null, 'foo'],
      [null, 'bar', null]
    ];

    const arena = Arena.fromSquares(sq);

    expect(arena.value()).toStrictEqual(sq);
  });

  test('can update squares within its bounds', () => {
    const sq = [
      [null, null, 'foo'],
      [null, 'bar', null]
    ];

    const arena = Arena.fromSquares(sq);

    arena.set('baz', [0, 1]);
    expect(arena.value()[0][1]).toStrictEqual('baz');

    arena.set(null, [0, 2]);
    expect(arena.value()[0][2]).toStrictEqual(null);
  });

  test('exports a function which finds entity in arena', () => {
    const sq = [
      ['cloud', null, 'barret'],
      [null, 'tifa', null]
    ];

    const arena = Arena.fromSquares(sq);

    expect(arena.find('cloud')).toEqual([0, 0]);
    expect(arena.find('tifa')).toEqual([1, 1]);
    expect(arena.find('barret')).toEqual([0, 2]);

    // After disc 2
    expect(arena.find('aerith')).toBeUndefined();
  });

  test('can determine the legal moves from any given position', () => {
    const sq = [
      [null,   null,   null,  null],
      [null, 'cloud',  null, 'barret'],
      [null,   null,  'tifa', null],
      [null,   null,   null,  null]
    ];

    const arena = Arena.fromSquares(sq);

    // Tifa's position
    const tifaPosition = [2, 2];
    let result = arena.legalMovementsFrom(tifaPosition as [number, number]);

    // Target position was on the board, so result should exist
    expect(result).toBeDefined();
    // All squares around Tifa are open, so length should be 4
    expect(result.length).toEqual(4);
    expect(result).toStrictEqual(["up", "down", "left",  "right"]);

    const barretPosition = [1, 3];
    result = arena.legalMovementsFrom(barretPosition as [number, number]);

    // Target position was on the board, so result should exist
    expect(result).toBeDefined();
    // Barret is on the boundary, so right would be OOB
    expect(result.length).toEqual(3);
    expect(result).toStrictEqual(["up", "down", "left"]);

    // Target position is not on the board, so result should be empty 
    const wayOff: [number, number] = [27, 32.001];
    result = arena.legalMovementsFrom(wayOff);
    expect(result).toBeDefined();
    expect(result.length).toEqual(0);
  });

  test('can move a given entity to the provided direction', () => {

  });

  test('can move a given entity to the provided position', () => {

  });

  test('has convenience method for determining whether a square is empty', () => {
    const sq = [
      [null, 'bach'],
      ['beethoven', null]
    ];

    const arena = Arena.fromSquares(sq);

    expect(arena.isSquareEmpty([-1000000000, -43234])).toBeFalse();
    expect(arena.isSquareEmpty([0, 0])).toBeTrue();
    expect(arena.isSquareEmpty([0, 1])).toBeFalse();
    expect(arena.isSquareEmpty([1, 0])).toBeFalse();
    expect(arena.isSquareEmpty([1, 1])).toBeTrue();
    expect(arena.isSquareEmpty([43.0219329, 3.141592])).toBeFalse();
  });

  test('has convenience method for determining whether a square exists', () => {
    const sq = [
      [null, 'bach'],
      ['beethoven', null]
    ];

    const arena = Arena.fromSquares(sq);

    expect(arena.has([-1, -1])).toBeFalse();
    expect(arena.has([0, 0])).toBeTrue();
    expect(arena.has([2, 2])).toBeFalse();
    expect(arena.has([1.0000001, 1.00000001])).toBeFalse();
    expect(arena.has([0, 1])).toBeTrue();
    expect(arena.has([1, 0])).toBeTrue();
    expect(arena.has([1, 1])).toBeTrue();
  });

  test('can convert its board to a string representation', () => {
    const sq = [
      ['cloud', null, 'barret'],
      [null, 'tifa', null]
    ];

    const arena = Arena.fromSquares(sq);
    const result = arena.display();

    expect(result)
      .toEqual(' C |   | B \n   | T |   ');
  });
});

