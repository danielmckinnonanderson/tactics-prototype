
/**
 * NOTE - Current implementation assumes that entities
 *         all have a unique first letter.
 */
export function toSprite(entity: string): string {
  return entity[0].toLocaleUpperCase();
}

