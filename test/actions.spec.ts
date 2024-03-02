import { describe, test } from "bun:test";
import { Arena } from "../src/arena";

describe('actions', () => {
  test('multi-attack effects multiple targets', () => {
    const arena = new Arena(5, 5);

    arena.set('foo', [0, 0]);
    arena.set('bar', [0, 1]);
  });
});

