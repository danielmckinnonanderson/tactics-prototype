import { Direction } from './src/actions';
import { Arena, ArenaSquares } from './src/arena';
import { Entity, GameState, initialGameState } from './src/game';

type TurnState = {
  maxMovementPoints: number;
  movementPointsRemaining: number;
  movementHistory: Direction[];
  ownerEndedTurn: boolean;
};

// The whole shebang.
// Pass in a list of commands to be yielded in order (for 
//  testing purposes) or use the default stdin
//  and read commands from the console.
function main(inputs: AsyncIterable<string> = console): void {
  const entities = ["Fortitude", "Justice", "Temperance", "Prudence"];
  const game: GameState = initialGameState(entities);
  const arena: ArenaSquares = Arena.create(9, 12);

  let currentTurnIdx: number = 0;
  let winConditionAcheived: boolean = false;

  while (!winConditionAcheived) {
    const intermediateState: TurnState = {
      // Every entity will get 3 movement points for now
      maxMovementPoints: 3,
      movementPointsRemaining: 3,

      // Update movement history as the owner inputs legal movements
      movementHistory: [],

      // If the owner ends their turn, we will induce
      // action satisfied by current movement & proceed
      // to next entity's turn
      ownerEndedTurn: false
    };

    while (intermediateState.ownerEndedTurn === false) {
      const takingTurn: Entity = game.entities[currentTurnIdx];

      // Get the current position of the entity
      const position = game.positions.get(takingTurn)!;

      // Get list of legal movements given entity's position
      const legalMovements: Direction[] = Arena.legalMovementsFrom(position, arena);

      // Get list of possible actions for this entity

      // Poll for user input command

      // Induce command (move or end turn)

      // Check remaining movement points, if zero
      //  then (optionally) induce action satisfied by movementHistory
      //  and proceed to next turn
      currentTurnIdx = (currentTurnIdx + 1) % game.entities.length;
    }
  }
}

main();

