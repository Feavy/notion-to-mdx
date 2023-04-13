export default function toMap<T, K extends keyof T>(array: T[], key: K): Map<T[K], T> {
  return new Map(array.map(item => [item[key], item]));
}

export function toMultimap<T, K extends keyof T>(array: T[], key: K): Map<T[K], T[]> {
  const map = new Map<T[K], T[]>();
  for (const item of array) {
    const k = item[key];
    const items = map.get(k) || [];
    items.push(item);
    map.set(k, items);
  }
  return map;
}