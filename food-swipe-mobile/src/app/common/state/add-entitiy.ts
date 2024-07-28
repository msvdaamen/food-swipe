type KeySelector<T> = (model: T) => string;

export function addEntity<I, E>(
  ids: I[],
  entities: Map<I, E>,
  data: E,
  keySelector?: KeySelector<E>,
) {
  const idsCopy = [...ids];
  const entitiesCopy = new Map<I, E>(entities);
  const key = (keySelector ? keySelector(data) : 'id') as keyof E;
  const id = data[key] as unknown as I;
  idsCopy.push(id);
  idsCopy.sort();
  entitiesCopy.set(id, data);
  return { ids: idsCopy, entities: entitiesCopy };
}
