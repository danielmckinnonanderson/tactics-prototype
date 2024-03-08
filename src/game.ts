import { ExcelsiorAction, GameAction, KowabungaAction } from "./actions";
import { Square } from "./arena";

// An entity is just a name.
export type Entity = string;

export type Health = {
  current: number;
  max: number;
};

export type GameState = {
  // The keys to all other elements in the game state
  entities: readonly string[];

  // Do I really need to explain this
  teams: Map<Entity, 0 | 1>;

  // Determines which way is forwards for a given entity,
  //  since there is no rotation in movement.
  movingTowards: Map<Entity, "top" | "bottom">

  health: Map<Entity, Health>;

  // Current position of entity within the arena
  positions: Map<Entity, Square>;

  // Irregular sizes / shapes of arena are not supported
  arenaDimensions: { width: number, height: number};

  // All actions that the entity *could* utilize (does not change)
  actions: Map<Entity, GameAction[]>;

  // Actions available to an entity, given the current gamestate.
  // This will be updated during the turn as the entity moves
  //  and invalidates some options by not adhering to their input
  //  movements.
  availableActions: Map<Entity, GameAction[]>;

  sprites: Map<Entity, string>;
};

export function initialGameState(entities: Entity[]): GameState {
  if (entities.length !== 4) {
    throw new Error(`Only *exactly* four entities are supported right now bossman.`);
  }

  const health = entities.reduce((acc, entity) => {
    acc.set(entity, defaultHealth());
    return acc;
  }, new Map<Entity, Health>());

  const teams = entities.reduce((acc, entity) => {
    switch (acc.size) {
      case 0: acc.set(entity, 0); break;
      case 1: acc.set(entity, 0); break;
      case 2: acc.set(entity, 1); break;
      case 3: acc.set(entity, 1); break;
      default: throw new Error(`Too many entities, can't handle more than 4`);
    };
    return acc;
  }, new Map<Entity, 0 | 1>());

  const movingTowards = entities.reduce((acc, entity) => {
    switch (teams.get(entity)) {
      case 0: acc.set(entity, "top"); break;
      case 1: acc.set(entity, "bottom"); break;
      default: throw new Error(`Too many entities, can't handle more than 4`);
    };
    return acc;
  }, new Map<Entity, "top" | "bottom">());

  const actions = entities.reduce((acc, entity) => {
    acc.set(entity, defaultActions());
    return acc;
  }, new Map<Entity, GameAction[]>());

  const sprites = entities.reduce((acc, entity) => {
    switch (acc.size) {
      case 0: acc.set(entity, "🐢"); break;
      case 1: acc.set(entity, "🦌"); break;
      case 2: acc.set(entity, "🐴"); break;
      case 3: acc.set(entity, "🐕"); break;
      default: throw new Error(`Too many entities, can't handle more than 4`);
    };
    return acc;
  }, new Map<Entity, string>());

  return {
    entities,
    arenaDimensions: { width: 0, height: 0 },
    teams,
    movingTowards,
    health,
    positions: new Map(),
    actions,
    availableActions: actions,
    sprites,
  }
}

function defaultActions(): GameAction[] {
  return [
    ExcelsiorAction,
    KowabungaAction,
  ]
}

function defaultHealth(): Health {
  return {
    max: 13,
    current: 13,
  };
}

