import { Direction } from "./actions";
import { Arena, ArenaSquares } from "./arena";

// Command pattern to encapsulate user actions during their turn
// In-game AI & player will be expected to produce a series of
// commands during their turn

export const MoveCommand = (
  entity: any,
  arena: ArenaSquares,
  direction: Direction
) => {
  if (!("name" in entity)) {
    console.warn(`Entity ${entity} tried to induce a move command, but they have no name.`);
    return;
  }

  const maybeFound = arena.find(entity.name);

  if (!maybeFound) {
    console.warn(`Entity ${entity} tried to induce a move command, but they were not found in the arena.`);
    return;
  }

  // FIXME
  // At this point we know we have the position of the target entity,
  // so let's figure out what legal moves we have
  // const found: [number, number] = maybeFound;
  // const legalMoves = Arena.legalMovementsFrom(found);

  // if (legalMoves.length === 0) {
  //   console.warn(`Entity {entity} tried to induce a move command, but has no legal moves.`);
  //   return;
  // }

  // if (!legalMoves.includes(direction)) {
  //   console.warn(`Entity {entity} tried to induce a move command, but wanted to move in an illegal direction. Direction was ${direction}`);
  //   return;
  // }

  // If we have reached this point without error, we can induce the move
  // arena.moveInDirection(entity.name, direction);
}

