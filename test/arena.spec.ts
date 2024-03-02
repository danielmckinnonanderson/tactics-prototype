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

  test('can convert its board to a string representation', () => {
    const sq = [
      ['cloud', null, 'barret'],
      [null, 'tifa', null]
    ];

    const arena = Arena.fromSquares(sq);
    const result = arena.display();

    expect(result)
      .toEqual(' C |   | B \n   | T |   ');
  })
});

