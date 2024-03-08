import { Direction } from "./actions";
import { Square } from "./arena";
import { Entity, GameState } from "./game";

// Command pattern to encapsulate user actions during their turn
// In-game AI & player will be expected to produce a series of
// commands during their turn
export const MoveCommand = (
  entity: Entity,
  game: GameState,
  direction: Direction
) => {
  const current: Square | undefined = game.positions.get(entity);

  if (!current) {
    console.error(`Entity {entity} tried to induce a move command, but has no position.`);
    return;
  }

  // FIXME
  // At this point we know we have the position of the target entity,
  // so let's figure out what legal moves we have


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

