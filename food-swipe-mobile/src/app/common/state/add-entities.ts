type KeySelector<T> = (model: T) => string;

export function addEntities<I, E>(
  ids: I[],
  entities: Map<I, E>,
  data: E[],
  keySelector?: KeySelector<E>,
): { ids: I[]; entities: Map<I, E> } {
  const idsCopy = [...ids];
  const entitiesCopy = new Map<I, E>(entities);
  for (const entity of data) {
    const key = (keySelector ? keySelector(entity) : 'id') as keyof E;
    const id = entity[key] as unknown as I;
    idsCopy.push(id);
    idsCopy.sort();
    entitiesCopy.set(id, entity);
  }
  return { ids: idsCopy, entities: entitiesCopy };
}
