import { describe, expect, test } from 'bun:test';
import { GameState, initialGameState } from '../src/game';

describe('Game', () => {
  // What's important about recreational programming is that it makes you happy. 
  const fourEntityperors = ["galba", "otho", "vitellius", "vespasian"];

  test('Default game state initializes correctly', () => {
    const result: GameState = initialGameState(fourEntityperors);

    expect(result.entities).toEqual(fourEntityperors);

    expect(result.health.size).toEqual(4);
    expect(result.health.get("galba")?.max).toEqual(13);
    expect(result.health.get("otho")?.current).toEqual(13);

    expect(result.teams.size).toEqual(4);

    expect(result.arenaDimensions.width).toEqual(0);
    expect(result.arenaDimensions.height).toEqual(0);

    // Positions should not be initialized by default
    expect(result.positions.size).toEqual(0);

    expect(result.actions.size).toEqual(4);
    expect(result.actions.get("vespasian")?.length).toEqual(2);
    expect(result.actions.get("vitellius")![0]?.name).toEqual("Excelsior");
    expect(result.actions.get("otho")![1]?.inputMovement).toEqual(["down", "right", "up"]);
    expect(result.actions.get("galba")![1]?.outputEffectedTiles).toEqual([[1, 0]]);
    expect(result.actions.get("vespasian")![0]?.outputEffect).toBeDefined();

    expect(result.availableActions.size).toEqual(4);
  });

  test('More than four entities throws an error', () => {
    expect(() => initialGameState([...fourEntityperors, "titus" ])).toThrow();
  });
});
