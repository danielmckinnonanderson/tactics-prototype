import { Direction } from './src/actions';
import { Arena } from './src/arena';

// Entities are just an identifier, in this case their names
const entities = ['joe', 'ganesh', 'ashley', 'devon'] as const;
type Entity = (typeof entities)[keyof typeof entities];

// Our fake sprites, single-character representations of entities
const sprites = new Map<Entity, string>([
  ['joe', 'J'],
  ['ganesh', 'G'],
  ['ashley', 'A'],
  ['devon', 'D']
]);

const teams = new Map<Entity, 0 | 1>([
  ['joe', 0],
  ['ganesh', 0],
  ['ashley', 1],
  ['devon', 1]
]);

const arena: Arena = new Arena(9, 12);

// Update starting positions
arena.set(entities[0], [3, 2]);
arena.set(entities[1], [6, 2]);
arena.set(entities[2], [3, 9]);
arena.set(entities[3], [6, 9]);

type TakingTurnState = {
  movementPointsRemaining: number;
  movementHistory: Direction[];
  ownerEndedTurn: boolean;
};

function main(): void {
  const currentTurnIdx: keyof typeof entities = 0;

  let winConditionAcheived: boolean = false;

  while (!winConditionAcheived) {
    const intermediateState: TakingTurnState = {
      // Every entity will get 3 movement points for now
      movementPointsRemaining: 3,

      // Update movement history as the owner inputs legal movements
      movementHistory: [],

      // If the owner ends their turn, we will induce
      // action satisfied by current movement & proceed
      // to next entity's turn
      ownerEndedTurn: false
    };

    while (intermediateState.ownerEndedTurn === false) {
      const takingTurn: Entity = entities[currentTurnIdx];

      // Get the current position of the entity
      const maybeFound: [number, number] | undefined = arena.find(takingTurn);

      if (maybeFound === undefined) {
        throw new Error(`Couldn't find ${takingTurn} in the arena, fatal error!`);
      }

      const [x, y]: [number, number] = maybeFound;
      
      // Get list of legal movements given entity's position
      const legalMovements: Direction[] = arena.legalMovementsFrom([x, y]);
      // Get list of possible actions for this entity

      // Poll for movement input

      // Induce movement

      // Check the 
    }
  }
}

main();

